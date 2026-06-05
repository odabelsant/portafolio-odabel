import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  RefreshCw,
  Flame,
  Settings,
  Cpu,
  FileCode2,
  Layers,
  Smartphone,
  Send,
  Globe,
  Database,
  Kanban,
  ShieldCheck,
  Cloud,
  Coffee,
  Code,
  Terminal,
  GitBranch,
  Users,
  Search,
  MessageSquare,
  Lightbulb,
  type LucideProps,
} from "lucide-react";
import { siteConfig } from "../content/siteContent";

// Lucide icon helper mapping for dynamic rendering
const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  ClipboardCheck,
  RefreshCw,
  Flame,
  Settings,
  Cpu,
  FileCode2,
  Layers,
  Smartphone,
  Send,
  Globe,
  Database,
  Kanban,
  ShieldCheck,
  Trello: Kanban, // Fallback for Trello key mapping
  Cloud,
  Coffee,
  Code,
  Terminal,
  GitBranch,
  Users,
  Search,
  MessageSquare,
  Lightbulb,
};

const SkillIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) return <Code className={className} />;
  return <IconComponent className={className} />;
};

export const Skills: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      id="skills"
      className="py-24 bg-[#050816] dark:bg-[#050816] light:bg-[#f8fafc] text-white dark:text-white light:text-slate-900 border-t border-white/5 dark:border-white/5 light:border-slate-200 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white dark:text-white light:text-slate-900 mb-4">
            {t("skills.title")}
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4" />
          <p className="text-lg text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-2xl mx-auto">
            {t("skills.subtitle")}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteConfig.skillsCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-6 rounded-2xl border border-white/5 dark:border-white/5 light:border-slate-200 shadow-xl flex flex-col justify-between"
            >
              {/* Category Header */}
              <div className="mb-6 text-left">
                <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 font-display tracking-wide border-b border-white/5 dark:border-white/5 light:border-slate-200 pb-3">
                  {t(category.titleKey)}
                </h3>
              </div>

              {/* Skills List */}
              <div className="space-y-5 flex-grow">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="space-y-1.5 text-left">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <div className="flex items-center gap-2 text-slate-300 dark:text-slate-300 light:text-slate-700">
                        <SkillIcon name={skill.icon} className="w-4 h-4 text-primary" />
                        <span>{skill.name}</span>
                      </div>
                      <span className="text-primary">{skill.level}%</span>
                    </div>
                    {/* Progress Bar Track */}
                    <div className="h-2 w-full bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
