import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import {
  orderConfirmation,
  welcome,
  passwordReset,
  orderShipped,
} from "@/lib/email-templates";

const INTERNAL_SECRET = process.env.EMAIL_INTERNAL_SECRET || "mannatech-internal-2026";

const TEMPLATES: Record<string, (data: any) => string> = {
  "order-confirmation": orderConfirmation,
  welcome: welcome,
  "password-reset": passwordReset,
  "order-shipped": orderShipped,
};

const SUBJECTS: Record<string, (data: any) => string> = {
  "order-confirmation": (d) => `Pedido confirmado #${d.orderNumber}`,
  welcome: () => "Bienvenido a Mannatech",
  "password-reset": () => "Restablecer tu contrasena - Mannatech",
  "order-shipped": (d) => `Tu pedido #${d.orderNumber} ha sido enviado`,
};

export async function POST(request: NextRequest) {
  try {
    // Verify internal authorization
    const authHeader = request.headers.get("x-internal-secret");
    if (authHeader !== INTERNAL_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { template, to, data, subject: customSubject } = body;

    if (!template || !to || !data) {
      return NextResponse.json(
        { error: "Missing required fields: template, to, data" },
        { status: 400 }
      );
    }

    const templateFn = TEMPLATES[template];
    if (!templateFn) {
      return NextResponse.json(
        { error: `Unknown template: ${template}. Available: ${Object.keys(TEMPLATES).join(", ")}` },
        { status: 400 }
      );
    }

    const html = templateFn(data);
    const subject = customSubject || SUBJECTS[template]?.(data) || "Mannatech";

    const result = await sendEmail({ to, subject, html });

    return NextResponse.json({ sent: true, ...result });
  } catch (error) {
    console.error("[API Email] Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
