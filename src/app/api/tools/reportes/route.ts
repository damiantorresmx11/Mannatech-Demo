import { NextRequest, NextResponse } from "next/server";
import { getOrders, getProducts, getCustomers, isConfigured } from "@/lib/commerce/client";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET(request: NextRequest) {
  try {
    if (!isConfigured()) {
      return NextResponse.json({
        totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, newCustomers: 0,
        ordersByStatus: {}, topProducts: [], revenueOverTime: [], customerGrowth: [],
        currency: "MXN",
      });
    }

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

    const [ordersRes, productsRes, customersRes] = await Promise.allSettled([
      getOrders({ limit: 100, minDateCreated: fromISO }),
      getProducts({ limit: 100 }),
      getCustomers({ limit: 100 }),
    ]);

    const orders = ordersRes.status === "fulfilled" ? ordersRes.value.orders : [];
    const products = productsRes.status === "fulfilled" ? productsRes.value.products : [];
    const customers = customersRes.status === "fulfilled" ? customersRes.value.customers : [];

    // 1. Total revenue
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    // 2. Orders by status
    const statusCounts: Record<string, number> = { pending: 0, completed: 0, cancelled: 0 };
    orders.forEach((o) => {
      const s = o.estado || "pending";
      if (s in statusCounts) statusCounts[s]++;
      else statusCounts[s] = (statusCounts[s] || 0) + 1;
    });

    // 3. Top selling products (by order line items)
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    orders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const pid = item.productoId || item.nombre;
        if (!productSales[pid]) {
          productSales[pid] = { name: item.nombre || "Producto", quantity: 0, revenue: 0 };
        }
        productSales[pid].quantity += item.cantidad || 1;
        productSales[pid].revenue += item.total || 0;
      });
    });
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // 4. Revenue by month
    const revenueByMonth: Record<string, number> = {};
    orders.forEach((o) => {
      const d = new Date(o.creadoEn);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      revenueByMonth[key] = (revenueByMonth[key] || 0) + (o.total || 0);
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
    customers.forEach((c) => {
      const d = new Date(c.creadoEn);
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
    const newCustomers = customers.filter((c) => new Date(c.creadoEn) >= fromDate).length;

    return NextResponse.json({
      totalRevenue,
      totalOrders: orders.length,
      avgOrderValue,
      newCustomers,
      ordersByStatus: statusCounts,
      topProducts,
      revenueOverTime,
      customerGrowth,
      currency: orders[0]?.moneda?.toUpperCase() || "MXN",
    });
  } catch (error: any) {
    console.error("Reportes API error:", error);
    return NextResponse.json({ error: error.message || "Error fetching reports" }, { status: 500 });
  }
}
