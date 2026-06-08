import React from "react";
import { FileText, Image, Upload } from "lucide-react";
import { CertificatesManager } from "./CertificatesManager";

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

      <div className="border-t border-white/5 pt-8">
        <CertificatesManager onSaveComplete={onSaveComplete} />
      </div>
    </div>
  );
};