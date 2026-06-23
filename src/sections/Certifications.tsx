import React from "react";
import { useTranslation } from "react-i18next";
import { Award } from "lucide-react";
import { motion } from "framer-motion";
import { certificacionesMock } from "../data/certificacionesMock";

export const Certifications: React.FC = () => {
  const { t } = useTranslation();

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificacionesMock.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-xl bg-slate-900/40 border border-slate-700/50 p-4 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/70 border border-slate-700 px-2.5 py-1 rounded-full">
                  <Award className="w-3.5 h-3.5 text-primary" />
                  Certificación
                </span>
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-700/60 bg-slate-950/40 mb-4">
                <img
                  src={cert.imageUrl}
                  alt={cert.titulo}
                  className="w-full h-44 object-cover"
                  loading="lazy"
                />
              </div>

              <div>
                <h3 className="text-sm md:text-base font-bold text-white mb-1 line-clamp-2">
                  {cert.titulo}
                </h3>
                <p className="text-xs text-slate-400">
                  {cert.plataforma}
                </p>
                <div className="flex gap-3 mt-4">
                  <a
                    href={cert.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center py-2.5 px-3 rounded-lg text-sm font-semibold text-primary border border-primary/30 hover:border-primary/70 hover:bg-primary/10 transition-colors"
                  >
                    {t("certifications.view")}
                  </a>
                  {cert.pdfUrl && (
                    <a
                      href={cert.pdfUrl}
                      download
                      className="flex-1 inline-flex items-center justify-center py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-300 border border-slate-700 hover:border-slate-500 hover:bg-slate-800/40 transition-colors"
                    >
                      {t("certifications.download")}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
