import React, { useState, useRef } from "react";
import { Upload, User, FileText, Award, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadBinaryFileToRepo, updateTextFileInRepo } from "../../../services/githubApiService";
import backofficeTexts from "../../../data/backoffice_texts.json";

interface UploadItem {
  id: string;
  label: string;
  description: string;
  repoPath: string;
  accept: string;
  icon: React.ReactNode;
  i18nKey?: string;
}

const UPLOAD_TARGETS: UploadItem[] = [
  {
    id: "profile-photo",
    label: "Foto de Perfil",
    description: "JPG/PNG — Se mostrará en la sección Hero. Recomendado: 800×800px mínimo.",
    repoPath: "public/recursos/foto-perfil.jpg",
    accept: "image/jpeg,image/png,image/webp",
    icon: <User className="w-5 h-5" />,
  },
  {
    id: "cv-es",
    label: "Curriculum Vitae (Español)",
    description: "Archivo PDF. Accesible en /recursos/CV_ES.pdf",
    repoPath: "public/recursos/CV_ES.pdf",
    accept: "application/pdf",
    icon: <FileText className="w-5 h-5" />,
    i18nKey: "cv_es",
  },
  {
    id: "cv-en",
    label: "Curriculum Vitae (Inglés)",
    description: "Archivo PDF. Accesible en /recursos/CV_EN.pdf",
    repoPath: "public/recursos/CV_EN.pdf",
    accept: "application/pdf",
    icon: <FileText className="w-5 h-5" />,
    i18nKey: "cv_en",
  },
  {
    id: "cert-selenium",
    label: "Certificado — Selenium + Cucumber",
    description: "PDF del certificado. Se vinculará al botón de descarga correspondiente.",
    repoPath: "public/certificates/selenium_java_cucumber.pdf",
    accept: "application/pdf",
    icon: <Award className="w-5 h-5" />,
    i18nKey: "selenium_java_cucumber",
  },
  {
    id: "cert-testing",
    label: "Certificado — Testing Fundamentals",
    description: "PDF del certificado de fundamentos de pruebas.",
    repoPath: "public/certificates/testing_fundamentals.pdf",
    accept: "application/pdf",
    icon: <Award className="w-5 h-5" />,
    i18nKey: "testing_fundamentals",
  },
  {
    id: "cert-postman",
    label: "Certificado — Postman & API Testing",
    description: "PDF del certificado de Postman / Newman.",
    repoPath: "public/certificates/postman_api.pdf",
    accept: "application/pdf",
    icon: <Award className="w-5 h-5" />,
    i18nKey: "postman_api",
  },
  {
    id: "cert-jira",
    label: "Certificado — Jira & Zephyr",
    description: "PDF del certificado de gestión de pruebas.",
    repoPath: "public/certificates/jira_zephyr.pdf",
    accept: "application/pdf",
    icon: <Award className="w-5 h-5" />,
    i18nKey: "jira_zephyr",
  },
];

interface UploadStatus {
  status: "idle" | "uploading" | "success" | "error";
  message: string;
}

export const FilesEditor: React.FC<{ onSaveComplete: (msg: string) => void }> = ({ onSaveComplete }) => {
  const [uploadStatuses, setUploadStatuses] = useState<Record<string, UploadStatus>>(
    Object.fromEntries(UPLOAD_TARGETS.map((t) => [t.id, { status: "idle", message: "" }]))
  );
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>(
    Object.fromEntries(UPLOAD_TARGETS.map((t) => [t.id, null]))
  );
  
  // Track drag states
  const [dragOverTargets, setDragOverTargets] = useState<Record<string, boolean>>({});

  // Editable titles state loaded from backoffice_texts.json
  const [editedTitles, setEditedTitles] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    UPLOAD_TARGETS.forEach((t) => {
      if (t.i18nKey) {
        if (t.id.startsWith("cert-")) {
          initial[t.id] = (backofficeTexts as any).certifications?.[t.i18nKey]?.name || t.label;
        } else if (t.id.startsWith("cv-")) {
          initial[t.id] = (backofficeTexts as any).nav?.[t.i18nKey] || t.label;
        }
      } else {
        initial[t.id] = t.label;
      }
    });
    return initial;
  });

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = (id: string, file: File | null) => {
    setSelectedFiles((prev) => ({ ...prev, [id]: file }));
    setUploadStatuses((prev) => ({ ...prev, [id]: { status: "idle", message: "" } }));
  };

  const handleTitleChange = (id: string, val: string) => {
    setEditedTitles((prev) => ({ ...prev, [id]: val }));
  };

  // Drag and drop handler events
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverTargets((prev) => ({ ...prev, [id]: true }));
  };

  const handleDragLeave = (id: string) => {
    setDragOverTargets((prev) => ({ ...prev, [id]: false }));
  };

  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverTargets((prev) => ({ ...prev, [id]: false }));
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(id, file);
    }
  };

  const handleUpload = async (target: UploadItem) => {
    const file = selectedFiles[target.id];
    const isCert = target.id.startsWith("cert-");
    const isCv = target.id.startsWith("cv-");

    setUploadStatuses((prev) => ({
      ...prev,
      [target.id]: { status: "uploading", message: "Guardando cambios y subiendo..." },
    }));

    const TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;
    const isDummyToken = !TOKEN || TOKEN === "ghp_TuTokenDeGitHubDeFirmeEscritura" || TOKEN.startsWith("ghp_TuToken");

    try {
      // 1. Upload file if selected
      if (file) {
        if (isDummyToken) {
          await new Promise((resolve) => setTimeout(resolve, 1200));
        } else {
          await uploadBinaryFileToRepo(
            target.repoPath,
            file,
            `[Backoffice] Upload ${editedTitles[target.id] || target.label} — ${file.name}`
          );
        }
      }

      // 2. Persist dynamic titles and files in backoffice_texts.json
      const updatedTexts = JSON.parse(JSON.stringify(backofficeTexts));
      
      if (file) {
        if (!updatedTexts.uploadedFiles) {
          updatedTexts.uploadedFiles = {};
        }
        updatedTexts.uploadedFiles[target.id] = file.name;
      }

      if (target.i18nKey) {
        if (isCert) {
          if (!updatedTexts.certifications) updatedTexts.certifications = {};
          if (!updatedTexts.certifications[target.i18nKey]) {
            updatedTexts.certifications[target.i18nKey] = {};
          }
          updatedTexts.certifications[target.i18nKey].name = editedTitles[target.id];
        } else if (isCv) {
          if (!updatedTexts.nav) updatedTexts.nav = {};
          updatedTexts.nav[target.i18nKey] = editedTitles[target.id];
        }
      }

      if (isDummyToken) {
        await new Promise((resolve) => setTimeout(resolve, 800));
      } else {
        await updateTextFileInRepo(
          "src/data/backoffice_texts.json",
          JSON.stringify(updatedTexts, null, 2),
          `[Backoffice] Save metadata changes for ${target.id}`
        );
      }

      setUploadStatuses((prev) => ({
        ...prev,
        [target.id]: { status: "success", message: "✓ Cambios y metadatos guardados con éxito." },
      }));
      setSelectedFiles((prev) => ({ ...prev, [target.id]: null }));
      
      const inputEl = inputRefs.current[target.id];
      if (inputEl) inputEl.value = "";
      onSaveComplete(`${editedTitles[target.id]} guardado.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setUploadStatuses((prev) => ({
        ...prev,
        [target.id]: { status: "error", message: `Error: ${message}` },
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Gestión de Archivos Multimedia</h3>
        <p className="text-sm text-slate-500 mb-6">
          Sube nuevas versiones de tu foto de perfil, CVs y certificados, y edita sus títulos correspondientes.
        </p>

        <div className="space-y-4">
          {UPLOAD_TARGETS.map((target) => {
            const status = uploadStatuses[target.id];
            const file = selectedFiles[target.id];
            const isUploading = status.status === "uploading";
            const dragActive = dragOverTargets[target.id];

            return (
              <div
                key={target.id}
                className="glass-panel rounded-2xl border border-white/5 p-5 space-y-4 text-left"
              >
                {/* Header & Title Input */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2.5 rounded-xl bg-slate-900/60 text-primary mt-0.5 flex-shrink-0">
                      {target.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      {/* Input for Editable Title */}
                      <input
                        type="text"
                        value={editedTitles[target.id]}
                        onChange={(e) => handleTitleChange(target.id, e.target.value)}
                        className="w-full px-2 py-1 rounded bg-slate-950/40 text-white font-bold text-sm border border-transparent hover:border-white/10 focus:border-primary focus:bg-slate-950/70 focus:outline-none transition-all"
                        placeholder="Editar título..."
                      />
                      <p className="text-xs text-slate-500">{target.description}</p>
                      <code className="text-[10px] text-slate-600 font-mono block">{target.repoPath}</code>
                    </div>
                  </div>
                </div>

                {/* Native Drag & Drop Area */}
                <div className="flex items-center gap-3">
                  <div
                    onDragOver={(e) => handleDragOver(e, target.id)}
                    onDragLeave={() => handleDragLeave(target.id)}
                    onDrop={(e) => handleDrop(e, target.id)}
                    onClick={() => inputRefs.current[target.id]?.click()}
                    className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed text-sm cursor-pointer transition-colors ${
                      dragActive
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-white/10 hover:border-primary/40 bg-slate-950/40 text-slate-400 hover:text-primary"
                    }`}
                  >
                    <Upload className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">
                      {file ? file.name : "Selecciona o arrastra un archivo aquí…"}
                    </span>
                  </div>
                  
                  <input
                    id={`file-${target.id}`}
                    type="file"
                    accept={target.accept}
                    className="sr-only"
                    ref={(el) => { inputRefs.current[target.id] = el; }}
                    onChange={(e) => handleFileChange(target.id, e.target.files?.[0] ?? null)}
                  />

                  <button
                    type="button"
                    onClick={() => handleUpload(target)}
                    disabled={isUploading}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent disabled:from-slate-700 disabled:to-slate-700 text-white text-sm font-semibold transition-all duration-300 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Guardando…</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>{file ? "Subir y Guardar" : "Guardar Título"}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Status message */}
                {status.message && (
                  <div className={`flex items-center gap-2 text-xs font-medium ${
                    status.status === "success" ? "text-emerald-400" :
                    status.status === "error"   ? "text-rose-400"    :
                    "text-slate-400"
                  }`}>
                    {status.status === "success" && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                    {status.status === "error"   && <AlertCircle  className="w-3.5 h-3.5 flex-shrink-0" />}
                    <span>{status.message}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
