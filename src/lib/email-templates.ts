// Mannatech Branded Email Templates
// Brand color: #2A7B3D | Clean, professional design with inline CSS

const BRAND_COLOR = "#2A7B3D";
const BRAND_DARK = "#1F5C2E";
const GRAY_BG = "#f7f7f7";
const GRAY_TEXT = "#666666";

function layout(content: string, preheader?: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mannatech</title>
</head>
<body style="margin:0;padding:0;background-color:${GRAY_BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  ${preheader ? `<div style="display:none;font-size:1px;color:${GRAY_BG};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${GRAY_BG};">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND_COLOR};padding:28px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:2px;">MANNATECH</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa;padding:24px 40px;border-top:1px solid #eeeeee;text-align:center;">
              <p style="margin:0;font-size:12px;color:#999999;">
                Mannatech &mdash; Bienestar con base cientifica
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#999999;">
                Este correo fue enviado automaticamente. No respondas a este mensaje.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Order Confirmation ─────────────────────────────────────────────────────

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderConfirmationData {
  customerName: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax?: number;
  total: number;
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
}

export function orderConfirmation(data: OrderConfirmationData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #eeeeee;">
        <strong style="color:#333333;">${item.name}</strong><br>
        <span style="color:${GRAY_TEXT};font-size:14px;">Cantidad: ${item.quantity}</span>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #eeeeee;text-align:right;color:#333333;font-weight:600;">
        $${item.price.toFixed(2)}
      </td>
    </tr>`
    )
    .join("");

  const addressHtml = data.shippingAddress
    ? `
    <div style="margin-top:24px;padding:16px;background-color:#f9f9f9;border-radius:6px;">
      <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#333333;">Direccion de envio:</p>
      <p style="margin:0;font-size:14px;color:${GRAY_TEXT};">
        ${data.shippingAddress.line1}<br>
        ${data.shippingAddress.line2 ? data.shippingAddress.line2 + "<br>" : ""}
        ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}
      </p>
    </div>`
    : "";

  const content = `
    <h2 style="margin:0 0 8px;color:#333333;font-size:22px;">Pedido confirmado</h2>
    <p style="margin:0 0 24px;color:${GRAY_TEXT};font-size:16px;">
      Hola ${data.customerName}, gracias por tu compra.
    </p>
    <div style="padding:12px 16px;background-color:#e8f5e9;border-radius:6px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:${BRAND_DARK};">
        <strong>Numero de pedido:</strong> ${data.orderNumber}
      </p>
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:8px 0;border-bottom:2px solid #eeeeee;font-size:12px;text-transform:uppercase;color:#999999;font-weight:600;">Producto</td>
        <td style="padding:8px 0;border-bottom:2px solid #eeeeee;font-size:12px;text-transform:uppercase;color:#999999;font-weight:600;text-align:right;">Precio</td>
      </tr>
      ${itemsHtml}
      <tr>
        <td style="padding:8px 0;font-size:14px;color:${GRAY_TEXT};">Subtotal</td>
        <td style="padding:8px 0;text-align:right;color:#333333;">$${data.subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-size:14px;color:${GRAY_TEXT};">Envio</td>
        <td style="padding:8px 0;text-align:right;color:#333333;">${data.shipping === 0 ? "Gratis" : "$" + data.shipping.toFixed(2)}</td>
      </tr>
      ${data.tax ? `<tr><td style="padding:8px 0;font-size:14px;color:${GRAY_TEXT};">Impuestos</td><td style="padding:8px 0;text-align:right;color:#333333;">$${data.tax.toFixed(2)}</td></tr>` : ""}
      <tr>
        <td style="padding:12px 0;font-size:18px;font-weight:700;color:#333333;border-top:2px solid #eeeeee;">Total</td>
        <td style="padding:12px 0;font-size:18px;font-weight:700;color:${BRAND_COLOR};text-align:right;border-top:2px solid #eeeeee;">$${data.total.toFixed(2)}</td>
      </tr>
    </table>
    ${addressHtml}
  `;

  return layout(content, `Tu pedido #${data.orderNumber} ha sido confirmado`);
}

// ─── Welcome Email ──────────────────────────────────────────────────────────

interface WelcomeData {
  customerName: string;
  loginUrl?: string;
}

export function welcome(data: WelcomeData): string {
  const content = `
    <h2 style="margin:0 0 8px;color:#333333;font-size:22px;">Bienvenido a Mannatech</h2>
    <p style="margin:0 0 24px;color:${GRAY_TEXT};font-size:16px;">
      Hola ${data.customerName}, tu cuenta ha sido creada exitosamente.
    </p>
    <p style="margin:0 0 24px;color:${GRAY_TEXT};font-size:15px;">
      Ahora puedes disfrutar de nuestros productos de bienestar con base cientifica.
      Explora nuestro catalogo y encuentra lo que necesitas para tu salud.
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${data.loginUrl || "https://mannatech.dmlabs.mx"}" style="display:inline-block;padding:14px 32px;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">
        Explorar productos
      </a>
    </div>
    <p style="margin:0;color:${GRAY_TEXT};font-size:14px;">
      Si tienes alguna pregunta, no dudes en contactarnos.
    </p>
  `;

  return layout(content, "Bienvenido a Mannatech - Tu cuenta esta lista");
}

// ─── Password Reset ─────────────────────────────────────────────────────────

interface PasswordResetData {
  customerName: string;
  resetUrl: string;
  expiresIn?: string;
}

export function passwordReset(data: PasswordResetData): string {
  const content = `
    <h2 style="margin:0 0 8px;color:#333333;font-size:22px;">Restablecer contrasena</h2>
    <p style="margin:0 0 24px;color:${GRAY_TEXT};font-size:16px;">
      Hola ${data.customerName}, recibimos una solicitud para restablecer tu contrasena.
    </p>
    <p style="margin:0 0 24px;color:${GRAY_TEXT};font-size:15px;">
      Haz clic en el boton de abajo para crear una nueva contrasena.
      ${data.expiresIn ? `Este enlace expira en ${data.expiresIn}.` : "Este enlace expira en 1 hora."}
    </p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${data.resetUrl}" style="display:inline-block;padding:14px 32px;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">
        Restablecer contrasena
      </a>
    </div>
    <p style="margin:0 0 8px;color:${GRAY_TEXT};font-size:13px;">
      Si no solicitaste este cambio, puedes ignorar este correo. Tu contrasena no sera modificada.
    </p>
    <p style="margin:0;color:#999999;font-size:12px;word-break:break-all;">
      Link directo: ${data.resetUrl}
    </p>
  `;

  return layout(content, "Solicitud de cambio de contrasena");
}

// ─── Order Shipped ──────────────────────────────────────────────────────────

interface OrderShippedData {
  customerName: string;
  orderNumber: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  estimatedDelivery?: string;
}

export function orderShipped(data: OrderShippedData): string {
  const trackingHtml =
    data.trackingNumber
      ? `
    <div style="margin:24px 0;padding:16px;background-color:#e8f5e9;border-radius:6px;">
      <p style="margin:0 0 8px;font-size:14px;color:${BRAND_DARK};font-weight:600;">Informacion de rastreo:</p>
      <p style="margin:0;font-size:14px;color:${GRAY_TEXT};">
        ${data.carrier ? `<strong>Paqueteria:</strong> ${data.carrier}<br>` : ""}
        <strong>Numero de guia:</strong> ${data.trackingNumber}
        ${data.estimatedDelivery ? `<br><strong>Entrega estimada:</strong> ${data.estimatedDelivery}` : ""}
      </p>
    </div>`
      : "";

  const trackingButton =
    data.trackingUrl
      ? `
    <div style="text-align:center;margin:32px 0;">
      <a href="${data.trackingUrl}" style="display:inline-block;padding:14px 32px;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">
        Rastrear pedido
      </a>
    </div>`
      : "";

  const content = `
    <h2 style="margin:0 0 8px;color:#333333;font-size:22px;">Tu pedido va en camino</h2>
    <p style="margin:0 0 24px;color:${GRAY_TEXT};font-size:16px;">
      Hola ${data.customerName}, tu pedido <strong>#${data.orderNumber}</strong> ha sido enviado.
    </p>
    ${trackingHtml}
    ${trackingButton}
    <p style="margin:0;color:${GRAY_TEXT};font-size:14px;">
      Te notificaremos cuando tu paquete sea entregado.
    </p>
  `;

  return layout(content, `Tu pedido #${data.orderNumber} ha sido enviado`);
}
