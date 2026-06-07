import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, LogOut, Type, BarChart3, FolderOpen,
  CheckCircle2, ChevronRight, Menu, X, Palette, Briefcase,
  Award, GraduationCap
} from "lucide-react";
import { Github, Youtube } from "../../components/Icons";
import { TextsEditor } from "./sections/TextsEditor";
import { VideoPresentationManager } from "./sections/VideoPresentation";
import { MetricsEditor } from "./sections/MetricsEditor";
import { FilesEditor } from "./sections/FilesEditor";
import { ThemingConfigurator } from "./sections/ThemingConfigurator";
import { ProjectsManager } from "./sections/ProjectsManager";
import { SkillsManager } from "./sections/SkillsManager";
import { EducationManager } from "./sections/EducationManager";

// ─── Sidebar Tab Config ───────────────────────────────────────────────────────

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const TABS: Tab[] = [
  { id: "texts",   label: "Textos & Presentación", icon: <Type className="w-4.5 h-4.5" /> },
  { id: "youtube", label: "Video de Presentación", icon: <Youtube className="w-4.5 h-4.5" /> },
  { id: "metrics", label: "Logros QA",              icon: <BarChart3 className="w-4.5 h-4.5" /> },
  { id: "skills",  label: "Habilidades Técnicas",   icon: <Award className="w-4.5 h-4.5" /> },
  { id: "education", label: "Educación & Formación", icon: <GraduationCap className="w-4.5 h-4.5" /> },
  { id: "files",   label: "Archivos Multimedia",    icon: <FolderOpen className="w-4.5 h-4.5" /> },
  { id: "theming", label: "Configuración de Tema",  icon: <Palette className="w-4.5 h-4.5" /> },
  { id: "projects",label: "Gestor de Proyectos",    icon: <Briefcase className="w-4.5 h-4.5" /> },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface AdminDashboardProps {
  onLogout: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>("texts");
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(() => window.innerWidth >= 763);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 763);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const addNotification = (message: string) => {
    const id = `${Date.now()}`;
    setNotifications((prev) => [...prev, message]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((_, i) => i !== 0));
    }, 4000);
    void id;
  };

  const REPO = import.meta.env.VITE_GITHUB_REPO as string;

  return (
    <div className="min-h-screen bg-[#050816] flex flex-col">
      {/* ── Top Bar ── */}
      <header className="glass-nav sticky top-0 z-30 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            {!isLargeScreen && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
                aria-label="Menu principal"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md shadow-primary/25">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-extrabold font-display text-white leading-none">Admin Backoffice</p>
              <p className="text-xs text-slate-500">Portafolio Odabel Santos</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {REPO && (
              <a
                href={`https://github.com/${REPO}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>{REPO}</span>
              </a>
            )}
            <button
              type="button"
              onClick={onLogout}
              id="admin-logout-btn"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/5 text-slate-400 hover:text-rose-400 text-sm font-medium transition-all duration-200 focus:outline-none"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 gap-6 lg:gap-8 relative">
        {/* Mobile Sidebar Backdrop */}
        {!isLargeScreen && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-[#050816]/80 backdrop-blur-sm z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar (Desktop fixed left, Mobile Overlay Drawer) ── */}
        <aside
          className={
            isLargeScreen
              ? "w-64 flex flex-col justify-between"
              : `fixed inset-y-0 left-0 z-50 w-64 bg-[#090d23] border-r border-white/10 p-5 flex flex-col justify-between transition-transform duration-300 ${
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`
          }
        >
          <div className="space-y-6">
            {!isLargeScreen && (
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <span className="text-sm font-extrabold text-white">Navegación</span>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <nav className="glass-panel rounded-2xl border border-white/5 p-2 space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-200 focus:outline-none group ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary border border-primary/15"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className={activeTab === tab.id ? "text-primary" : "text-slate-500 group-hover:text-slate-300"}>
                    {tab.icon}
                  </span>
                  <span className="flex-1">{tab.label}</span>
                  {activeTab === tab.id && <ChevronRight className="w-4 h-4 text-primary" />}
                </button>
              ))}

              {/* Info block */}
              <div className="mt-4 pt-4 border-t border-white/5 px-2">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Los cambios se guardan directamente en el repositorio de GitHub y Vercel ejecuta el CI/CD automáticamente.
                </p>
              </div>
            </nav>
          </div>
        </aside>

        {/* ── Content Area ── */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="glass-panel rounded-2xl border border-white/5 p-6 sm:p-8"
            >
              {activeTab === "texts"   && <TextsEditor  onSaveComplete={addNotification} />}
              {activeTab === "youtube" && <VideoPresentationManager onSaveComplete={addNotification} />}
              {activeTab === "metrics" && <MetricsEditor onSaveComplete={addNotification} />}
              {activeTab === "skills"  && <SkillsManager onSaveComplete={addNotification} />}
              {activeTab === "education" && <EducationManager onSaveComplete={addNotification} />}
              {activeTab === "files"   && <FilesEditor   onSaveComplete={addNotification} />}
              {activeTab === "theming" && <ThemingConfigurator onSaveComplete={addNotification} />}
              {activeTab === "projects" && <ProjectsManager onSaveComplete={addNotification} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── Toast Notifications ── */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {notifications.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-emerald-500/90 backdrop-blur-md text-white text-sm font-semibold shadow-2xl"
            >
              <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
              <span>{msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
