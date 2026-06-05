import React, { useState, useRef } from "react";
import { Upload, User, FileText, Award, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadBinaryFileToRepo } from "../../../services/githubApiService";

interface UploadItem {
  id: string;
  label: string;
  description: string;
  repoPath: string;
  accept: string;
  icon: React.ReactNode;
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
  },
  {
    id: "cv-en",
    label: "Curriculum Vitae (Inglés)",
    description: "Archivo PDF. Accesible en /recursos/CV_EN.pdf",
    repoPath: "public/recursos/CV_EN.pdf",
    accept: "application/pdf",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: "cert-selenium",
    label: "Certificado — Selenium + Cucumber",
    description: "PDF del certificado. Se vinculará al botón de descarga correspondiente.",
    repoPath: "public/certificates/selenium_java_cucumber.pdf",
    accept: "application/pdf",
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: "cert-testing",
    label: "Certificado — Testing Fundamentals",
    description: "PDF del certificado de fundamentos de pruebas.",
    repoPath: "public/certificates/testing_fundamentals.pdf",
    accept: "application/pdf",
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: "cert-postman",
    label: "Certificado — Postman & API Testing",
    description: "PDF del certificado de Postman / Newman.",
    repoPath: "public/certificates/postman_api.pdf",
    accept: "application/pdf",
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: "cert-jira",
    label: "Certificado — Jira & Zephyr",
    description: "PDF del certificado de gestión de pruebas.",
    repoPath: "public/certificates/jira_zephyr.pdf",
    accept: "application/pdf",
    icon: <Award className="w-5 h-5" />,
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
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = (id: string, file: File | null) => {
    setSelectedFiles((prev) => ({ ...prev, [id]: file }));
    setUploadStatuses((prev) => ({ ...prev, [id]: { status: "idle", message: "" } }));
  };

  const handleUpload = async (target: UploadItem) => {
    const file = selectedFiles[target.id];
    if (!file) return;

    setUploadStatuses((prev) => ({
      ...prev,
      [target.id]: { status: "uploading", message: `Subiendo ${file.name}…` },
    }));

    try {
      await uploadBinaryFileToRepo(
        target.repoPath,
        file,
        `[Backoffice] Upload ${target.label} — ${file.name}`
      );

      setUploadStatuses((prev) => ({
        ...prev,
        [target.id]: { status: "success", message: `✓ ${file.name} subido correctamente.` },
      }));
      setSelectedFiles((prev) => ({ ...prev, [target.id]: null }));
      // Reset file input visually
      const inputEl = inputRefs.current[target.id];
      if (inputEl) inputEl.value = "";
      onSaveComplete(`${target.label} actualizado correctamente.`);
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
          Sube nuevas versiones de tu foto de perfil, CVs y certificados. Cada archivo se actualiza de forma independiente en el repositorio GitHub y Vercel desplegará los cambios automáticamente.
        </p>

        <div className="space-y-4">
          {UPLOAD_TARGETS.map((target) => {
            const status = uploadStatuses[target.id];
            const file = selectedFiles[target.id];
            const isUploading = status.status === "uploading";

            return (
              <div
                key={target.id}
                className="glass-panel rounded-2xl border border-white/5 p-5 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 text-primary mt-0.5">
                    {target.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{target.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{target.description}</p>
                    <code className="text-xs text-slate-600 font-mono mt-1 block">{target.repoPath}</code>
                  </div>
                </div>

                {/* File Input + Upload Button */}
                <div className="flex items-center gap-3">
                  <label
                    htmlFor={`file-${target.id}`}
                    className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/10 hover:border-primary/40 bg-slate-950/40 text-slate-400 hover:text-primary text-sm cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">
                      {file ? file.name : "Seleccionar archivo…"}
                    </span>
                  </label>
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
                    disabled={!file || isUploading}
                    onClick={() => handleUpload(target)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent disabled:from-slate-700 disabled:to-slate-700 text-white text-sm font-semibold transition-all duration-300 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Subiendo…</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir</span>
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
