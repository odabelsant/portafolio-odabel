import fs from "fs";
import path from "path";
import { prisma } from "../api/utils/prisma";

async function main() {
  console.log("Starting database seeding...");

  const baseDir = process.cwd();

  // 1. Seed Metrics
  const metricsPath = path.join(baseDir, "src/data/backoffice_metrics.json");
  if (fs.existsSync(metricsPath)) {
    const metricsData = JSON.parse(fs.readFileSync(metricsPath, "utf-8"));
    const metricsList = metricsData.metrics || [];
    console.log(`Found ${metricsList.length} metrics to seed.`);
    for (const item of metricsList) {
      await prisma.metric.upsert({
        where: { id: item.id },
        update: {
          label: item.label,
          value: item.value,
          icon: item.icon,
          labelKey: item.labelKey || "",
        },
        create: {
          id: item.id,
          label: item.label,
          value: item.value,
          icon: item.icon,
          labelKey: item.labelKey || "",
        },
      });
    }
    console.log("Metrics seeded successfully.");
  } else {
    console.warn(`Metrics file not found at: ${metricsPath}`);
  }

  // 2. Seed Certificates
  const certsPath = path.join(baseDir, "src/data/backoffice_certificates.json");
  if (fs.existsSync(certsPath)) {
    const certsData = JSON.parse(fs.readFileSync(certsPath, "utf-8"));
    const certsList = certsData.certificates || [];
    console.log(`Found ${certsList.length} certificates to seed.`);
    for (const item of certsList) {
      await prisma.certificate.upsert({
        where: { id: item.id },
        update: {
          title: item.title,
          institution: item.institution,
          year: item.year,
          fileUrl: item.fileUrl,
        },
        create: {
          id: item.id,
          title: item.title,
          institution: item.institution,
          year: item.year,
          fileUrl: item.fileUrl,
        },
      });
    }
    console.log("Certificates seeded successfully.");
  } else {
    console.warn(`Certificates file not found at: ${certsPath}`);
  }

  // 3. Seed Content Blocks
  const contents = [
    { key: "backoffice_texts", relPath: "src/data/backoffice_texts.json" },
    { key: "backoffice_youtube", relPath: "src/data/backoffice_youtube.json" },
    { key: "backoffice_skills", relPath: "src/data/backoffice_skills.json" },
    { key: "backoffice_education", relPath: "src/data/backoffice_education.json" },
    { key: "projects", relPath: "src/data/projects.json" },
    { key: "theme_config", relPath: "src/data/theme_config.json" },
  ];

  for (const block of contents) {
    const blockPath = path.join(baseDir, block.relPath);
    if (fs.existsSync(blockPath)) {
      const rawValue = fs.readFileSync(blockPath, "utf-8");
      await prisma.content.upsert({
        where: { key: block.key },
        update: { value: rawValue },
        create: { key: block.key, value: rawValue },
      });
      console.log(`Content key '${block.key}' seeded successfully.`);
    } else {
      console.warn(`Content file not found at: ${blockPath}`);
    }
  }

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
