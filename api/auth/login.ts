import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as z from "zod";
import { signToken, comparePasswords } from "../utils/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  const requestOrigin = req.headers.origin;
  if (requestOrigin) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    // 1. Validar el body con Zod
    const bodyValidation = loginSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid input data",
        details: bodyValidation.error.format(),
      });
    }

    const { email, password } = bodyValidation.data;

    // 2. Simular verificación contra la variable de entorno VITE_ADMIN_PASSWORD
    const adminPassword = process.env.VITE_ADMIN_PASSWORD || "admin123";

    let isValid = false;
    if (adminPassword.startsWith("$2a$") || adminPassword.startsWith("$2b$")) {
      // Es un hash bcrypt
      isValid = await comparePasswords(password, adminPassword);
    } else {
      // Es texto plano
      isValid = password === adminPassword;
    }

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Invalid email or password",
      });
    }

    // 3. Generar token firmado
    const token = signToken({ email, role: "admin" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error: any) {
    console.error("[Login] Error crítico:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message || error,
    });
  }
}
