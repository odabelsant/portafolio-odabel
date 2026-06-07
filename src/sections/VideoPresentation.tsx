import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Play, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "../content/siteContent";

// Extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Standard: https://www.youtube.com/watch?v=ID
    if (parsed.searchParams.has("v")) {
      return parsed.searchParams.get("v");
    }
    // Short: https://youtu.be/ID
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1);
    }
    // Embed: https://www.youtube.com/embed/ID
    const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch) return embedMatch[1];
  } catch {
    // Fallback: try regex
    const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    if (match) return match[1];
  }
  return null;
}

export const VideoPresentation: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);

  const currentLang = i18n.language ? i18n.language.split("-")[0] : "es";

  // Dynamic URL selection with Spanish fallback (TAREA 2)
  let selectedUrl = currentLang === "en" ? siteConfig.youtubeEN : siteConfig.youtubeES;
  if (!selectedUrl || selectedUrl.trim() === "") {
    selectedUrl = siteConfig.youtubeES;
  }

  const videoId = getYouTubeVideoId(selectedUrl);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&color=white`
    : null;
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;

  // Reset loading state when the active videoId changes
  useEffect(() => {
    setIsLoaded(false);
  }, [videoId]);

  return (
    <section
      id="video"
      className="py-24 bg-[#050816] dark:bg-[#050816] text-white border-t border-white/5 transition-colors duration-300"
    >
      {/* ── Ambient glow ── */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight mb-4">
              {t("video.title")}
            </h2>
            <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4" />
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t("video.subtitle")}
            </p>
          </motion.div>

          {/* Video Player Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Outer glassmorphism frame with neon border */}
            <div className="relative p-1 rounded-3xl bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 shadow-2xl shadow-primary/10">
              {/* Inner dark background */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-950">
                {/* Decorative corner accents */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-primary/50 rounded-tl-lg z-10 pointer-events-none" />
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-primary/50 rounded-tr-lg z-10 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-primary/50 rounded-bl-lg z-10 pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-primary/50 rounded-br-lg z-10 pointer-events-none" />

                {/* 16:9 Aspect Ratio Wrapper */}
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                  {embedUrl ? (
                    <>
                      {/* Thumbnail overlay — shown until iframe loads */}
                      {!isLoaded && thumbnailUrl && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950">
                          <img
                            src={thumbnailUrl}
                            alt="Video thumbnail"
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                          />
                          <div className="relative z-20 flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-primary/40 animate-pulse">
                              <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                            <p className="text-sm text-white/70 font-medium">Cargando video…</p>
                          </div>
                        </div>
                      )}

                      {/* YouTube iframe */}
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={embedUrl}
                        title={t("video.title")}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                        onLoad={() => setIsLoaded(true)}
                      />
                    </>
                  ) : (
                    /* Fallback: no valid video ID */
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-slate-500">
                      <div className="text-center space-y-3">
                        <Play className="w-12 h-12 mx-auto opacity-30" />
                        <p className="text-sm">Video no disponible. Configura los videos en el CMS.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom metadata bar */}
            {videoId && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between mt-4 px-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">YouTube</span>
                </div>
                <a
                  href={selectedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary transition-colors duration-200"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Ver en YouTube</span>
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
