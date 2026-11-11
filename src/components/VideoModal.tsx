import React, { useEffect } from 'react';
import { X, Play, Video, ShieldCheck, GraduationCap, CheckCircle2 } from 'lucide-react';
import { SENA_LOGO_SVG } from '../data/senaData';

interface VideoModalProps {
  videoUrl: string;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Normalize URL: Vite serves /public/assets at /assets
  const normalizedUrl = videoUrl.startsWith('/public/')
    ? videoUrl.replace('/public', '')
    : videoUrl;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div className="bg-neutral-900 text-neutral-100 rounded-2xl border border-neutral-700 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <img
              src={SENA_LOGO_SVG}
              alt="Logo SENA"
              className="w-7 h-7 object-contain"
            />
            <div>
              <h3 id="video-modal-title" className="text-sm sm:text-base font-display font-bold text-white flex items-center gap-2">
                <span>Video Tutorial: Manual de la Plataforma SENA Digital</span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Guía interactiva de usuario para aprendices e instructores cohorte 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Cerrar video tutorial"
            title="Cerrar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative bg-black flex-1 flex items-center justify-center min-h-[260px] sm:min-h-[420px]">
          <video
            controls
            autoPlay
            playsInline
            controlsList="nodownload"
            className="w-full h-full max-h-[62vh] object-contain"
            src={normalizedUrl}
          >
            {/* Fallback source in case root path varies */}
            <source src={normalizedUrl} type="video/mp4" />
            <source src="/assets/aistudio/2026__5_17_p.m._2858c9bb.mp4" type="video/mp4" />
            <source src="/public/assets/aistudio/2026__5_17_p.m._2858c9bb.mp4" type="video/mp4" />
            Tu navegador no soporta la reproducción de video HTML5.
          </video>
        </div>

        {/* Modal Footer with quick summary & actions */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950/90 text-xs flex flex-wrap items-center justify-between gap-3 text-neutral-400">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-[#39A900]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Rol Aprendiz (Registro y 4 Módulos)</span>
            </span>
            <span className="hidden sm:inline text-neutral-600">·</span>
            <span className="hidden sm:flex items-center gap-1.5 text-neutral-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#39A900]" />
              <span>Rol Instructor (<code className="font-mono text-[#39A900]">instructor_sena</code>)</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#39A900] hover:bg-[#329600] text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Cerrar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
