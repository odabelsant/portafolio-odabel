import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as z from "zod";
import { prisma } from "./utils/prisma";
import { verifyAuth } from "./utils/auth";

const certificateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  institution: z.string().min(1),
  year: z.string().min(1),
  fileUrl: z.string().min(1),
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
        const certificates = await prisma.certificate.findMany();
        return res.status(200).json(certificates);
      } catch (error: any) {
        return res.status(500).json({ success: false, error: "Database error fetching certificates", details: error.message });
      }

    case "POST": {
      if (!verifyAuth(req, res)) return;
      const validation = certificateSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ success: false, error: "Invalid schema payload", details: validation.error.format() });
      }
      try {
        const newCertificate = await prisma.certificate.create({ data: validation.data });
        return res.status(201).json({ success: true, data: newCertificate });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: "Database error creating certificate", details: error.message });
      }
    }

    case "PUT": {
      if (!verifyAuth(req, res)) return;
      const validation = certificateSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ success: false, error: "Invalid schema payload", details: validation.error.format() });
      }
      const { id, ...data } = validation.data;
      try {
        const updatedCertificate = await prisma.certificate.update({
          where: { id },
          data,
        });
        return res.status(200).json({ success: true, data: updatedCertificate });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: "Database error updating certificate", details: error.message });
      }
    }

    case "DELETE": {
      if (!verifyAuth(req, res)) return;
      const id = req.query.id as string || req.body.id as string;
      if (!id) {
        return res.status(400).json({ success: false, error: "Missing certificate id parameter" });
      }
      try {
        await prisma.certificate.delete({ where: { id } });
        return res.status(200).json({ success: true, message: `Certificate ${id} deleted successfully` });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: "Database error deleting certificate", details: error.message });
      }
    }

    default:
      return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
