import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://api.mannatech.dmlabs.mx";

async function getServerToken(): Promise<string> {
  const res = await fetch(`${API}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.MEDUSA_ADMIN_EMAIL || "admin@dmlabs.mx",
      password: process.env.MEDUSA_ADMIN_PASSWORD || "Mannatech2026",
    }),
  });
  if (!res.ok) throw new Error("Auth failed");
  const data = await res.json();
  return data.token;
}

async function adminFetchServer(path: string, token: string) {
  const res = await fetch(`${API}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Medusa API error: ${res.status} ${path}`);
  return res.json();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "6m";

    const now = new Date();
    let fromDate: Date;

    switch (period) {
      case "1m":
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "last":
        fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case "3m":
        fromDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case "6m":
        fromDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        break;
      case "year":
        fromDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        fromDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    }

    const fromISO = fromDate.toISOString();
    const token = await getServerToken();

    const [ordersRes, productsRes, customersRes] = await Promise.all([
      adminFetchServer(`/admin/orders?limit=100&created_at[gte]=${fromISO}`, token),
      adminFetchServer(`/admin/products?limit=100&fields=id,title,handle,thumbnail,variants.prices.*`, token),
      adminFetchServer(`/admin/customers?limit=100`, token),
    ]);

    const orders: any[] = ordersRes.orders || [];
    const products: any[] = productsRes.products || [];
    const customers: any[] = customersRes.customers || [];

    // 1. Total revenue
    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0) / 100;

    // 2. Orders by status
    const statusCounts: Record<string, number> = { pending: 0, completed: 0, canceled: 0 };
    orders.forEach((o: any) => {
      const s = o.status || "pending";
      if (s in statusCounts) statusCounts[s]++;
      else statusCounts[s] = (statusCounts[s] || 0) + 1;
    });

    // 3. Top selling products (by order line items)
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    orders.forEach((o: any) => {
      const items = o.items || [];
      items.forEach((item: any) => {
        const pid = item.product_id || item.variant_id || item.title;
        if (!productSales[pid]) {
          productSales[pid] = { name: item.title || item.product_title || "Producto", quantity: 0, revenue: 0 };
        }
        productSales[pid].quantity += item.quantity || 1;
        productSales[pid].revenue += (item.total || item.unit_price * (item.quantity || 1)) / 100;
      });
    });
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // 4. Revenue by month
    const revenueByMonth: Record<string, number> = {};
    orders.forEach((o: any) => {
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      revenueByMonth[key] = (revenueByMonth[key] || 0) + (o.total || 0) / 100;
    });
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const revenueOverTime = Object.entries(revenueByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => {
        const [, m] = key.split("-");
        return { month: monthNames[parseInt(m) - 1], revenue: value };
      });

    // 5. Customer growth by month
    const customersByMonth: Record<string, number> = {};
    customers.forEach((c: any) => {
      const d = new Date(c.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      customersByMonth[key] = (customersByMonth[key] || 0) + 1;
    });
    const customerGrowth = Object.entries(customersByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => {
        const [, m] = key.split("-");
        return { month: monthNames[parseInt(m) - 1], customers: value };
      });

    // 6. Average order value
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // New customers in period
    const newCustomers = customers.filter((c: any) => new Date(c.created_at) >= fromDate).length;

    return NextResponse.json({
      totalRevenue,
      totalOrders: orders.length,
      avgOrderValue,
      newCustomers,
      ordersByStatus: statusCounts,
      topProducts,
      revenueOverTime,
      customerGrowth,
      currency: orders[0]?.currency_code?.toUpperCase() || "MXN",
    });
  } catch (error: any) {
    console.error("Reportes API error:", error);
    return NextResponse.json({ error: error.message || "Error fetching reports" }, { status: 500 });
  }
}
