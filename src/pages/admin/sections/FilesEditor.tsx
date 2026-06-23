import React, { useState, useEffect } from "react";
import { FileText, Image, Upload } from "lucide-react";
import { CertificatesManager } from "./CertificatesManager";

interface FilesEditorProps {
  onSaveComplete: (msg: string) => void;
}

interface Certificate {
  id: string;
  title: string;
  institution: string;
  year: string;
  fileUrl: string;
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
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const fetchCertificates = async () => {
    try {
      const response = await fetch("/api/certificates");
      if (response.ok) {
        const data = await response.json();
        setCertificates(data);
      }
    } catch (err) {
      console.error("Error loading certificates preview:", err);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleSaveCompleteWrapper = (msg: string) => {
    fetchCertificates();
    onSaveComplete(msg);
  };

  const isImageFile = (url: string) => {
    const norm = url.toLowerCase();
    return norm.endsWith(".png") || norm.endsWith(".jpg") || norm.endsWith(".jpeg") || norm.endsWith(".webp");
  };

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
          <h3 className="text-base font-bold text-white">Gestión de Certificaciones</h3>
          <p className="text-xs text-slate-500">
            Vista previa dinámica de los certificados persistidos en Neon PostgreSQL.
          </p>
        </div>

        <div className="space-y-3">
          {certificates.map((cert) => {
            const isImg = isImageFile(cert.fileUrl);
            return (
              <div
                key={cert.id}
                className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 rounded-xl border border-white/5 bg-slate-950/40 p-3"
              >
                <div className="w-full md:w-20 h-24 md:h-16 rounded-lg overflow-hidden border border-white/10 bg-slate-900/80 flex-shrink-0 flex items-center justify-center">
                  {isImg ? (
                    <img
                      src={cert.fileUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <FileText className="w-8 h-8 text-slate-600" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{cert.title}</p>
                  <p className="text-xs text-slate-400">{cert.institution} ({cert.year})</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{cert.fileUrl}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/5 pt-8">
        <CertificatesManager onSaveComplete={handleSaveCompleteWrapper} />
      </div>
    </div>
  );
};
