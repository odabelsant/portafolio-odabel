import React, { useState } from "react";
import {
  Plus, Edit2, Trash2, Eye, X, Check,
  AlertCircle, CheckCircle2, GraduationCap, Calendar, BookOpen
} from "lucide-react";
import { updateTextFileInRepo } from "../../../services/githubApiService";
import initialEducation from "../../../data/backoffice_education.json";
import type { EducationItem } from "../../../data/types";

export const EducationManager: React.FC<{ onSaveComplete: (msg: string) => void }> = ({ onSaveComplete }) => {
  const [items, setItems] = useState<EducationItem[]>(() => {
    return (initialEducation.education as EducationItem[]) || [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<EducationItem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formInstitution, setFormInstitution] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // Save Status
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const resetForm = () => {
    setFormTitle("");
    setFormInstitution("");
    setFormDate("");
    setFormDescription("");
    setActiveItem(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: EducationItem) => {
    setActiveItem(item);
    setFormTitle(item.title);
    setFormInstitution(item.institution);
    setFormDate(item.date);
    setFormDescription(item.description);
    setIsModalOpen(true);
  };

  const openDetailsModal = (item: EducationItem) => {
    setActiveItem(item);
    setIsDetailsOpen(true);
  };

  const persistToRepo = async (updatedList: EducationItem[], actionLabel: string) => {
    setSaveStatus("saving");
    setSaveMessage("Persistiendo cambios en la base de datos...");

    const TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;
    const isDummyToken = !TOKEN || TOKEN === "ghp_TuTokenDeGitHubDeFirmeEscritura" || TOKEN.startsWith("ghp_TuToken");

    try {
      // Tarea 4: Validación de QA Automatizada / Self-Test
      updatedList.forEach((item) => {
        if (!item.title || item.title.trim().length < 3) {
          throw new Error(`El título de la formación debe tener al menos 3 caracteres.`);
        }
        if (!item.institution || item.institution.trim().length < 2) {
          throw new Error(`La academia/institución es obligatoria (puede ser "N/A").`);
        }
        if (!item.date || item.date.trim().length < 2) {
          throw new Error(`La fecha/año es obligatoria.`);
        }
        if (!item.description || item.description.trim().length < 5) {
          throw new Error(`La descripción debe tener al menos 5 caracteres.`);
        }
      });

      const payload = {
        education: updatedList,
        _updated: new Date().toISOString()
      };

      if (isDummyToken) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      } else {
        await updateTextFileInRepo(
          "src/data/backoffice_education.json",
          JSON.stringify(payload, null, 2),
          `[Backoffice] CRUD Education — ${actionLabel}`
        );
      }

      setSaveStatus("success");
      setSaveMessage("¡Formaciones académicas guardadas correctamente!");
      setItems(updatedList);
      onSaveComplete(`Formación ${actionLabel} correctamente.`);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setSaveStatus("error");
      setSaveMessage(`Error de Validación: ${errMsg}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const itemData: EducationItem = {
      id: activeItem ? activeItem.id : `edu-${Date.now()}`,
      title: formTitle.trim(),
      institution: formInstitution.trim() || "N/A",
      date: formDate.trim(),
      description: formDescription.trim()
    };

    let updatedList: EducationItem[];
    if (activeItem) {
      updatedList = items.map((i) => (i.id === activeItem.id ? itemData : i));
    } else {
      updatedList = [...items, itemData];
    }

    persistToRepo(updatedList, activeItem ? "actualizada" : "creada");
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar la formación "${title}"?`)) {
      const updatedList = items.filter((i) => i.id !== id);
      persistToRepo(updatedList, "eliminada");
    }
  };

  const filteredItems = items.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const instMatch = item.institution.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || instMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span>Gestor de Educación & Formación</span>
          </h3>
          <p className="text-sm text-slate-500">
            Administra tus títulos, certificaciones y trayectoria académica.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white text-sm font-semibold transition-all duration-300 shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Formación</span>
        </button>
      </div>

      {/* Filtro de Búsqueda */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar educación por título, institución..."
          className="w-full px-4 py-3 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Tabla de Datos */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-slate-950/40 text-slate-400 font-semibold text-xs tracking-wider uppercase">
                <th className="p-4">Título / Certificación</th>
                <th className="p-4">Academia / Institución</th>
                <th className="p-4 text-center">Año / Fecha</th>
                <th className="p-4 text-center w-32">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-slate-300">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 font-medium">
                    No se encontraron registros de educación.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4 font-bold text-white max-w-[250px] truncate">
                      {item.title}
                    </td>
                    <td className="p-4 text-slate-400">
                      {item.institution}
                    </td>
                    <td className="p-4 text-center font-semibold text-primary">
                      {item.date}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openDetailsModal(item)}
                          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-2 rounded-lg hover:bg-rose-500/5 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notificación de Estado */}
      {saveStatus !== "idle" && saveStatus !== "saving" && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold ${
          saveStatus === "success" ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" :
          "bg-rose-500/10 border-rose-500/25 text-rose-400"
        }`}>
          {saveStatus === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Modal de Detalles */}
      {isDetailsOpen && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#050816]/80 backdrop-blur-sm" onClick={() => setIsDetailsOpen(false)} />
          <div className="relative w-full max-w-md bg-[#0c102a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span>Detalles de Educación</span>
              </h4>
              <button onClick={() => setIsDetailsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-left">
              <div>
                <span className="block text-xs font-semibold text-slate-500">Título / Certificación</span>
                <span className="text-sm font-bold text-white">{activeItem.title}</span>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <span className="block text-xs font-semibold text-slate-500">Institución</span>
                  <span className="text-sm font-semibold text-slate-300">{activeItem.institution}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-500">Fecha / Año</span>
                  <span className="text-sm font-bold text-primary flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {activeItem.date}
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5">
                <span className="block text-xs font-semibold text-slate-500 mb-1">Descripción</span>
                <p className="text-sm text-slate-400 leading-relaxed flex gap-2">
                  <BookOpen className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span>{activeItem.description}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear / Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#050816]/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0c102a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span>{activeItem ? "Editar Formación" : "Nueva Formación Académica"}</span>
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400">Título o Certificación *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ej: ISTQB Certified Tester Foundation Level"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-400">Academia o Institución *</label>
                  <input
                    type="text"
                    required
                    value={formInstitution}
                    onChange={(e) => setFormInstitution(e.target.value)}
                    placeholder="Ej: Udemy / SmartBear (o N/A)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-400">Fecha o Año *</label>
                  <input
                    type="text"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="Ej: Obtenido en 2024 o 2023-2024"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400">Descripción detallada *</label>
                <textarea
                  required
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe las habilidades clave, herramientas y conocimientos adquiridos..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none resize-none"
                />
              </div>

              {/* Acciones */}
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
                      <span>{activeItem ? "Guardar Cambios" : "Crear Registro"}</span>
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
