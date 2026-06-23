import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as z from "zod";
import { prisma } from "./utils/prisma.js";
import { verifyAuth } from "./utils/auth.js";

const contentSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Configuration
  const requestOrigin = req.headers.origin;
  if (requestOrigin) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  switch (req.method) {
    case "GET":
      try {
        const contents = await prisma.content.findMany();
        return res.status(200).json(contents);
      } catch (error: any) {
        return res.status(500).json({ success: false, error: "Database error fetching contents", details: error.message });
      }

    case "POST": {
      if (!verifyAuth(req, res)) return;
      const validation = contentSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ success: false, error: "Invalid schema payload", details: validation.error.format() });
      }
      const { key, value } = validation.data;
      try {
        const upsertedContent = await prisma.content.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
        return res.status(201).json({ success: true, data: upsertedContent });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: "Database error creating/upserting content", details: error.message });
      }
    }

    case "PUT": {
      if (!verifyAuth(req, res)) return;
      const validation = contentSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ success: false, error: "Invalid schema payload", details: validation.error.format() });
      }
      const { key, value } = validation.data;
      try {
        const updatedContent = await prisma.content.update({
          where: { key },
          data: { value },
        });
        return res.status(200).json({ success: true, data: updatedContent });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: "Database error updating content", details: error.message });
      }
    }

    case "DELETE": {
      if (!verifyAuth(req, res)) return;
      const key = req.query.key as string || req.body.key as string;
      if (!key) {
        return res.status(400).json({ success: false, error: "Missing content key parameter" });
      }
      try {
        await prisma.content.delete({ where: { key } });
        return res.status(200).json({ success: true, message: `Content key '${key}' deleted successfully` });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: "Database error deleting content", details: error.message });
      }
    }

    default:
      return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
