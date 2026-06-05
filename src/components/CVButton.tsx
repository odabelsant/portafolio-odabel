import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Download, ChevronDown, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "../content/siteContent";

interface CVButtonProps {
  variant?: "primary" | "secondary";
  showText?: boolean;
}

export const CVButton: React.FC<CVButtonProps> = ({ variant = "primary", showText = true }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const buttonClasses =
    variant === "primary"
      ? "flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 focus:outline-none"
      : "flex items-center gap-2 px-4 py-2 border border-primary/30 dark:border-primary/30 light:border-slate-300 hover:border-primary/70 text-primary hover:text-secondary font-medium rounded-xl transition-all duration-300 bg-transparent focus:outline-none";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={buttonClasses}
        aria-label={t("nav.download_cv")}
      >
        <Download className="w-4.5 h-4.5" />
        {showText && <span>{t("nav.download_cv")}</span>}
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2.5 w-48 rounded-xl glass-panel shadow-2xl z-50 overflow-hidden"
            role="menu"
          >
            <div className="py-1">
              <a
                href={siteConfig.cvFiles.es}
                download="CV_Odabel_Santos_ES.pdf"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:text-primary hover:bg-white/5 dark:text-slate-300 dark:hover:text-primary dark:hover:bg-white/5 light:text-slate-700 light:hover:text-primary light:hover:bg-slate-100 transition-colors"
                role="menuitem"
              >
                <FileText className="w-4 h-4" />
                <span>{t("nav.cv_es")}</span>
              </a>
              <a
                href={siteConfig.cvFiles.en}
                download="CV_Odabel_Santos_EN.pdf"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:text-primary hover:bg-white/5 dark:text-slate-300 dark:hover:text-primary dark:hover:bg-white/5 light:text-slate-700 light:hover:text-primary light:hover:bg-slate-100 transition-colors"
                role="menuitem"
              >
                <FileText className="w-4 h-4" />
                <span>{t("nav.cv_en")}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
