import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Award, FileText, Download, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface Certificate {
  id: string;
  title: string;
  institution: string;
  year: string;
  fileUrl: string;
}

const CertificateSkeleton = () => (
  <div className="rounded-xl bg-slate-900/30 border border-slate-800 p-4 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="w-24 h-6 bg-slate-800 rounded-full" />
    </div>
    <div className="w-full h-44 bg-slate-800/60 rounded-lg mb-4" />
    <div className="w-3/4 h-5 bg-slate-800 rounded mb-2" />
    <div className="w-1/2 h-4 bg-slate-800 rounded mb-4" />
    <div className="flex gap-3">
      <div className="flex-1 h-9 bg-slate-800 rounded-lg" />
      <div className="flex-1 h-9 bg-slate-800 rounded-lg" />
    </div>
  </div>
);

export const Certifications: React.FC = () => {
  const { t } = useTranslation();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const response = await fetch("/api/certificates");
        if (!response.ok) {
          throw new Error("Error fetching certificates from database");
        }
        const data = await response.json();
        setCertificates(data);
      } catch (err: any) {
        setError(err.message || "Failed to load certifications");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCertificates();
  }, []);

  const isImageFile = (url: string) => {
    const norm = url.toLowerCase();
    return norm.endsWith(".png") || norm.endsWith(".jpg") || norm.endsWith(".jpeg") || norm.endsWith(".webp");
  };

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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CertificateSkeleton />
            <CertificateSkeleton />
            <CertificateSkeleton />
            <CertificateSkeleton />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-rose-400 font-semibold glass-panel max-w-md mx-auto rounded-2xl border border-rose-500/20 p-6">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((cert, index) => {
              const isImg = isImageFile(cert.fileUrl);
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-xl bg-slate-900/40 border border-slate-700/50 p-4 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/70 border border-slate-700 px-2.5 py-1 rounded-full">
                        <Award className="w-3.5 h-3.5 text-primary" />
                        Certificación ({cert.year})
                      </span>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-slate-700/60 bg-slate-950/40 mb-4 h-44 flex items-center justify-center relative">
                      {isImg ? (
                        <img
                          src={cert.fileUrl}
                          alt={cert.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center gap-3 p-4 text-center">
                          <FileText className="w-12 h-12 text-slate-500 animate-pulse" />
                          <span className="text-xs text-slate-400 font-mono font-bold tracking-wider uppercase">Documento PDF</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm md:text-base font-bold text-white mb-1 line-clamp-2">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {cert.institution}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <a
                      href={cert.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold text-primary border border-primary/30 hover:border-primary/70 hover:bg-primary/10 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t("certifications.view")}</span>
                    </a>
                    <a
                      href={cert.fileUrl}
                      download
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold text-slate-300 border border-slate-700 hover:border-slate-500 hover:bg-slate-800/40 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t("certifications.download")}</span>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
