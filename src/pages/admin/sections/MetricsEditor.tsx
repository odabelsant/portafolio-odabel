import React, { useState } from "react";
import { updateTextFileInRepo } from "../../../services/githubApiService";
import { SaveButton } from "./TextsEditor";
import type { SaveState } from "./TextsEditor";

interface Metric {
  id: string;
  label: string;
  value: string;
  icon: string;
}

const DEFAULT_METRICS: Metric[] = [
  { id: "tc_designed",        label: "Casos de Prueba Diseñados",    value: "1,500+", icon: "FileText"    },
  { id: "bugs_reported",      label: "Errores Críticos Identificados", value: "450+",   icon: "Bug"         },
  { id: "scripts_automated",  label: "Scripts de Prueba Automatizados", value: "250+", icon: "Code2"       },
  { id: "projects_delivered", label: "Proyectos Entregados con Éxito", value: "12+",   icon: "CheckSquare" },
];

export const MetricsEditor: React.FC<{ onSaveComplete: (msg: string) => void }> = ({ onSaveComplete }) => {
  const [metrics, setMetrics] = useState<Metric[]>(DEFAULT_METRICS);
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle", message: "" });

  const updateMetric = (id: string, field: keyof Metric, value: string) => {
    setMetrics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleSave = async () => {
    setSaveState({ status: "saving" as const, message: "Guardando indicadores…" });

    try {
      const payload = {
        metrics: metrics.map(({ id, value, icon }) => ({ id, value, icon })),
        _updated: new Date().toISOString(),
      };

      await updateTextFileInRepo(
        "src/data/backoffice_metrics.json",
        JSON.stringify(payload, null, 2),
        `[Backoffice] Update QA metric values`
      );

      setSaveState({ status: "success" as const, message: "✓ Indicadores guardados. Vercel desplegará los cambios." });
      onSaveComplete("Métricas QA actualizadas.");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setSaveState({ status: "error" as const, message: `Error: ${message}` });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Indicadores de Logros QA</h3>
        <p className="text-sm text-slate-500 mb-6">
          Edita los valores numéricos mostrados en la sección "Logros e Impacto QA".
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="glass-panel rounded-2xl border border-white/5 p-5 space-y-3"
            >
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {metric.label}
              </p>

              <div className="space-y-1.5">
                <label className="block text-xs text-slate-500">Valor mostrado (ej: 1,500+)</label>
                <input
                  type="text"
                  value={metric.value}
                  onChange={(e) => updateMetric(metric.id, "value", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white font-bold text-lg border border-white/10 focus:border-primary focus:outline-none transition-colors"
                  placeholder="ej. 1,500+"
                />
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {metric.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SaveButton state={saveState as Parameters<typeof SaveButton>[0]["state"]} onSave={handleSave} />
    </div>
  );
};
