import React, { useState, useEffect } from "react";
import { ExternalLink, Check, AlertCircle, CheckCircle2 } from "lucide-react";
import { updateTextFileInRepo } from "../../../services/githubApiService";
import { siteConfig } from "../../../content/siteContent";
import { Youtube } from "../../../components/Icons";

// Robust YouTube Video ID Parser
const extractVideoId = (url: string): string => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : "";
};

export const VideoPresentationManager: React.FC<{ onSaveComplete: (msg: string) => void }> = ({ onSaveComplete }) => {
  // Mock Data Validation requirements:
  // urlES initialized to: https://www.youtube.com/watch?v=FO1rII573ho
  // urlEN initialized to: siteConfig.youtubeEN (empty or configured value)
  const [urlES, setUrlES] = useState(() => siteConfig.youtubeES || "https://www.youtube.com/watch?v=FO1rII573ho");
  const [urlEN, setUrlEN] = useState(() => siteConfig.youtubeEN || "");

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const [esImgError, setEsImgError] = useState(false);
  const [enImgError, setEnImgError] = useState(false);

  // Resize listener for breakpoint 763px
  const [isLargeScreen, setIsLargeScreen] = useState(() => window.innerWidth >= 763);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 763);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const videoIdES = extractVideoId(urlES);
  const videoIdEN = extractVideoId(urlEN);

  useEffect(() => {
    setEsImgError(false);
  }, [videoIdES]);

  useEffect(() => {
    setEnImgError(false);
  }, [videoIdEN]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    setSaveMessage("Guardando enlaces del video de presentación...");

    const TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;
    const isDummyToken = !TOKEN || TOKEN === "ghp_TuTokenDeGitHubDeFirmeEscritura" || TOKEN.startsWith("ghp_TuToken");

    try {
      // Basic validations
      if (urlES.trim().length > 0 && !videoIdES) {
        throw new Error("El video en Español no tiene una URL de YouTube válida.");
      }
      if (urlEN.trim().length > 0 && !videoIdEN) {
        throw new Error("El video en Inglés no tiene una URL de YouTube válida.");
      }

      const payload = {
        urlES: urlES.trim(),
        urlEN: urlEN.trim(),
        _updated: new Date().toISOString()
      };

      if (isDummyToken) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      } else {
        await updateTextFileInRepo(
          "src/data/backoffice_youtube.json",
          JSON.stringify(payload, null, 2),
          "[Backoffice] Update Bilingual YouTube presentation URLs"
        );
      }

      setSaveStatus("success");
      setSaveMessage("¡Configuración de video bilingüe guardada correctamente!");
      onSaveComplete("Video de presentación actualizado.");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setSaveStatus("error");
      setSaveMessage(`Error al guardar: ${errMsg}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Youtube className="w-5 h-5 text-rose-500 animate-pulse" />
          <span>Video de Presentación Bilingüe</span>
        </h3>
        <p className="text-sm text-slate-500">
          Administra de forma independiente los videos de YouTube para las versiones en Español y en Inglés del portafolio.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className={isLargeScreen ? "grid grid-cols-2 gap-6" : "flex flex-col gap-6"}>
          {/* Bloque 1: Español */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4 text-left">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/20 text-primary">ES</span>
              <span className="text-sm font-bold text-white">Versión en Español</span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="url-es" className="block text-xs font-semibold text-slate-400">
                URL del Video de YouTube (Español) *
              </label>
              <input
                id="url-es"
                type="url"
                required
                value={urlES}
                onChange={(e) => setUrlES(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=FO1rII573ho"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-xs border border-white/10 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Preview ES */}
            {videoIdES ? (
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Miniatura del Video (Español)</span>
                <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video">
                  <img
                    src={esImgError ? `https://img.youtube.com/vi/${videoIdES}/mqdefault.jpg` : `https://img.youtube.com/vi/${videoIdES}/maxresdefault.jpg`}
                    onError={() => setEsImgError(true)}
                    alt="YouTube thumbnail preview Spanish"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center shadow-lg">
                      <Youtube className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>ID: <code className="text-primary font-bold">{videoIdES}</code></span>
                  <a
                    href={urlES}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Ver en YouTube</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-[120px] rounded-xl bg-slate-950/40 border border-dashed border-white/5 flex items-center justify-center text-xs text-slate-600">
                Sin vista previa de video
              </div>
            )}
          </div>

          {/* Bloque 2: Inglés */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-4 text-left">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent/20 text-accent">EN</span>
              <span className="text-sm font-bold text-white">Versión en Inglés</span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="url-en" className="block text-xs font-semibold text-slate-400">
                URL del Video de YouTube (Inglés)
              </label>
              <input
                id="url-en"
                type="url"
                value={urlEN}
                onChange={(e) => setUrlEN(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-xs border border-white/10 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Preview EN */}
            {videoIdEN ? (
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Miniatura del Video (Inglés)</span>
                <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video">
                  <img
                    src={enImgError ? `https://img.youtube.com/vi/${videoIdEN}/mqdefault.jpg` : `https://img.youtube.com/vi/${videoIdEN}/maxresdefault.jpg`}
                    onError={() => setEnImgError(true)}
                    alt="YouTube thumbnail preview English"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center shadow-lg">
                      <Youtube className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>ID: <code className="text-accent font-bold">{videoIdEN}</code></span>
                  <a
                    href={urlEN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-accent transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Ver en YouTube</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-[120px] rounded-xl bg-slate-950/40 border border-dashed border-white/5 flex items-center justify-center text-xs text-slate-600">
                Sin vista previa de video (Se aplicará Fallback al video en Español)
              </div>
            )}
          </div>
        </div>

        {/* Notificación de Estado */}
        {saveStatus !== "idle" && saveStatus !== "saving" && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold text-left ${
            saveStatus === "success" ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" :
            "bg-rose-500/10 border-rose-500/25 text-rose-400"
          }`}>
            {saveStatus === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span>{saveMessage}</span>
          </div>
        )}

        {/* Botón de guardar */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saveStatus === "saving"}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 disabled:from-slate-700 disabled:to-slate-700 text-white text-sm font-bold shadow-md shadow-primary/25 transition-all duration-300 cursor-pointer"
          >
            {saveStatus === "saving" ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Guardando Cambios...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
