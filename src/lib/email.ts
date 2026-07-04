import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port) || 587,
    secure: Number(port) === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions) {
  const sender = from || process.env.SMTP_FROM || "Mannatech <noreply@mannatech.dmlabs.mx>";
  const transporter = createTransporter();

  if (!transporter) {
    console.warn("[Email] SMTP not configured. Logging email to console:");
    console.log("------- EMAIL -------");
    console.log(`To: ${Array.isArray(to) ? to.join(", ") : to}`);
    console.log(`From: ${sender}`);
    console.log(`Subject: ${subject}`);
    console.log(`HTML: ${html.substring(0, 200)}...`);
    console.log("------- /EMAIL -------");
    return { success: true, mode: "console" };
  }

  try {
    const info = await transporter.sendMail({
      from: sender,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
    });

    console.log(`[Email] Sent to ${to} — MessageId: ${info.messageId}`);
    return { success: true, mode: "smtp", messageId: info.messageId };
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    throw new Error(`Email send failed: ${(error as Error).message}`);
  }
}
