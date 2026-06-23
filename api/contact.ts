import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";
import * as z from "zod";

// Copia idéntica del Zod Schema del Frontend para doble validación estricta
const contactBackendSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  message: z.string().min(10),
  website: z.string().optional(), // Honeypot
});

function escapeHTML(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Limitar a peticiones POST únicamente
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  // Configurar CORS
  const allowedOrigin = "https://odabel.com"; // Ajustar al dominio final
  const requestOrigin = req.headers.origin;

  const isAllowedOrigin =
    !requestOrigin ||
    requestOrigin === allowedOrigin ||
    requestOrigin.endsWith(".vercel.app");

  if (process.env.NODE_ENV === "production" && !isAllowedOrigin) {
    return res.status(403).json({ success: false, error: "Access Denied: Origin not allowed" });
  }

  if (requestOrigin) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // 1. Validar Schema de entrada
    const bodyValidation = contactBackendSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid input data",
        details: bodyValidation.error.format(),
      });
    }

    const { name, email, message, website } = bodyValidation.data;

    // 2. Validación Honeypot (Filtro Anti-Spam)
    if (website && website.trim() !== "") {
      console.warn(`[Anti-Spam] Bot detectado enviando campo honeypot. IP: ${req.headers["x-forwarded-for"] || "Desconocida"}`);
      // Respondemos con éxito falso (HTTP 200) para engañar al bot sin procesar el envío real
      return res.status(200).json({ success: true, message: "Message processed" });
    }

    // 3. Obtener variables de entorno
    const {
      GMAIL_USER,
      GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET,
      GMAIL_REFRESH_TOKEN,
    } = process.env;

    if (!GMAIL_USER || !GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
      console.error("[Servidor] Configuración de variables de entorno de correo incompleta.");
      return res.status(500).json({
        success: false,
        error: "Server email configuration is missing variables",
      });
    }

    // 4. Configurar transporte OAuth2 de Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: GMAIL_USER,
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
      },
    } as any);

    // Sanitización de inputs para prevenir XSS/inyección HTML
    const safeName = escapeHTML(name);
    const safeMessage = escapeHTML(message);

    // 5. Maquetar el contenido del correo entrante (HTML premium)
    const mailOptions = {
      from: `"${safeName}" <${GMAIL_USER}>`, // El remitente debe estar autenticado con GMAIL_USER
      to: GMAIL_USER, // Se auto-envía a la bandeja del propietario
      replyTo: email, // Permite que Odabel responda haciendo clic en "Responder"
      subject: `[Portfolio Contact] Nuevo mensaje de ${safeName}`,
      text: `Nombre: ${name}\nEmail: ${email}\nMensaje:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
          <h2 style="color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">Nuevo Mensaje del Portafolio</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #475569; width: 100px;">Nombre:</td>
              <td style="padding: 6px 0; color: #0f172a;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #475569;">Email:</td>
              <td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 15px; border-radius: 8px; background-color: #ffffff; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; font-weight: bold; color: #475569; margin-bottom: 8px;">Mensaje:</p>
            <p style="margin: 0; color: #0f172a; white-space: pre-wrap; line-height: 1.6;">${safeMessage}</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;">
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">Enviado desde el formulario de contacto del Portafolio Web Odabel.</p>
        </div>
      `,
    };

    // 6. Ejecutar el envío
    await transporter.sendMail(mailOptions);
    console.log(`[Servidor] Correo enviado correctamente de parte de: ${name} (${email})`);

    return res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("[Servidor] Error crítico en Nodemailer:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to send email due to backend transport failure",
      details: error.message || error,
    });
  }
}
