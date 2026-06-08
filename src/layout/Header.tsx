import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveSection } from "../hooks/useActiveSection";
import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageToggle } from "../components/LanguageToggle";
import { CVButton } from "../components/CVButton";

// Import siteConfig directly from siteContent
import { siteConfig as config } from "../content/siteContent";

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const sectionIds = config.navigation.map((item) => item.id);
  const activeSection = useActiveSection(sectionIds, 120);

  // Monitor scroll to add scroll styles (e.g. shadow and darker glass)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      // Calculate offset for sticky header
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "glass-nav shadow-lg py-1" : "bg-transparent py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="https://github.com/odabelsant/portafolio-odabel"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 group text-white dark:text-white light:text-slate-900 focus:outline-none hover:opacity-85 transition-opacity duration-300 cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
            <Shield className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-display font-bold text-lg tracking-wider hidden sm:block">
            ODABEL<span className="text-primary font-light">SANTOS</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {config.navigation.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none ${
                activeSection === item.id
                  ? "text-primary dark:text-primary light:text-primary"
                  : "text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900"
              }`}
            >
              <span className="relative z-10">{t(item.labelKey)}</span>
              {activeSection === item.id && (
                <motion.span
                  layoutId="activeSectionBackground"
                  className="absolute inset-0 bg-primary/10 dark:bg-primary/10 light:bg-primary/5 rounded-lg border-b-2 border-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* Global Controls (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <CVButton variant="secondary" />
        </div>

        {/* Mobile Actions Container */}
        <div className="flex lg:hidden items-center gap-2.5">
          <ThemeToggle />
          <LanguageToggle />
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="p-2.5 rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900/50 dark:bg-slate-900/50 light:bg-white text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-primary transition-all focus:outline-none"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
            aria-label="Alternar menú de navegación"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            id="mobile-menu"
            className="lg:hidden w-full glass-panel border-t border-white/5 dark:border-white/5 light:border-slate-200 overflow-hidden shadow-2xl"
          >
            <div className="px-4 py-4 space-y-2.5 flex flex-col">
              {config.navigation.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-colors focus:outline-none ${
                    activeSection === item.id
                      ? "text-primary bg-primary/10 dark:text-primary dark:bg-primary/10 light:text-primary light:bg-primary/5"
                      : "text-slate-400 hover:text-white hover:bg-white/5 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 light:text-slate-700 light:hover:text-slate-900 light:hover:bg-slate-100"
                  }`}
                >
                  {t(item.labelKey)}
                </a>
              ))}
              <div className="pt-4 border-t border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400 dark:text-slate-400 light:text-slate-600">CV / Resume:</span>
                <CVButton variant="primary" showText={true} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
