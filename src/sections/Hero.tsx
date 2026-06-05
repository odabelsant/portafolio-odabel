import React from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Code, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "../content/siteContent";
import { CVButton } from "../components/CVButton";
import { Github } from "../components/Icons";

export const Hero: React.FC = () => {
  const { t } = useTranslation();

  const handleViewProjects = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById("projects");
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#050816] dark:bg-[#050816] transition-colors duration-300"
    >
      {/* ── Premium Background Effects (Dark only) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[15%] left-[5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[130px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[450px] h-[450px] bg-accent/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/5 rounded-full blur-[180px]" />
      </div>

      {/* ── Subtle Grid ── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT COLUMN: Text Content ── */}
          <div className="text-center lg:text-left order-2 lg:order-1">

            {/* QA Certified Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Quality Assurance Certified</span>
            </motion.div>

            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg font-medium text-slate-400 mb-2 font-display"
            >
              {t("hero.greeting")}
            </motion.p>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 font-display leading-tight"
            >
              <span className="text-white">{siteConfig.personalInfo.name}</span>
            </motion.h1>

            {/* Professional Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center justify-center lg:justify-start gap-2.5 mb-6"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent uppercase tracking-wider">
                {t("hero.title")}
              </span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-slate-400 mb-10 leading-relaxed"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={handleViewProjects}
                type="button"
                id="hero-view-projects-btn"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <span>{t("hero.view_projects")}</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>

              <CVButton variant="secondary" showText={true} />
            </motion.div>

            {/* Float Tech Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="hidden sm:flex flex-wrap justify-center lg:justify-start gap-3 mt-10"
            >
              {[
                { icon: <Code className="w-4 h-4 text-primary" />, label: "Clean Code & Quality Checks", delay: 0 },
                { icon: <Zap className="w-4 h-4 text-amber-500" />, label: "Automated Pipelines (CI/CD)", delay: 0.5 },
                { icon: <Github className="w-4 h-4 text-slate-300" />, label: "Open Source Contributor", delay: 1 },
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: badge.delay }}
                  className="flex items-center gap-1.5 border border-white/5 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm text-slate-400 text-xs font-medium"
                >
                  {badge.icon}
                  <span>{badge.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN: Profile Photo ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Outer ambient glow */}
              <div className="absolute -inset-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl opacity-60 animate-pulse" />

              {/* Spinning gradient ring */}
              <div className="profile-photo-ring relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border-4 border-slate-900/50">
                  <img
                    src={siteConfig.personalInfo.profilePhoto}
                    alt={`${siteConfig.personalInfo.name} — QA Engineer`}
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
              </div>

              {/* Open to Work Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-emerald-500/30 shadow-lg shadow-emerald-500/10 whitespace-nowrap"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  {t("hero.open_to_work")}
                </span>
              </motion.div>

              {/* GitHub Link Badge */}
              <motion.a
                href={siteConfig.personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                whileHover={{ scale: 1.08 }}
                className="absolute -right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-2.5 rounded-xl glass-panel border border-white/10 shadow-lg hover:border-primary/30 transition-all duration-300"
                aria-label="GitHub Profile"
              >
                <Github className="w-5 h-5 text-white" />
              </motion.a>

              {/* Experience Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                className="absolute -left-6 top-8 glass-panel border border-white/10 shadow-xl rounded-2xl px-4 py-3 text-center"
              >
                <p className="text-2xl font-extrabold font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  3+
                </p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide leading-tight mt-0.5">
                  Years<br />QA Exp.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
