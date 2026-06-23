import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as z from "zod";
import { prisma } from "./utils/prisma.js";
import { verifyAuth } from "./utils/auth.js";

const metricSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
  icon: z.string().min(1),
  labelKey: z.string().min(1),
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
        const metrics = await prisma.metric.findMany();
        return res.status(200).json(metrics);
      } catch (error: any) {
        return res.status(500).json({ success: false, error: "Database error fetching metrics", details: error.message });
      }

    case "POST": {
      if (!verifyAuth(req, res)) return;
      const validation = metricSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ success: false, error: "Invalid schema payload", details: validation.error.format() });
      }
      try {
        const newMetric = await prisma.metric.create({ data: validation.data });
        return res.status(201).json({ success: true, data: newMetric });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: "Database error creating metric", details: error.message });
      }
    }

    case "PUT": {
      if (!verifyAuth(req, res)) return;
      const validation = metricSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ success: false, error: "Invalid schema payload", details: validation.error.format() });
      }
      const { id, ...data } = validation.data;
      try {
        const updatedMetric = await prisma.metric.update({
          where: { id },
          data,
        });
        return res.status(200).json({ success: true, data: updatedMetric });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: "Database error updating metric", details: error.message });
      }
    }

    case "DELETE": {
      if (!verifyAuth(req, res)) return;
      const id = req.query.id as string || req.body.id as string;
      if (!id) {
        return res.status(400).json({ success: false, error: "Missing metric id parameter" });
      }
      try {
        await prisma.metric.delete({ where: { id } });
        return res.status(200).json({ success: true, message: `Metric ${id} deleted successfully` });
      } catch (error: any) {
        return res.status(500).json({ success: false, error: "Database error deleting metric", details: error.message });
      }
    }

    default:
      return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
