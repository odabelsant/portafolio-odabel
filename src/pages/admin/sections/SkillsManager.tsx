import React, { useState, useEffect } from "react";
import {
  Plus, Edit2, Trash2, Eye, X, Check,
  AlertCircle, CheckCircle2, Award, Sliders
} from "lucide-react";
import { saveContent } from "../../../services/apiService";

interface Skill {
  name: string;
  level: number;
  icon: string;
}

interface SkillCategory {
  id: string;
  title: string;
  skills: Skill[];
}

const DEFAULT_CATEGORIES: SkillCategory[] = [
  {
    id: "testing",
    title: "Pruebas de Software (QA)",
    skills: [
      { name: "Manual Testing", level: 95, icon: "ClipboardCheck" },
      { name: "Regression Testing", level: 95, icon: "RefreshCw" },
      { name: "Smoke Testing", level: 95, icon: "Flame" },
      { name: "Functional Testing", level: 90, icon: "Settings" }
    ]
  },
  {
    id: "automation",
    title: "Automatización de Pruebas",
    skills: [
      { name: "Selenium", level: 85, icon: "Cpu" },
      { name: "Cucumber", level: 85, icon: "FileCode2" },
      { name: "Katalon Studio", level: 80, icon: "Layers" }
    ]
  }
];

export const SkillsManager: React.FC<{ onSaveComplete: (msg: string) => void }> = ({ onSaveComplete }) => {
  const [categories, setCategories] = useState<SkillCategory[]>(DEFAULT_CATEGORIES);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SkillCategory | null>(null);

  // Form State
  const [formCategoryTitle, setFormCategoryTitle] = useState("");
  const [formSkills, setFormSkills] = useState<Skill[]>([{ name: "", level: 80, icon: "Award" }]);

  // Save State
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    async function loadSkills() {
      try {
        const response = await fetch("/api/content");
        if (response.ok) {
          const contents = await response.json();
          const item = contents.find((c: any) => c.key === "backoffice_skills");
          if (item) {
            const skillsData = JSON.parse(item.value);
            if (skillsData.categories) {
              setCategories(skillsData.categories);
            }
          }
        }
      } catch (err) {
        console.error("Error loading skills in backoffice:", err);
      }
    }
    loadSkills();
  }, []);

  const resetForm = () => {
    setFormCategoryTitle("");
    setFormSkills([{ name: "", level: 80, icon: "Award" }]);
    setActiveCategory(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (cat: SkillCategory) => {
    setActiveCategory(cat);
    setFormCategoryTitle(cat.title);
    setFormSkills(cat.skills.length > 0 ? [...cat.skills] : [{ name: "", level: 80, icon: "Award" }]);
    setIsModalOpen(true);
  };

  const openDetailsModal = (cat: SkillCategory) => {
    setActiveCategory(cat);
    setIsDetailsOpen(true);
  };

  const handleAddSkillField = () => {
    setFormSkills((prev) => [...prev, { name: "", level: 80, icon: "Award" }]);
  };

  const handleRemoveSkillField = (index: number) => {
    setFormSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSkillFieldChange = (index: number, field: keyof Skill, value: string | number) => {
    setFormSkills((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const persistToRepo = async (updatedList: SkillCategory[], actionLabel: string) => {
    setSaveStatus("saving");
    setSaveMessage("Persistiendo cambios en la base de datos...");

    try {
      // Self-Test / Zod check replacement (basic schema checking)
      updatedList.forEach((cat) => {
        if (!cat.title || cat.title.trim().length < 3) {
          throw new Error(`La categoría debe tener al menos 3 caracteres.`);
        }
        cat.skills.forEach((skill) => {
          if (!skill.name || skill.name.trim().length < 2) {
            throw new Error(`El nombre de la habilidad '${skill.name}' es inválido.`);
          }
          if (skill.level < 0 || skill.level > 100) {
            throw new Error(`El nivel de la habilidad '${skill.name}' debe estar entre 0 y 100.`);
          }
        });
      });

      const payload = {
        categories: updatedList,
        _updated: new Date().toISOString()
      };

      await saveContent("backoffice_skills", payload);

      setSaveStatus("success");
      setSaveMessage("¡Habilidades guardadas correctamente!");
      setCategories(updatedList);
      onSaveComplete(`Categoría de habilidades ${actionLabel} correctamente.`);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setSaveStatus("error");
      setSaveMessage(`Error de Validación/Conexión: ${errMsg}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategoryTitle.trim()) return;

    const sanitizedSkills = formSkills
      .map((s) => ({ ...s, name: s.name.trim() }))
      .filter((s) => s.name.length > 0);

    const categoryData: SkillCategory = {
      id: activeCategory ? activeCategory.id : `skills-${Date.now()}`,
      title: formCategoryTitle.trim(),
      skills: sanitizedSkills
    };

    let updatedList: SkillCategory[];
    if (activeCategory) {
      updatedList = categories.map((c) => (c.id === activeCategory.id ? categoryData : c));
    } else {
      updatedList = [...categories, categoryData];
    }

    persistToRepo(updatedList, activeCategory ? "actualizada" : "creada");
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar la categoría "${title}" y todas sus habilidades?`)) {
      const updatedList = categories.filter((c) => c.id !== id);
      persistToRepo(updatedList, "eliminada");
    }
  };

  const filteredCategories = categories.filter((c) => {
    const titleMatch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const itemsMatch = c.skills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return titleMatch || itemsMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <span>Gestor de Habilidades Técnicas</span>
          </h3>
          <p className="text-sm text-slate-500">
            Administra las categorías de destreza y niveles técnicos del portafolio.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white text-sm font-semibold transition-all duration-300 shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Habilidad</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar habilidades por categoría, nombre..."
          className="w-full px-4 py-3 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Skills Data Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-slate-950/40 text-slate-400 font-semibold text-xs tracking-wider uppercase">
                <th className="p-4">Categoría</th>
                <th className="p-4">Items / Habilidades</th>
                <th className="p-4 text-center">Nivel Promedio (%)</th>
                <th className="p-4 text-center w-32">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-slate-300">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 font-medium">
                    No se encontraron habilidades.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => {
                  const avgLevel = cat.skills.length > 0 
                    ? Math.round(cat.skills.reduce((acc, s) => acc + s.level, 0) / cat.skills.length) 
                    : 0;

                  return (
                    <tr key={cat.id} className="hover:bg-white/2 transition-colors">
                      <td className="p-4 font-bold text-white max-w-[200px] truncate">
                        {cat.title}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {cat.skills.map((s) => (
                            <span
                              key={s.name}
                              className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-950/60 text-slate-400 border border-white/5"
                            >
                              {s.name} ({s.level}%)
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-center font-bold text-primary">
                        {avgLevel}%
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openDetailsModal(cat)}
                            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cat.id, cat.title)}
                            className="p-2 rounded-lg hover:bg-rose-500/5 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Status Notification */}
      {saveStatus !== "idle" && saveStatus !== "saving" && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold ${
          saveStatus === "success" ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" :
          "bg-rose-500/10 border-rose-500/25 text-rose-400"
        }`}>
          {saveStatus === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsOpen && activeCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#050816]/80 backdrop-blur-sm" onClick={() => setIsDetailsOpen(false)} />
          <div className="relative w-full max-w-md bg-[#0c102a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h4 className="text-base font-bold text-white">{activeCategory.title}</h4>
              <button onClick={() => setIsDetailsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {activeCategory.skills.map((s) => (
                <div key={s.name} className="flex justify-between items-center text-sm py-1.5 border-b border-white/5">
                  <span className="font-semibold text-slate-300">{s.name}</span>
                  <span className="font-bold text-primary">{s.level}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#050816]/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0c102a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h4 className="text-base font-bold text-white">
                {activeCategory ? "Editar Habilidades" : "Crear Nueva Categoría de Habilidades"}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400">Título de la Categoría</label>
                <input
                  type="text"
                  required
                  value={formCategoryTitle}
                  onChange={(e) => setFormCategoryTitle(e.target.value)}
                  placeholder="Ej: Automatización de Pruebas"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-400">Habilidades Técnicas</label>
                  <button
                    type="button"
                    onClick={handleAddSkillField}
                    className="text-xs text-primary font-bold hover:text-secondary flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Añadir Item
                  </button>
                </div>

                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                  {formSkills.map((s, index) => (
                    <div key={index} className="glass-panel p-3.5 rounded-xl border border-white/5 space-y-3 relative">
                      <div className="flex items-center gap-2 justify-between">
                        <input
                          type="text"
                          required
                          value={s.name}
                          onChange={(e) => handleSkillFieldChange(index, "name", e.target.value)}
                          placeholder="Habilidad (ej: Playwright)"
                          className="flex-1 px-3 py-2 rounded-lg bg-slate-950/60 text-white text-xs border border-white/10 focus:border-primary focus:outline-none"
                        />
                        {formSkills.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSkillField(index)}
                            className="p-1 rounded bg-slate-900 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <Sliders className="w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={s.level}
                          onChange={(e) => handleSkillFieldChange(index, "level", parseInt(e.target.value))}
                          className="flex-1 accent-primary h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-400 w-8 text-right">{s.level}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white text-sm font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saveStatus === "saving"}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent disabled:from-slate-700 disabled:to-slate-700 text-white text-sm font-semibold transition-all duration-300 shadow-md shadow-primary/20 cursor-pointer"
                >
                  {saveStatus === "saving" ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{activeCategory ? "Guardar Cambios" : "Crear Categoría"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
