import React from "react";
import { useTranslation } from "react-i18next";
import { Award, Compass, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export const AboutMe: React.FC = () => {
  const { t } = useTranslation();

  const approachItems = [
    {
      title: t("about.approach_1"),
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      desc: "Evitamos retrabajo identificando inconsistencias en etapas tempranas del ciclo (Shift-Left Testing).",
    },
    {
      title: t("about.approach_2"),
      icon: <Award className="w-6 h-6 text-secondary" />,
      desc: "Escribimos scripts mantenibles para pruebas regresivas y flujos críticos de negocio.",
    },
    {
      title: t("about.approach_3"),
      icon: <Compass className="w-6 h-6 text-accent" />,
      desc: "Trabajamos codo a codo con desarrollo y producto para alinear expectativas de aceptación.",
    },
  ];

  return (
    <section
      id="about"
      className="py-24 bg-[#050816] dark:bg-[#050816] light:bg-[#f8fafc] text-white dark:text-white light:text-slate-900 border-t border-white/5 dark:border-white/5 light:border-slate-200 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white dark:text-white light:text-slate-900 mb-4">
            {t("about.title")}
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4" />
          <p className="text-lg text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-xl mx-auto">
            {t("about.intro")}
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Paragraphs Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-slate-300 dark:text-slate-300 light:text-slate-700 text-base sm:text-lg leading-relaxed text-left"
          >
            <p>{t("about.p1")}</p>
            <p>{t("about.p2")}</p>
            <p>{t("about.p3")}</p>
          </motion.div>

          {/* Pillars/Approach Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-5"
          >
            <h3 className="text-xl font-bold font-display text-white dark:text-white light:text-slate-900 text-left mb-4">
              {t("about.approach_title")}
            </h3>
            
            <div className="space-y-4">
              {approachItems.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-5 rounded-2xl glass-panel text-left hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 p-3 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white dark:text-white light:text-slate-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 leading-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
