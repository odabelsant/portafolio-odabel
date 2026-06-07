import React, { useState } from "react";
import { Palette, CheckCircle2, AlertCircle } from "lucide-react";
import { updateTextFileInRepo } from "../../../services/githubApiService";
import { SaveButton } from "./TextsEditor";
import type { SaveState } from "./TextsEditor";
import themeConfig from "../../../data/theme_config.json";

interface ModeConfig {
  bgPrimary: string;
  bgSurface: string;
  textPrimary: string;
  accentColor: string;
}

interface FullThemeConfig {
  dark: ModeConfig;
  light: ModeConfig;
}

export const ThemingConfigurator: React.FC<{ onSaveComplete: (msg: string) => void }> = ({ onSaveComplete }) => {
  const [themeState, setThemeState] = useState<FullThemeConfig>(themeConfig as FullThemeConfig);
  const [activeMode, setActiveMode] = useState<"dark" | "light">("dark");
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateHex = (val: string): boolean => {
    return /^#[0-9A-Fa-f]{6}$/.test(val);
  };

  const handleColorChange = (mode: "dark" | "light", key: keyof ModeConfig, val: string) => {
    // Clear any previous error
    const fieldKey = `${mode}-${key}`;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });

    setThemeState((prev) => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [key]: val,
      },
    }));

    if (val.startsWith("#") && val.length === 7 && !validateHex(val)) {
      setErrors((prev) => ({ ...prev, [fieldKey]: "Hexadecimal inválido (debe ser #RRGGBB)" }));
    }
  };

  const handleSave = async () => {
    // Validate all fields first
    const newErrors: Record<string, string> = {};
    (["dark", "light"] as const).forEach((mode) => {
      (["bgPrimary", "bgSurface", "textPrimary", "accentColor"] as const).forEach((key) => {
        const val = themeState[mode][key];
        if (!validateHex(val)) {
          newErrors[`${mode}-${key}`] = "Formato hex incorrecto (ej: #FFFFFF)";
        }
      });
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSaveState({ status: "error", message: "Corrige los errores de formato hexadecimal antes de guardar." });
      return;
    }

    setSaveState({ status: "saving", message: "Guardando configuración de colores…" });

    const TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;
    const isDummyToken = !TOKEN || TOKEN === "ghp_TuTokenDeGitHubDeFirmeEscritura" || TOKEN.startsWith("ghp_TuToken");

    try {
      const jsonContent = JSON.stringify(themeState, null, 2);

      if (isDummyToken) {
        // Simulation delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        await updateTextFileInRepo(
          "src/data/theme_config.json",
          jsonContent,
          `[Backoffice] Update dynamic design system colors`
        );
      }

      setSaveState({ status: "success", message: "✓ Colores del tema guardados correctamente." });
      onSaveComplete("Colores del sistema de diseño actualizados.");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setSaveState({ status: "error", message: `Error al guardar: ${message}` });
    }
  };

  const modeKeys: { key: keyof ModeConfig; label: string }[] = [
    { key: "bgPrimary", label: "Fondo Principal" },
    { key: "bgSurface", label: "Fondo de Superficies (Tarjetas, Nav, Footer)" },
    { key: "textPrimary", label: "Color de Texto Principal" },
    { key: "accentColor", label: "Color de Acento (Botones, Acentos, Hover)" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <span>Configuración del Sistema de Diseño (Temas)</span>
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Personaliza dinámicamente las variables de color del portafolio. Vercel reconstruirá el sitio reflejando la nueva paleta.
        </p>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-white/5 mb-6">
          <button
            type="button"
            onClick={() => setActiveMode("dark")}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all focus:outline-none ${
              activeMode === "dark"
                ? "border-primary text-primary"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Configuración Tema Oscuro (Dark Mode)
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("light")}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all focus:outline-none ${
              activeMode === "light"
                ? "border-primary text-primary"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Configuración Tema Claro (Light Mode)
          </button>
        </div>

        {/* Inputs list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modeKeys.map(({ key, label }) => {
            const val = themeState[activeMode][key];
            const errorKey = `${activeMode}-${key}`;
            const err = errors[errorKey];

            return (
              <div
                key={key}
                className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <label className="block text-sm font-bold text-white mb-1">{label}</label>
                  <code className="text-xs text-slate-500 block mb-3">
                    {key === "bgPrimary" && "--bg-primary"}
                    {key === "bgSurface" && "--bg-surface"}
                    {key === "textPrimary" && "--text-primary"}
                    {key === "accentColor" && "--accent-color"}
                  </code>
                </div>

                <div className="flex items-center gap-3">
                  {/* Color Picker input */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 cursor-pointer">
                    <input
                      type="color"
                      value={validateHex(val) ? val : "#000000"}
                      onChange={(e) => handleColorChange(activeMode, key, e.target.value)}
                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer bg-transparent scale-150"
                    />
                  </div>

                  {/* Text input for Hex */}
                  <div className="flex-1">
                    <input
                      type="text"
                      maxLength={7}
                      value={val}
                      onChange={(e) => handleColorChange(activeMode, key, e.target.value)}
                      placeholder="#000000"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white font-mono text-sm border ${
                        err ? "border-rose-500 focus:border-rose-500" : "border-white/10 focus:border-primary"
                      } focus:outline-none transition-colors`}
                    />
                  </div>
                </div>

                {err && (
                  <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{err}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <SaveButton state={saveState} onSave={handleSave} />
    </div>
  );
};
