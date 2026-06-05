import React from "react";
import { useTranslation } from "react-i18next";
import { Globe, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export const Languages: React.FC = () => {
  const { t } = useTranslation();

  const languageItems = [
    {
      code: "es",
      name: t("languages.es.name"),
      level: t("languages.es.level"),
      percent: 100,
      description: "Lengua materna. Capacidad de comunicación fluida, técnica y profesional en todas las áreas.",
      badge: "Nativo",
    },
    {
      code: "en",
      name: t("languages.en.name"),
      level: t("languages.en.level"),
      percent: 80,
      description: "Nivel B2 (Upper Intermediate). Capacidad de leer especificaciones técnicas, redactar casos de prueba, bugs e interactuar con equipos en inglés.",
      badge: "B2 Certified",
    },
  ];

  return (
    <section className="py-20 bg-[#050816] dark:bg-[#050816] light:bg-[#f8fafc] text-white dark:text-white light:text-slate-900 border-t border-white/5 dark:border-white/5 light:border-slate-200 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white dark:text-white light:text-slate-900 mb-3 flex items-center justify-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            <span>{t("languages.title")}</span>
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        {/* Languages Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {languageItems.map((lang, index) => (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="glass-panel p-6 rounded-2xl border border-white/5 dark:border-white/5 light:border-slate-200 shadow-xl text-left flex flex-col justify-between hover:border-primary/20 transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                      {lang.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary">{lang.level}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 dark:bg-primary/10 light:bg-primary/5 text-primary border border-primary/25">
                    {lang.badge}
                  </span>
                </div>

                <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-6 leading-relaxed">
                  {lang.description}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    Dominio hablado/escrito
                  </span>
                  <span className="text-primary">{lang.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${lang.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
