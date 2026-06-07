import React, { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { updateTextFileInRepo } from "../../../services/githubApiService";
import { siteConfig } from "../../../content/siteContent";
import { SaveButton } from "./TextsEditor";
import type { SaveState } from "./TextsEditor";
import { Youtube } from "../../../components/Icons";

export const YouTubeEditor: React.FC<{ onSaveComplete: (msg: string) => void }> = ({ onSaveComplete }) => {
  const [youtubeUrl, setYoutubeUrl] = useState(siteConfig.youtubeUrl);
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle", message: "" });
  const [imgError, setImgError] = useState(false);

  // Extract video ID with robust Regex to handle all URL patterns
  const extractVideoId = (url: string): string => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "";
  };

  const videoId = extractVideoId(youtubeUrl);

  // Reset img error status on ID changes
  useEffect(() => {
    setImgError(false);
  }, [videoId]);

  const handleSave = async () => {
    setSaveState({ status: "saving" as const, message: "Actualizando URL del video…" });

    const TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;
    const isDummyToken = !TOKEN || TOKEN === "ghp_TuTokenDeGitHubDeFirmeEscritura" || TOKEN.startsWith("ghp_TuToken");

    try {
      const jsonContent = JSON.stringify(
        { youtubeUrl, _updated: new Date().toISOString() },
        null,
        2
      );

      if (isDummyToken) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        await updateTextFileInRepo(
          "src/data/backoffice_youtube.json",
          jsonContent,
          `[Backoffice] Update YouTube presentation URL`
        );
      }

      setSaveState({ status: "success" as const, message: "✓ URL guardada. Vercel actualizará el video." });
      onSaveComplete("URL de YouTube actualizada.");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setSaveState({ status: "error" as const, message: `Error: ${message}` });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Video de Presentación</h3>
        <p className="text-sm text-slate-500 mb-6">
          Actualiza la URL del video de YouTube embebido en la sección de presentación.
        </p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="youtube-url" className="block text-sm font-semibold text-slate-400">
              URL del Video de YouTube
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-400">
                <Youtube className="w-4 h-4" />
              </div>
              <input
                id="youtube-url"
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Preview */}
          {videoId && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vista previa del thumbnail</p>
              <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video">
                <img
                  src={imgError ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                  onError={() => setImgError(true)}
                  alt="YouTube thumbnail preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center">
                    <Youtube className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-secondary transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Abrir en YouTube</span>
              </a>
            </div>
          )}
        </div>
      </div>

      <SaveButton state={saveState as Parameters<typeof SaveButton>[0]["state"]} onSave={handleSave} />
    </div>
  );
};
