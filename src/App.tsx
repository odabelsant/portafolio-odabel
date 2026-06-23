import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Routes, Route, Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { siteConfig } from "./content/siteContent";
import { projectsData } from "./data/projects";

// Layout & Global Components
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";

// Section Components
import { Hero } from "./sections/Hero";
import { VideoPresentation } from "./sections/VideoPresentation";
import { AboutMe } from "./sections/AboutMe";
import { Skills } from "./sections/Skills";
import { Education } from "./sections/Education";
import { Certifications } from "./sections/Certifications";
import { Languages } from "./sections/Languages";
import { Projects } from "./sections/Projects";
import { QAHighlights } from "./sections/QAHighlights";
import { Contact } from "./sections/Contact";

// Admin Route
import { AdminRoute } from "./pages/admin/AdminRoute";

// SPA Layout wrapper
const HomeLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <VideoPresentation />
        <AboutMe />
        <Skills />
        <Education />
        <Certifications />
        <Languages />
        <Projects />
        <QAHighlights />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

// Accessible 404 / NotFound Component
const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050816] text-white px-4">
      <Helmet>
        <title>404 - Página no encontrada | Page Not Found</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="glass-panel max-w-md p-8 rounded-2xl border border-white/10 text-center shadow-2xl space-y-6">
        <div className="inline-flex p-4 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-500 mb-2">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-extrabold font-display">404</h1>
        <h2 className="text-xl font-bold">Página no encontrada / Page Not Found</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          La ruta que intentas visitar no existe o ha sido movida. Usa el botón inferior para retornar al inicio.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-lg transition-all hover:scale-[1.01] hover:shadow-primary/30"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          <span>Volver al Inicio / Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isContentLoading, setIsContentLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch("/api/content");
        if (res.ok) {
          const contents = await res.json();
          for (const item of contents) {
            if (item.key === "backoffice_texts") {
              const texts = JSON.parse(item.value);
              i18n.addResourceBundle("es", "translation", texts, true, true);
            } else if (item.key === "backoffice_youtube") {
              const yt = JSON.parse(item.value);
              siteConfig.youtubeES = yt.urlES || siteConfig.youtubeES;
              siteConfig.youtubeEN = yt.urlEN || siteConfig.youtubeEN;
            } else if (item.key === "backoffice_skills") {
              const skillsData = JSON.parse(item.value);
              if (skillsData.categories) {
                siteConfig.skillsCategories.length = 0;
                siteConfig.skillsCategories.push(...skillsData.categories.map((cat: any) => ({
                  id: cat.id,
                  titleKey: cat.titleKey || "",
                  title: cat.title || "",
                  skills: (cat.skills || []).map((s: any) => ({
                    name: s.name,
                    level: s.level,
                    icon: s.icon
                  }))
                })));
              }
            } else if (item.key === "backoffice_education") {
              const eduData = JSON.parse(item.value);
              if (eduData.education) {
                siteConfig.education.length = 0;
                siteConfig.education.push(...eduData.education.map((edu: any) => ({
                  id: edu.id,
                  title: edu.title || "",
                  titleKey: edu.titleKey || "",
                  institution: edu.institution || "",
                  date: edu.date || "",
                  dateKey: edu.dateKey || "",
                  description: edu.description || ""
                })));
              }
            } else if (item.key === "projects") {
              const projList = JSON.parse(item.value);
              if (Array.isArray(projList)) {
                projectsData.length = 0;
                projectsData.push(...projList);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading content from API:", err);
      } finally {
        setIsContentLoading(false);
      }
    }
    loadContent();
  }, [i18n]);

  const currentLang = i18n.language ? i18n.language.split("-")[0] : "es";

  if (isContentLoading) {
    return (
      <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-primary animate-spin" />
          <p className="text-sm text-slate-400 font-semibold tracking-wider animate-pulse">Cargando portafolio...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        {/* Dynamic language assignment to HTML root */}
        <html lang={currentLang} />
        
        {/* Basic SEO Tags */}
        <title>Odabel Santos Álvarez | QA Engineer Portfolio</title>
        <meta name="description" content={t("hero.subtitle")} />
        
        {/* Open Graph Metas */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Odabel Santos Álvarez | ${t("hero.title")}`} />
        <meta property="og:description" content={t("hero.subtitle")} />
        <meta property="og:site_name" content="Odabel Santos Álvarez QA Portfolio" />
        <meta property="og:image" content="/og-image.jpg" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Odabel Santos Álvarez | ${t("hero.title")}`} />
        <meta name="twitter:description" content={t("hero.subtitle")} />
        <meta name="twitter:image" content="/og-image.jpg" />

        {/* Fonts Linkage */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Helmet>

      <Routes>
        <Route path="/" element={<HomeLayout />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
