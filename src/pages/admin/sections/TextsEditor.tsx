import React, { useState } from "react";
import { saveContent } from "../../../services/apiService";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SaveState {
  status: "idle" | "saving" | "success" | "error";
  message: string;
}

interface TextsEditorProps {
  onSaveComplete: (message: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const TextsEditor: React.FC<TextsEditorProps> = ({ onSaveComplete }) => {
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle", message: "" });

  // Local state for editable text fields
  const [heroGreeting, setHeroGreeting] = useState("Hola, soy");
  const [heroTitle, setHeroTitle] = useState("QA Engineer");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "QA Engineer especializado en pruebas funcionales, automatización, APIs y mejora continua de calidad de software."
  );
  const [aboutIntro, setAboutIntro] = useState(
    "Asegurando la excelencia y robustez en cada línea de código."
  );
  const [aboutP1, setAboutP1] = useState(
    "Hola, soy Odabel Santos Álvarez. Como QA Engineer, mi enfoque principal no es solo encontrar fallos, sino prevenirlos y construir procesos que aseguren entregas de software rápidas, seguras y de alta calidad."
  );
  const [aboutP2, setAboutP2] = useState(
    "Me especializo en diseñar y ejecutar estrategias de pruebas que abarcan desde validaciones manuales exhaustivas y pruebas funcionales de regresión, hasta la automatización de flujos críticos de usuario (BDD con Selenium + Cucumber) y validación robusta de APIs (Postman)."
  );
  const [aboutP3, setAboutP3] = useState(
    "Mi valor principal radica en conectar el desarrollo técnico con las necesidades del negocio, garantizando que el producto final no solo funcione técnicamente, sino que brinde una experiencia fluida y confiable al usuario final."
  );
  const [contactSubtitle, setContactSubtitle] = useState(
    "¿Tienes un proyecto en mente o buscas incorporar un QA especializado en tu equipo? ¡Escríbeme!"
  );

  const handleSave = async () => {
    setSaveState({ status: "saving", message: "Guardando textos en el repositorio…" });

    // Build the updated Spanish translation JSON
    const updatedEsJson = {
      hero: {
        greeting: heroGreeting,
        title: heroTitle,
        subtitle: heroSubtitle,
        view_projects: "Ver Proyectos",
        download_cv: "Descargar CV",
        open_to_work: "Disponible para trabajar",
      },
      about: {
        intro: aboutIntro,
        p1: aboutP1,
        p2: aboutP2,
        p3: aboutP3,
      },
      contact: {
        subtitle: contactSubtitle,
      },
      _backoffice_updated: new Date().toISOString(),
    };

    try {
      await saveContent("backoffice_texts", updatedEsJson);

      setSaveState({ status: "success", message: "✓ Textos guardados correctamente en la base de datos." });
      onSaveComplete("Textos actualizados correctamente.");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setSaveState({ status: "error", message: `Error: ${message}` });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Sección Hero</h3>
        <p className="text-sm text-slate-500 mb-4">Textos del encabezado principal de la página</p>
        <div className="space-y-4">
          <Field label="Saludo" value={heroGreeting} onChange={setHeroGreeting} />
          <Field label="Título Profesional" value={heroTitle} onChange={setHeroTitle} />
          <Field label="Subtítulo / Descripción" value={heroSubtitle} onChange={setHeroSubtitle} multiline />
        </div>
      </div>

      <hr className="border-white/5" />

      <div>
        <h3 className="text-lg font-bold text-white mb-1">Sección Sobre Mí</h3>
        <p className="text-sm text-slate-500 mb-4">Párrafos de la sección About</p>
        <div className="space-y-4">
          <Field label="Intro / Tagline" value={aboutIntro} onChange={setAboutIntro} />
          <Field label="Párrafo 1" value={aboutP1} onChange={setAboutP1} multiline />
          <Field label="Párrafo 2" value={aboutP2} onChange={setAboutP2} multiline />
          <Field label="Párrafo 3" value={aboutP3} onChange={setAboutP3} multiline />
        </div>
      </div>

      <hr className="border-white/5" />

      <div>
        <h3 className="text-lg font-bold text-white mb-1">Sección Contacto</h3>
        <div className="space-y-4">
          <Field label="Subtítulo de Contacto" value={contactSubtitle} onChange={setContactSubtitle} multiline />
        </div>
      </div>

      <SaveButton state={saveState} onSave={handleSave} />
    </div>
  );
};

// ─── Reusable Field ───────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}

const Field: React.FC<FieldProps> = ({ label, value, onChange, multiline }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-slate-400">{label}</label>
    {multiline ? (
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none transition-colors resize-none"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none transition-colors"
      />
    )}
  </div>
);

// ─── Save Button ──────────────────────────────────────────────────────────────

interface SaveButtonProps {
  state: SaveState;
  onSave: () => void;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ state, onSave }) => (
  <div className="pt-4 space-y-3">
    <button
      type="button"
      onClick={onSave}
      disabled={state.status === "saving"}
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
    >
      {state.status === "saving" ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Guardando en base de datos…</span>
        </>
      ) : (
        <span>💾 Guardar Cambios</span>
      )}
    </button>

    {state.message && (
      <p className={`text-sm font-medium ${
        state.status === "success" ? "text-emerald-400" :
        state.status === "error"   ? "text-rose-400"    :
        "text-slate-400"
      }`}>
        {state.message}
      </p>
    )}
  </div>
);
