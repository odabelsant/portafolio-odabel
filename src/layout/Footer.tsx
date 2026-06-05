import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronUp, Mail, MessageSquare, Shield } from "lucide-react";
import { Linkedin, Github } from "../components/Icons";
import { siteConfig } from "../content/siteContent";

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const socialLinks = [
    {
      name: "LinkedIn",
      url: siteConfig.personalInfo.linkedin,
      icon: <Linkedin className="w-5 h-5" />,
      color: "hover:text-sky-500 hover:border-sky-500/50 hover:shadow-sky-500/20",
    },
    {
      name: "GitHub",
      url: siteConfig.personalInfo.github,
      icon: <Github className="w-5 h-5" />,
      color: "hover:text-slate-300 hover:border-slate-300/50 hover:shadow-slate-300/20",
    },
    {
      name: "WhatsApp",
      url: siteConfig.personalInfo.whatsappUrl,
      icon: <MessageSquare className="w-5 h-5" />,
      color: "hover:text-green-500 hover:border-green-500/50 hover:shadow-green-500/20",
    },
    {
      name: "Email",
      url: `mailto:${siteConfig.personalInfo.email}`,
      icon: <Mail className="w-5 h-5" />,
      color: "hover:text-rose-500 hover:border-rose-500/50 hover:shadow-rose-500/20",
    },
  ];

  return (
    <footer className="relative border-t border-white/5 dark:border-white/5 light:border-slate-200 bg-slate-950 dark:bg-slate-950 light:bg-slate-100 text-slate-400 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pb-8 border-b border-white/5 dark:border-white/5 light:border-slate-200">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <span className="font-display font-bold text-white dark:text-white light:text-slate-900 tracking-wide">
              ODABEL<span className="text-primary font-light">SANTOS</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {siteConfig.navigation.slice(0, 6).map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    const offset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                  }
                }}
                className="hover:text-primary dark:hover:text-primary light:hover:text-slate-900 transition-colors"
              >
                {t(item.labelKey)}
              </a>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex gap-4.5 justify-center md:justify-end">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2.5 rounded-xl border border-white/5 dark:border-white/5 light:border-slate-300 bg-slate-900/40 dark:bg-slate-900/40 light:bg-white text-slate-400 dark:text-slate-400 light:text-slate-600 shadow-md transition-all duration-300 ${link.color}`}
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright & Scroll to Top */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-xs gap-4">
          <p className="text-slate-500 dark:text-slate-500 light:text-slate-600 text-center sm:text-left">
            &copy; {currentYear} {siteConfig.personalInfo.name}. {t("footer.rights")}
          </p>

          <button
            onClick={scrollToTop}
            type="button"
            className="flex items-center gap-2 px-4 py-2 border border-white/10 dark:border-white/10 light:border-slate-300 hover:border-primary/50 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-primary dark:hover:text-primary rounded-xl bg-slate-900/30 dark:bg-slate-900/30 light:bg-white transition-all duration-300 focus:outline-none"
            aria-label={t("footer.back_to_top")}
          >
            <span>{t("footer.back_to_top")}</span>
            <ChevronUp className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
