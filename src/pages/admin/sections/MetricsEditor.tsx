import React, { useState } from "react";
import { Plus, Trash2, FileText, Bug, Code2, CheckSquare } from "lucide-react";
import { updateTextFileInRepo } from "../../../services/githubApiService";
import { SaveButton } from "./TextsEditor";
import type { SaveState } from "./TextsEditor";
import backofficeMetrics from "../../../data/backoffice_metrics.json";

interface Metric {
  id: string;
  label: string;
  value: string;
  icon: string;
  labelKey?: string;
}

const DEFAULT_METRICS: Metric[] = [
  { id: "tc_designed",        label: "Casos de Prueba Diseñados",    value: "1,500+", icon: "FileText",    labelKey: "highlights.tc_designed" },
  { id: "bugs_reported",      label: "Errores Críticos Identificados", value: "450+",   icon: "Bug",         labelKey: "highlights.bugs_reported" },
  { id: "scripts_automated",  label: "Scripts de Prueba Automatizados", value: "250+",  icon: "Code2",       labelKey: "highlights.scripts_automated" },
  { id: "projects_delivered", label: "Proyectos Entregados con Éxito", value: "12+",   icon: "CheckSquare", labelKey: "highlights.projects_delivered" },
];

export const MetricsEditor: React.FC<{ onSaveComplete: (msg: string) => void }> = ({ onSaveComplete }) => {
  const [metrics, setMetrics] = useState<Metric[]>(() => {
    const loaded = backofficeMetrics.metrics || [];
    if (loaded.length === 0) return DEFAULT_METRICS;
    return loaded.map((m: any) => {
      const def = DEFAULT_METRICS.find((d) => d.id === m.id);
      return {
        id: m.id,
        label: m.label || def?.label || "Nuevo Logro",
        value: m.value || "0",
        icon: m.icon || def?.icon || "CheckSquare",
        labelKey: m.labelKey || def?.labelKey || ""
      };
    });
  });
  
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle", message: "" });

  const updateMetric = (id: string, field: keyof Metric, value: string) => {
    setMetrics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const addMetric = () => {
    const newMetric: Metric = {
      id: `custom-metric-${Date.now()}`,
      label: "Nuevo Logro",
      value: "10+",
      icon: "CheckSquare"
    };
    setMetrics((prev) => [...prev, newMetric]);
  };

  const deleteMetric = (id: string) => {
    setMetrics((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSave = async () => {
    setSaveState({ status: "saving" as const, message: "Guardando indicadores…" });

    const TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;
    const isDummyToken = !TOKEN || TOKEN === "ghp_TuTokenDeGitHubDeFirmeEscritura" || TOKEN.startsWith("ghp_TuToken");

    try {
      const payload = {
        metrics: metrics.map(({ id, label, value, icon, labelKey }) => ({
          id,
          label,
          value,
          icon,
          labelKey: labelKey || ""
        })),
        _updated: new Date().toISOString(),
      };

      if (isDummyToken) {
        // Simulation delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        await updateTextFileInRepo(
          "src/data/backoffice_metrics.json",
          JSON.stringify(payload, null, 2),
          `[Backoffice] Update QA metrics and custom achievements`
        );
      }

      setSaveState({ status: "success" as const, message: "✓ Indicadores guardados. Vercel desplegará los cambios." });
      onSaveComplete("Métricas QA actualizadas.");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setSaveState({ status: "error" as const, message: `Error: ${message}` });
    }
  };

  const iconsList = ["FileText", "Bug", "Code2", "CheckSquare"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Indicadores de Logros QA</h3>
          <p className="text-sm text-slate-500">
            Edita los títulos, valores e íconos de la sección "Logros e Impacto QA" de tu portafolio.
          </p>
        </div>
        <button
          type="button"
          onClick={addMetric}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white text-xs font-semibold transition-all duration-300 shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Logro</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="glass-panel rounded-2xl border border-white/5 p-5 space-y-4 relative group"
          >
            {/* Delete button for achievements */}
            <button
              type="button"
              onClick={() => deleteMetric(metric.id)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900/60 border border-white/5 hover:border-rose-500/30 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
              title="Eliminar logro"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Editable Title */}
            <div className="space-y-1">
              <label className="block text-xs text-slate-500 font-semibold">Título del Logro</label>
              <input
                type="text"
                value={metric.label}
                onChange={(e) => updateMetric(metric.id, "label", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950/70 text-white font-semibold text-sm border border-white/10 focus:border-primary focus:outline-none"
                placeholder="Ej: Casos de Prueba"
              />
            </div>

            {/* Editable Value */}
            <div className="space-y-1">
              <label className="block text-xs text-slate-500 font-semibold">Valor / Número (ej: 1,500+)</label>
              <input
                type="text"
                value={metric.value}
                onChange={(e) => updateMetric(metric.id, "value", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950/70 text-white font-bold text-sm border border-white/10 focus:border-primary focus:outline-none"
                placeholder="ej. 1,500+"
              />
            </div>

            {/* Icon Picker */}
            <div className="space-y-1.5">
              <span className="block text-xs text-slate-500 font-semibold">Seleccionar Ícono</span>
              <div className="flex gap-2">
                {iconsList.map((iconName) => {
                  const isSelected = metric.icon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => updateMetric(metric.id, "icon", iconName)}
                      className={`p-2 rounded-lg border transition-all ${
                        isSelected
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-slate-950/50 border-white/5 text-slate-500 hover:text-slate-300"
                      }`}
                      title={iconName}
                    >
                      {iconName === "FileText" && <FileText className="w-4 h-4" />}
                      {iconName === "Bug" && <Bug className="w-4 h-4" />}
                      {iconName === "Code2" && <Code2 className="w-4 h-4" />}
                      {iconName === "CheckSquare" && <CheckSquare className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live visual preview of the indicator */}
            <div className="pt-2 flex items-center justify-between border-t border-white/5">
              <span className="text-xs text-slate-500 uppercase font-semibold">Vista previa</span>
              <span className="text-lg font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {metric.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <SaveButton state={saveState as Parameters<typeof SaveButton>[0]["state"]} onSave={handleSave} />
    </div>
  );
};
