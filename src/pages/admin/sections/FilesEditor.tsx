import React from "react";
import { Edit2, FileText, Image, RefreshCcw, Upload } from "lucide-react";
import { CertificatesManager } from "./CertificatesManager";
import { certificacionesMock } from "../../../data/certificacionesMock";

interface FilesEditorProps {
  onSaveComplete: (msg: string) => void;
}

const staticFiles = [
  {
    id: "profile",
    title: "Foto de Perfil",
    description: "Imagen principal utilizada en la landing page.",
    path: "/profile.jpg",
    icon: <Image className="w-5 h-5" />
  },
  {
    id: "cv-es",
    title: "CV Español",
    description: "Currículum descargable para visitantes en español.",
    path: "/recursos/cv_odabel_es.pdf",
    icon: <FileText className="w-5 h-5" />
  },
  {
    id: "cv-en",
    title: "CV Inglés",
    description: "Currículum descargable para visitantes en inglés.",
    path: "/recursos/cv_odabel_en.pdf",
    icon: <FileText className="w-5 h-5" />
  }
];

export const FilesEditor: React.FC<FilesEditorProps> = ({ onSaveComplete }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-extrabold text-white mb-2 flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          <span>Archivos Multimedia</span>
        </h2>
        <p className="text-sm text-slate-500">
          Mantén separados los archivos estáticos principales y la gestión dinámica de certificados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staticFiles.map((file) => (
          <div key={file.id} className="glass-panel rounded-2xl border border-white/5 p-5">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              {file.icon}
            </div>
            <h3 className="text-sm font-bold text-white mb-1">{file.title}</h3>
            <p className="text-xs text-slate-500 mb-3 min-h-[32px]">{file.description}</p>
            <code className="block px-3 py-2 rounded-lg bg-slate-950/70 border border-white/5 text-xs text-slate-400 break-all">
              {file.path}
            </code>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 p-5">
        <div className="mb-4">
          <h3 className="text-base font-bold text-white">Gestión de Certificaciones (Mock)</h3>
          <p className="text-xs text-slate-500">
            Vista previa estática de los certificados antes de activar persistencia backend.
          </p>
        </div>

        <div className="space-y-3">
          {certificacionesMock.map((certificacion) => (
            <div
              key={certificacion.id}
              className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 rounded-xl border border-white/5 bg-slate-950/40 p-3"
            >
              <div className="w-full md:w-20 h-24 md:h-16 rounded-lg overflow-hidden border border-white/10 bg-slate-900/80 flex-shrink-0">
                <img
                  src={certificacion.imageUrl}
                  alt={certificacion.titulo}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{certificacion.titulo}</p>
                <p className="text-xs text-slate-400">{certificacion.plataforma}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{certificacion.imageUrl}</p>
              </div>

              <div className="flex items-center gap-2 md:justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 border border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Editar
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-primary border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-colors"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  Reemplazar Imagen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 pt-8">
        <CertificatesManager onSaveComplete={onSaveComplete} />
      </div>
    </div>
  );
};
