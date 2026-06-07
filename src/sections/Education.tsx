import React from "react";
import { useTranslation } from "react-i18next";
import { GraduationCap, Calendar, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "../content/siteContent";

export const Education: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      id="education"
      className="py-24 bg-[#050816] dark:bg-[#050816] light:bg-[#f8fafc] text-white dark:text-white light:text-slate-900 border-t border-white/5 dark:border-white/5 light:border-slate-200 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white dark:text-white light:text-slate-900 mb-4">
            {t("education.title")}
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4" />
          <p className="text-lg text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-xl mx-auto">
            {t("education.subtitle")}
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical line (Center on desktop, Left on mobile) */}
          <div className="absolute left-4.5 md:left-1/2 top-2 bottom-2 w-0.5 bg-slate-800 dark:bg-slate-800 light:bg-slate-200 transform md:-translate-x-1/2" />

          <div className="space-y-12">
            {siteConfig.education.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row relative items-start md:items-center ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Marker Dot (Left on mobile, Center on desktop) */}
                  <div className="absolute left-3 md:left-1/2 w-3.5 h-3.5 rounded-full bg-primary border-4 border-slate-950 dark:border-slate-950 light:border-slate-100 transform md:-translate-x-1/2 z-10" />

                  {/* Left Column (Empty on one side for grid spacing on desktop) */}
                  <div className="hidden md:block w-1/2" />

                  {/* Right/Content Column (Full width on mobile, Half on desktop) */}
                  <div className="w-full md:w-1/2 pl-10 md:pl-0 md:px-8">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 dark:border-white/5 light:border-slate-200 shadow-xl text-left hover:border-primary/20 transition-all duration-300 group">
                      {/* Timeline Card Header */}
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.dateKey ? t(item.dateKey as any) : item.date}
                        </span>
                        <div className="p-2 rounded-lg bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 text-primary group-hover:scale-105 transition-transform duration-300">
                          <GraduationCap className="w-4.5 h-4.5" />
                        </div>
                      </div>

                      {/* Timeline Title & Institution */}
                      <h3 className="text-base sm:text-lg font-bold text-white dark:text-white light:text-slate-900 mb-1 group-hover:text-primary transition-colors">
                        {item.titleKey ? t(item.titleKey as any) : item.title}
                      </h3>
                      <p className="text-sm font-medium text-slate-400 dark:text-slate-400 light:text-slate-500 mb-3">
                        {item.institution}
                      </p>

                      {/* Course description */}
                      <div className="flex gap-2 items-start text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed pt-2.5 border-t border-white/5 dark:border-white/5 light:border-slate-100">
                        <BookOpen className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                        <span>{item.description}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
