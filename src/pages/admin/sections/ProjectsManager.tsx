import React, { useState, useEffect } from "react";
import {
  Search, Plus, Edit2, Trash2, Image, X,
  Upload, CheckCircle2, AlertCircle,
  Check
} from "lucide-react";
import { saveContent } from "../../../services/apiService";
import { Github } from "../../../components/Icons";

interface Project {
  id: string;
  titleKey?: string;
  descriptionKey?: string;
  tech: string[];
  roleKey?: string;
  category: "manual" | "automation" | "api" | "personal";
  demoUrl?: string;
  repoUrl?: string;
  image?: string;
  title?: string;       // Dynamic title (straight string)
  description?: string; // Dynamic description (straight string)
  role?: string;        // Dynamic role (straight string)
}

export const ProjectsManager: React.FC<{ onSaveComplete: (msg: string) => void }> = ({ onSaveComplete }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form Fields State
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formRole, setFormRole] = useState("QA Engineer");
  const [formRepoUrl, setFormRepoUrl] = useState("");
  const [formDemoUrl, setFormDemoUrl] = useState("");
  const [formCategory, setFormCategory] = useState<Project["category"]>("automation");
  const [formTechString, setFormTechString] = useState("");
  
  // Drag & Drop State
  const [dragActive, setDragActive] = useState(false);
  const [, setUploadedImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  // Save state for operations
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/content");
        if (response.ok) {
          const contents = await response.json();
          const item = contents.find((c: any) => c.key === "projects");
          if (item) {
            setProjects(JSON.parse(item.value));
          }
        }
      } catch (err) {
        console.error("Error loading projects in backoffice:", err);
      }
    }
    loadProjects();
  }, []);

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormRole("QA Engineer");
    setFormRepoUrl("");
    setFormDemoUrl("");
    setFormCategory("automation");
    setFormTechString("");
    setUploadedImageFile(null);
    setUploadedImagePreview(null);
    setEditingProject(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormTitle(project.title || (project.titleKey ? project.id : ""));
    setFormDescription(project.description || "");
    setFormRole(project.role || "QA Engineer");
    setFormRepoUrl(project.repoUrl || "");
    setFormDemoUrl(project.demoUrl || "");
    setFormCategory(project.category);
    setFormTechString(project.tech.join(", "));
    setUploadedImagePreview(project.image || null);
    setUploadedImageFile(null);
    setIsModalOpen(true);
  };

  // Drag Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setUploadedImageFile(file);
        setUploadedImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImageFile(file);
      setUploadedImagePreview(URL.createObjectURL(file));
    }
  };

  const persistToRepo = async (updatedList: Project[], message: string) => {
    setSaveStatus("saving");
    setSaveMessage("Guardando listado de proyectos en la base de datos...");

    try {
      await saveContent("projects", updatedList);

      setSaveStatus("success");
      setSaveMessage("Cambios guardados con éxito.");
      setProjects(updatedList);
      onSaveComplete(`Proyecto ${message} correctamente.`);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setSaveStatus("error");
      setSaveMessage(`Error: ${errMsg}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription) return;

    const techArray = formTechString
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const projectData: Project = {
      id: editingProject ? editingProject.id : `project-${Date.now()}`,
      title: formTitle,
      description: formDescription,
      role: formRole,
      tech: techArray,
      category: formCategory,
      repoUrl: formRepoUrl || undefined,
      demoUrl: formDemoUrl || undefined,
      image: uploadedImagePreview || undefined, // Store temporary or uploaded link path
    };

    // Keep translation keys if we are editing a legacy project that has them
    if (editingProject) {
      if (editingProject.titleKey) projectData.titleKey = editingProject.titleKey;
      if (editingProject.descriptionKey) projectData.descriptionKey = editingProject.descriptionKey;
      if (editingProject.roleKey) projectData.roleKey = editingProject.roleKey;
    }

    let updatedList: Project[];
    if (editingProject) {
      updatedList = projects.map((p) => (p.id === editingProject.id ? projectData : p));
    } else {
      updatedList = [...projects, projectData];
    }

    persistToRepo(updatedList, editingProject ? "actualizado" : "creado");
  };

  const handleDelete = (id: string) => {
    const p = projects.find((item) => item.id === id);
    const title = p?.title || p?.id || "";
    if (window.confirm(`¿Estás seguro de que deseas eliminar el proyecto "${title}"?`)) {
      const updatedList = projects.filter((item) => item.id !== id);
      persistToRepo(updatedList, "eliminado");
    }
  };

  const filteredProjects = projects.filter((p) => {
    const title = (p.title || p.id).toLowerCase();
    const desc = (p.description || "").toLowerCase();
    const tech = p.tech.join(" ").toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || desc.includes(query) || tech.includes(query);
  });

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Gestión de Proyectos QA</h3>
          <p className="text-sm text-slate-500">
            Administra el listado de proyectos visualizado en tu portafolio público.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white text-sm font-semibold transition-all duration-300 shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Proyecto</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar proyecto por título, descripción, tecnología..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Data Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-slate-950/40 text-slate-400 font-semibold text-xs tracking-wider uppercase">
                <th className="p-4 w-16 text-center">Miniatura</th>
                <th className="p-4">Título</th>
                <th className="p-4 hidden md:table-cell">Categoría</th>
                <th className="p-4 hidden sm:table-cell">GitHub URL</th>
                <th className="p-4 text-center w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-slate-300">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                    No se encontraron proyectos.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4 flex items-center justify-center">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.id}
                          className="w-10 h-10 object-cover rounded-lg border border-white/10"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-900 border border-white/5 rounded-lg flex items-center justify-center text-primary">
                          <Image className="w-5 h-5 text-slate-500" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-white max-w-[200px] truncate">
                      {project.title || project.id}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
                        project.category === "automation" ? "bg-primary/10 text-primary border border-primary/20" :
                        project.category === "api"        ? "bg-sky-400/10 text-sky-400 border border-sky-400/20" :
                        project.category === "manual"     ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20" :
                        "bg-purple-400/10 text-purple-400 border border-purple-400/20"
                      }`}>
                        {project.category}
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell max-w-[220px] truncate text-slate-400 font-mono text-xs">
                      {project.repoUrl ? (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <Github className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{project.repoUrl.replace("https://github.com/", "")}</span>
                        </a>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(project)}
                          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(project.id)}
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

      {/* Form Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay backdrop */}
          <div className="fixed inset-0 bg-[#050816]/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-[#0c102a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h4 className="text-base font-bold text-white">
                {editingProject ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
              {/* Title input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400">Título del Proyecto</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ej: Framework Selenium E-Commerce"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Description input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400">Descripción</label>
                <textarea
                  rows={4}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detalles sobre el alcance, diseño e impactos del proyecto de pruebas..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none resize-none"
                />
              </div>

              {/* Role & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-400">Mi Rol</label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="QA Engineer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-400">Categoría</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Project["category"])}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none"
                  >
                    <option value="automation">Automation Testing</option>
                    <option value="api">API Testing</option>
                    <option value="manual">Manual Testing</option>
                    <option value="personal">Proyecto Personal</option>
                  </select>
                </div>
              </div>

              {/* Repos & Demo Links */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-400">Repositiorio GitHub (URL)</label>
                  <input
                    type="url"
                    value={formRepoUrl}
                    onChange={(e) => setFormRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-400">URL Demo En Vivo (Opcional)</label>
                  <input
                    type="url"
                    value={formDemoUrl}
                    onChange={(e) => setFormDemoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Technology inputs */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400">Tecnologías (Separadas por comas)</label>
                <input
                  type="text"
                  value={formTechString}
                  onChange={(e) => setFormTechString(e.target.value)}
                  placeholder="Playwright, TypeScript, CI/CD, Java"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Drag and Drop Image Upload Zone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400">Imagen del Proyecto</label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`w-full p-4 rounded-xl border border-dashed text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-white/10 hover:border-primary/40 text-slate-400 hover:text-slate-300"
                  }`}
                  onClick={() => document.getElementById("project-image-input")?.click()}
                >
                  <input
                    id="project-image-input"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />

                  {uploadedImagePreview ? (
                    <div className="relative w-full h-24 rounded-lg overflow-hidden border border-white/5">
                      <img src={uploadedImagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedImageFile(null);
                          setUploadedImagePreview(null);
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-slate-500" />
                      <div className="text-xs">
                        <span className="font-semibold text-primary">Haz clic para subir</span> o arrastra y suelta una imagen aquí
                      </div>
                    </>
                  )}
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
                      <span>{editingProject ? "Guardar Cambios" : "Crear Proyecto"}</span>
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
