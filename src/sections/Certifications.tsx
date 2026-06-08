import React from "react";
import { useTranslation } from "react-i18next";
import { Download, Award, Calendar, FileCheck, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { certificatesData } from "../data/certificates";
import backofficeTexts from "../data/backoffice_texts.json";
import type { BackofficeTexts } from "../data/types";

export const Certifications: React.FC = () => {
  const { t } = useTranslation();
  const typedBackofficeTexts = backofficeTexts as BackofficeTexts;

  const getCertificatePath = (certId: string, defaultPath: string) => {
    const uploadedFiles = typedBackofficeTexts.uploadedFiles || {};
    let targetId = "";
    if (certId === "selenium-java-cucumber") targetId = "cert-selenium";
    else if (certId === "testing-fundamentals") targetId = "cert-testing";
    else if (certId === "postman-api") targetId = "cert-postman";
    else if (certId === "jira-zephyr") targetId = "cert-jira";

    if (targetId && uploadedFiles[targetId]) {
      return uploadedFiles[targetId];
    }
    return defaultPath;
  };

  const getBackofficeCertKey = (nameKey: string) =>
    nameKey.replace(/^certifications\./, "").replace(/\.name$/, "");

  return (
    <section
      id="certifications"
      className="py-24 bg-[#050816] dark:bg-[#050816] text-white border-t border-white/5 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight mb-4">
            {t("certifications.title")}
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4" />
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            {t("certifications.subtitle")}
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificatesData.map((cert, index) => {
            const filePath = getCertificatePath(cert.id, cert.pdfPath);
            const certBackofficeKey = getBackofficeCertKey(cert.nameKey);
            const dynamicInstitution = typedBackofficeTexts.certifications?.[certBackofficeKey]?.institution?.trim();

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-panel p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col justify-between hover:border-primary/30 hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div>
                  {/* Certification Icon & Date */}
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-900/60 text-primary group-hover:scale-105 transition-transform duration-300">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {/* BUG-01 FIX: dateKey now correctly maps to certifications.* namespace */}
                      {t(cert.dateKey)}
                    </span>
                  </div>

                  {/* Certificate Name & Issuer */}
                  <h3 className="text-base sm:text-lg font-bold text-left mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                    {/* BUG-01 FIX: nameKey now correctly maps to certifications.* namespace */}
                    {t(cert.nameKey)}
                  </h3>
                  {dynamicInstitution ? (
                    <p className="text-sm font-medium text-slate-400 text-left mb-6 flex items-center gap-1">
                      <FileCheck className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span>{dynamicInstitution}</span>
                    </p>
                  ) : null}
                </div>

                {/* Actions: Download & View */}
                <div className="flex gap-3 mt-auto w-full">
                  {/* Download Button */}
                  <a
                    href={filePath}
                    download
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-primary/20 hover:border-primary/60 hover:bg-primary/5 text-primary hover:text-secondary rounded-xl font-semibold text-sm transition-all duration-300 focus:outline-none"
                    aria-label={`${t("certifications.download")} — ${t(cert.nameKey)}`}
                  >
                    <Download className="w-4 h-4" />
                    <span>{t("certifications.download")}</span>
                  </a>

                  {/* View Button */}
                  <a
                    href={filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-sm transition-all duration-300 focus:outline-none"
                    aria-label={`${t("certifications.view")} — ${t(cert.nameKey)}`}
                  >
                    <Eye className="w-4 h-4 text-slate-400" />
                    <span>{t("certifications.view")}</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
