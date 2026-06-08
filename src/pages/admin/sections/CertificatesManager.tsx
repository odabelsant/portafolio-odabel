import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  Award,
  Check,
  CheckCircle2,
  Edit2,
  FileImage,
  FileText,
  Plus,
  Trash2,
  X
} from "lucide-react";
import {
  deleteFileFromRepo,
  updateTextFileInRepo,
  uploadBinaryFileToRepo
} from "../../../services/githubApiService";
import initialCertificates from "../../../data/backoffice_certificates.json";
import type { BackofficeCertificates, Certificate } from "../../../data/types";

interface CertificatesManagerProps {
  onSaveComplete: (msg: string) => void;
}

const toSafeFileName = (fileName: string) =>
  fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .toLowerCase();

const buildPublicCertificateUrlFromFile = (file: File) =>
  `/certificates/${Date.now()}_${toSafeFileName(file.name)}`;

const publicUrlToRepoPath = (fileUrl: string): string | null => {
  if (!fileUrl.startsWith("/")) return null;
  if (!fileUrl.startsWith("/certificates/")) return null;
  return `public${fileUrl}`;
};

const getFileIcon = (fileUrl: string) => {
  const normalized = fileUrl.toLowerCase();
  if (normalized.endsWith(".png") || normalized.endsWith(".jpg") || normalized.endsWith(".jpeg")) {
    return <FileImage className="w-5 h-5" />;
  }

  return <FileText className="w-5 h-5" />;
};

export const CertificatesManager: React.FC<CertificatesManagerProps> = ({ onSaveComplete }) => {
  const certificatesPayload = initialCertificates as BackofficeCertificates;
  const [items, setItems] = useState<Certificate[]>(() => certificatesPayload.certificates || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<Certificate | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formInstitution, setFormInstitution] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formFileUrl, setFormFileUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return items;

    return items.filter((item) =>
      [item.title, item.institution, item.year, item.fileUrl].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [items, searchQuery]);

  const resetForm = () => {
    setActiveItem(null);
    setFormTitle("");
    setFormInstitution("");
    setFormYear("");
    setFormFileUrl("");
    setSelectedFile(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: Certificate) => {
    setActiveItem(item);
    setFormTitle(item.title);
    setFormInstitution(item.institution);
    setFormYear(item.year);
    setFormFileUrl(item.fileUrl);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const validateCertificates = (certificates: Certificate[]) => {
    certificates.forEach((certificate) => {
      if (!certificate.title || certificate.title.trim().length < 3) {
        throw new Error("El título del certificado debe tener al menos 3 caracteres.");
      }
      if (!certificate.institution || certificate.institution.trim().length < 2) {
        throw new Error("La institución del certificado es obligatoria.");
      }
      if (!certificate.year || certificate.year.trim().length < 2) {
        throw new Error("El año del certificado es obligatorio.");
      }
      if (!certificate.fileUrl || !certificate.fileUrl.startsWith("/")) {
        throw new Error("La ruta del archivo debe ser absoluta desde public, por ejemplo /certificates/certificado.pdf.");
      }
      if (!/\.(pdf|png|jpg|jpeg)$/i.test(certificate.fileUrl)) {
        throw new Error("El archivo del certificado debe ser PDF, PNG, JPG o JPEG.");
      }
    });
  };

  const persistCertificatesJson = async (updatedList: Certificate[], actionLabel: string) => {
    setSaveStatus("saving");
    setSaveMessage("Persistiendo certificados en GitHub...");

    const TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;
    const isDummyToken = !TOKEN || TOKEN === "ghp_TuTokenDeGitHubDeFirmeEscritura" || TOKEN.startsWith("ghp_TuToken");

    try {
      validateCertificates(updatedList);

      const payload: BackofficeCertificates = {
        certificates: updatedList,
        _updated: new Date().toISOString()
      };

      if (isDummyToken) {
        await new Promise((resolve) => setTimeout(resolve, 900));
      } else {
        await updateTextFileInRepo(
          "src/data/backoffice_certificates.json",
          JSON.stringify(payload, null, 2),
          `[Backoffice] Certificates JSON — ${actionLabel}`
        );
      }

      setItems(updatedList);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      throw new Error(`Error al persistir JSON: ${errMsg}`);
    }
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      setFormFileUrl(buildPublicCertificateUrlFromFile(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");

    try {
      const TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;
      const isDummyToken = !TOKEN || TOKEN === "ghp_TuTokenDeGitHubDeFirmeEscritura" || TOKEN.startsWith("ghp_TuToken");
      const isEditing = Boolean(activeItem);

      let finalFileUrl = formFileUrl.trim();
      let oldFileRepoPathToDelete: string | null = null;

      if (selectedFile) {
        finalFileUrl = buildPublicCertificateUrlFromFile(selectedFile);
        const newFileRepoPath = `public${finalFileUrl}`;

        if (isDummyToken) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        } else {
          setSaveMessage("Subiendo archivo físico del certificado...");
          await uploadBinaryFileToRepo(
            newFileRepoPath,
            selectedFile,
            `[Backoffice] Certificates Asset — ${isEditing ? "update" : "create"} ${finalFileUrl}`
          );
        }

        if (activeItem?.fileUrl && activeItem.fileUrl !== finalFileUrl) {
          oldFileRepoPathToDelete = publicUrlToRepoPath(activeItem.fileUrl);
        }
      }

      const itemData: Certificate = {
        id: activeItem ? activeItem.id : `cert-${Date.now()}`,
        title: formTitle.trim(),
        institution: formInstitution.trim(),
        year: formYear.trim(),
        fileUrl: finalFileUrl
      };

      const updatedList = activeItem
        ? items.map((item) => (item.id === activeItem.id ? itemData : item))
        : [...items, itemData];

      await persistCertificatesJson(updatedList, isEditing ? "updated" : "created");

      if (oldFileRepoPathToDelete && !isDummyToken) {
        setSaveMessage("Eliminando archivo físico anterior...");
        await deleteFileFromRepo(
          oldFileRepoPathToDelete,
          `[Backoffice] Certificates Asset Cleanup — ${oldFileRepoPathToDelete}`
        );
      }

      setSaveStatus("success");
      setSaveMessage("¡Certificado guardado correctamente!");
      onSaveComplete(`Certificado ${isEditing ? "actualizado" : "creado"} correctamente.`);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setSaveStatus("error");
      setSaveMessage(`Error: ${errMsg}`);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar el certificado "${title}"?`)) {
      setSaveStatus("saving");
      try {
        const targetItem = items.find((item) => item.id === id) || null;
        const updatedList = items.filter((item) => item.id !== id);
        await persistCertificatesJson(updatedList, "deleted");

        const TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;
        const isDummyToken = !TOKEN || TOKEN === "ghp_TuTokenDeGitHubDeFirmeEscritura" || TOKEN.startsWith("ghp_TuToken");
        const fileRepoPath = targetItem?.fileUrl ? publicUrlToRepoPath(targetItem.fileUrl) : null;

        if (fileRepoPath && !isDummyToken) {
          setSaveMessage("Eliminando archivo físico del certificado...");
          await deleteFileFromRepo(
            fileRepoPath,
            `[Backoffice] Certificates Asset Delete — ${fileRepoPath}`
          );
        }

        setSaveStatus("success");
        setSaveMessage("¡Certificado eliminado correctamente!");
        onSaveComplete("Certificado eliminado correctamente.");
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setSaveStatus("error");
        setSaveMessage(`Error al eliminar: ${errMsg}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <span>Gestor de Certificados</span>
          </h3>
          <p className="text-sm text-slate-500">
            Administra certificados como registros completos con título, institución, año y archivo real.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white text-sm font-semibold transition-all duration-300 shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Certificado</span>
        </button>
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar certificados por título, institución, año o archivo..."
        className="w-full px-4 py-3 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none transition-colors"
      />

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-slate-950/40 text-slate-400 font-semibold text-xs tracking-wider uppercase">
                <th className="p-4 w-20 text-center">Archivo</th>
                <th className="p-4">Título</th>
                <th className="p-4">Institución</th>
                <th className="p-4 text-center">Año</th>
                <th className="p-4 text-center w-28">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-slate-300">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                    No se encontraron certificados.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/2 transition-colors">
                    <td className="p-4">
                      <div className="mx-auto w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        {getFileIcon(item.fileUrl)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white max-w-[260px] truncate">{item.title}</div>
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-500 hover:text-primary transition-colors break-all"
                      >
                        {item.fileUrl}
                      </a>
                    </td>
                    <td className="p-4 text-slate-400">{item.institution}</td>
                    <td className="p-4 text-center font-semibold text-primary">{item.year}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
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

      {saveStatus !== "idle" && saveStatus !== "saving" && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold ${
          saveStatus === "success"
            ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
            : "bg-rose-500/10 border-rose-500/25 text-rose-400"
        }`}>
          {saveStatus === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{saveMessage}</span>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#050816]/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0c102a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span>{activeItem ? "Editar Certificado" : "Nuevo Certificado"}</span>
              </h4>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400">Título *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ej: Selenium WebDriver + Java"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-400">Institución *</label>
                  <input
                    type="text"
                    required
                    value={formInstitution}
                    onChange={(e) => setFormInstitution(e.target.value)}
                    placeholder="Ej: Udemy / SmartBear"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-400">Año *</label>
                  <input
                    type="text"
                    required
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    placeholder="Ej: 2024"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400">Archivo PDF/JPG/PNG *</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400">Ruta pública exacta *</label>
                <input
                  type="text"
                  required
                  value={formFileUrl}
                  onChange={(e) => setFormFileUrl(e.target.value)}
                  placeholder="/certificates/mi-certificado.pdf"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 text-white text-sm border border-white/10 focus:border-primary focus:outline-none"
                />
                <p className="text-xs text-slate-500">
                  La ruta debe coincidir exactamente con el archivo final dentro de public.
                </p>
              </div>

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
                      <span>{activeItem ? "Guardar Cambios" : "Crear Certificado"}</span>
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
