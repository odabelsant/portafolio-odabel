import React from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.split("-")[0]; // handle cases like es-ES

  const toggleLanguage = () => {
    const nextLang = currentLang === "es" ? "en" : "es";
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      type="button"
      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900/50 dark:bg-slate-900/50 light:bg-white text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-primary hover:border-primary/50 transition-all duration-300 font-medium text-sm focus:outline-none"
      aria-label="Cambiar idioma / Change language"
      title="Cambiar idioma / Change language"
    >
      <Languages className="w-4 h-4 text-primary" />
      <span>{currentLang.toUpperCase()}</span>
    </button>
  );
};
