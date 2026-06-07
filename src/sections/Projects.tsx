import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, Layers, Terminal, Database, ShieldCheck, Cpu } from "lucide-react";
import { Github } from "../components/Icons";
import { motion, AnimatePresence } from "framer-motion";
import { projectsData, type Project } from "../data/projects";

type ProjectFilter = "all" | "manual" | "automation" | "api" | "personal";

export const Projects: React.FC = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("all");

  const filters = [
    { id: "all", labelKey: "projects.filter_all" },
    { id: "manual", labelKey: "projects.filter_manual" },
    { id: "automation", labelKey: "projects.filter_automation" },
    { id: "api", labelKey: "projects.filter_api" },
    { id: "personal", labelKey: "projects.filter_personal" },
  ];

  const filteredProjects = projectsData.filter((project) => {
    if (activeFilter === "all") return true;
    return project.category === activeFilter;
  });

  // Get project category graphic
  const renderProjectGraphic = (category: Project["category"]) => {
    switch (category) {
      case "automation":
        return (
          <div className="relative w-full h-48 bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.15),transparent)]" />
            <div className="absolute font-mono text-[10px] text-primary/30 top-4 left-4 text-left select-none">
              {"// Selenium BDD Test Runner\n@Given(\"user is logged in\")\npublic void userLogin() {\n  driver.get(url);\n}"}
            </div>
            <Cpu className="w-14 h-14 text-primary animate-pulse" />
          </div>
        );
      case "api":
        return (
          <div className="relative w-full h-48 bg-gradient-to-br from-[#1c1917] to-[#0f172a] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(96,165,250,0.15),transparent)]" />
            <div className="absolute font-mono text-[10px] text-secondary/30 top-4 left-4 text-left select-none">
              {"GET /api/v1/auth/status HTTP/1.1\nHost: api.services.local\nAccept: application/json\n\nHTTP/1.1 200 OK\nStatus: SUCCESS"}
            </div>
            <Database className="w-14 h-14 text-secondary animate-pulse" />
          </div>
        );
      case "manual":
        return (
          <div className="relative w-full h-48 bg-gradient-to-br from-[#064e3b] to-[#0f172a] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(52,211,153,0.15),transparent)]" />
            <div className="absolute font-mono text-[10px] text-emerald-500/20 top-4 left-4 text-left select-none">
              {"TC-104: Regression Smoke test\nStatus: PASSED\nSteps: [1] Open page\n[2] Fill fields\n[3] Trigger event"}
            </div>
            <ShieldCheck className="w-14 h-14 text-emerald-400 animate-pulse" />
          </div>
        );
      case "personal":
        return (
          <div className="relative w-full h-48 bg-gradient-to-br from-[#311042] to-[#0f172a] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.15),transparent)]" />
            <div className="absolute font-mono text-[10px] text-purple-400/20 top-4 left-4 text-left select-none">
              {"const testData = {\n  id: crypto.randomUUID(),\n  name: 'Odabel Santos',\n  email: 'odabelrunner@gmail.com'\n}"}
            </div>
            <Terminal className="w-14 h-14 text-purple-400 animate-pulse" />
          </div>
        );
      default:
        return (
          <div className="w-full h-48 bg-slate-900 flex items-center justify-center">
            <Layers className="w-12 h-12 text-slate-500" />
          </div>
        );
    }
  };

  return (
    <section
      id="projects"
      className="py-24 bg-[#050816] dark:bg-[#050816] light:bg-[#f8fafc] text-white dark:text-white light:text-slate-900 border-t border-white/5 dark:border-white/5 light:border-slate-200 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white dark:text-white light:text-slate-900 mb-4">
            {t("projects.title")}
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4" />
          <p className="text-lg text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-xl mx-auto">
            {t("projects.subtitle")}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as ProjectFilter)}
              type="button"
              className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 focus:outline-none ${
                activeFilter === filter.id
                  ? "text-white bg-primary shadow-lg shadow-primary/20 dark:text-white light:text-white"
                  : "text-slate-400 hover:text-white dark:hover:text-white light:text-slate-600 light:hover:text-slate-900 bg-slate-900/30 border border-white/5 dark:bg-slate-900/30 dark:border-white/5 light:bg-white light:border-slate-200"
              }`}
            >
              <span className="relative z-10">{t(filter.labelKey)}</span>
            </button>
          ))}
        </div>

        {/* Projects Grid with exit/entry animations */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="glass-panel rounded-2xl overflow-hidden border border-white/5 dark:border-white/5 light:border-slate-200 shadow-xl flex flex-col justify-between hover:border-primary/25 transition-all duration-300 group"
              >
                {/* Visual Representation */}
                <div>
                  {renderProjectGraphic(project.category)}

                  {/* Project Details */}
                  <div className="p-6 text-left">
                    <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 mb-2 font-display group-hover:text-primary transition-colors">
                      {project.title || (project.titleKey ? t(project.titleKey) : "")}
                    </h3>

                    {/* Role Tag */}
                    <div className="flex items-center gap-1.5 mb-4 text-xs font-semibold text-primary">
                      <span>{t("projects.role_label")}</span>
                      <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                        {project.role || (project.roleKey ? t(project.roleKey) : "")}
                      </span>
                    </div>

                    <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed mb-6 line-clamp-4">
                      {project.description || (project.descriptionKey ? t(project.descriptionKey) : "")}
                    </p>
                  </div>
                </div>

                {/* Tech Badges & Links */}
                <div className="p-6 pt-0 text-left">
                  {/* Technology badging */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tech.map((techItem) => (
                      <span
                        key={techItem}
                        className="px-2 py-1 text-[10px] font-bold font-mono tracking-wider rounded bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 text-slate-400 dark:text-slate-400 light:text-slate-600 border border-white/5 dark:border-white/5 light:border-slate-200"
                      >
                        {techItem}
                      </span>
                    ))}
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5 dark:border-white/5 light:border-slate-100">
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-900/50 hover:bg-slate-900 text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-all duration-300 dark:bg-slate-900/50 dark:hover:bg-slate-900 dark:text-slate-300 dark:hover:text-white light:bg-slate-50 light:hover:bg-slate-100 light:text-slate-700 light:hover:text-slate-900"
                      >
                        <Github className="w-4 h-4" />
                        <span>{t("projects.repo_btn")}</span>
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-xl text-xs font-semibold shadow-md shadow-primary/10 transition-all duration-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{t("projects.demo_btn")}</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
