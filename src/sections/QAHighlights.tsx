import React from "react";
import { useTranslation } from "react-i18next";
import { FileText, Bug, Code2, CheckSquare, TrendingDown, ShieldAlert, FileSpreadsheet, type LucideProps } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "../content/siteContent";

// Lucide icon helper mapping for dynamic rendering
const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  FileText,
  Bug,
  Code2,
  CheckSquare,
};

const MetricIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) return <CheckSquare className={className} />;
  return <IconComponent className={className} />;
};

export const QAHighlights: React.FC = () => {
  const { t } = useTranslation();

  const impactCases = [
    {
      titleKey: "highlights.impact_1_title",
      descKey: "highlights.impact_1_desc",
      icon: <TrendingDown className="w-6 h-6 text-primary" />,
    },
    {
      titleKey: "highlights.impact_2_title",
      descKey: "highlights.impact_2_desc",
      icon: <ShieldAlert className="w-6 h-6 text-amber-500" />,
    },
    {
      titleKey: "highlights.impact_3_title",
      descKey: "highlights.impact_3_desc",
      icon: <FileSpreadsheet className="w-6 h-6 text-emerald-400" />,
    },
  ];

  return (
    <section
      id="highlights"
      className="py-24 bg-[#050816] dark:bg-[#050816] light:bg-[#f8fafc] text-white dark:text-white light:text-slate-900 border-t border-white/5 dark:border-white/5 light:border-slate-200 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white dark:text-white light:text-slate-900 mb-4">
            {t("highlights.title")}
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4" />
          <p className="text-lg text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-xl mx-auto">
            {t("highlights.subtitle")}
          </p>
        </div>

        {/* Quantitative Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {siteConfig.metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-6 rounded-2xl border border-white/5 dark:border-white/5 light:border-slate-200 shadow-xl text-center hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Metric Icon */}
              <div className="inline-flex p-3 rounded-xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 text-primary mb-4">
                <MetricIcon name={metric.icon} className="w-6 h-6" />
              </div>
              {/* Metric Value */}
              <p className="text-3xl sm:text-4xl font-extrabold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                {metric.value}
              </p>
              {/* Metric Title */}
              <p className="text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-wider">
                {metric.label || (metric.labelKey ? t(metric.labelKey) : "")}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Qualitative Case Studies */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white dark:text-white light:text-slate-900 text-center mb-10">
            {t("highlights.impact_title")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactCases.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="glass-panel p-6 rounded-2xl border border-white/5 dark:border-white/5 light:border-slate-200 shadow-xl text-left hover:border-primary/30 transition-all duration-300 flex flex-col items-start"
              >
                {/* Case Study Icon */}
                <div className="p-3.5 rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 text-primary mb-6 shadow-inner">
                  {item.icon}
                </div>
                {/* Case Study Title */}
                <h4 className="text-lg font-bold text-white dark:text-white light:text-slate-900 mb-3 font-display">
                  {t(item.titleKey)}
                </h4>
                {/* Case Study Desc */}
                <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
                  {t(item.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
