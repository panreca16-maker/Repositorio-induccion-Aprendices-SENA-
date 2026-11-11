import React, { useRef } from 'react';
import { X, Printer, Download, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ApprenticeProgress } from '../types/induction';
import { SENA_LOGO_SVG } from '../data/senaData';

interface CertificateModalProps {
  apprentice: ApprenticeProgress;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  apprentice,
  onClose
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-4xl w-full my-8 overflow-hidden">
        {/* Modal Controls Bar */}
        <div className="px-6 py-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/80 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#39A900]" />
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Certificado Oficial de Inducción Institucional
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Body */}
        <div
          ref={certificateRef}
          className="p-10 md:p-14 bg-white text-neutral-900 relative border-8 border-double border-[#39A900]/30 m-4 rounded-lg shadow-inner print:m-0 print:border-4"
        >
          {/* Watermark Logo in background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
            <img
              src={SENA_LOGO_SVG}
              alt=""
              className="w-96 h-96 object-contain"
            />
          </div>

          {/* Institutional Header */}
          <div className="text-center pb-6 border-b border-neutral-200">
            <img
              src={SENA_LOGO_SVG}
              alt="Logo SENA Oficial"
              className="w-16 h-16 object-contain mx-auto mb-2 drop-shadow-xs"
            />
            <h2 className="text-xs uppercase tracking-widest text-[#39A900] font-bold">
              Servicio Nacional de Aprendizaje — SENA
            </h2>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mt-1">
              Constancia de Inducción y Formación Integral
            </h1>
            <p className="text-xs text-neutral-500 mt-1 font-mono">
              Resolución de Formación Profesional No. 007 / Sistema de Gestión de Calidad
            </p>
          </div>

          {/* Apprentice statement */}
          <div className="py-8 text-center max-w-2xl mx-auto space-y-4">
            <p className="text-sm text-neutral-600 uppercase tracking-wider">
              El Centro de Formación certifica que el(la) aprendiz:
            </p>

            <h3 className="text-2xl md:text-3xl font-display font-extrabold text-neutral-900 underline decoration-[#39A900] decoration-2 underline-offset-8">
              {apprentice.name}
            </h3>

            <p className="text-sm text-neutral-600 font-mono">
              Identificado(a) con Documento de Identidad No. <strong>{apprentice.documentNumber}</strong>
            </p>

            <p className="text-sm text-neutral-700 leading-relaxed pt-2">
              Culminó y aprobó satisfactoriamente el programa de <strong>Inducción a la Formación Profesional Integral</strong> con una intensidad de <strong>40 horas lectivas</strong>, demostrando dominio en:
            </p>

            {/* Competency tags */}
            <div className="grid grid-cols-2 gap-3 text-xs text-left pt-2 pb-4">
              <div className="p-2.5 rounded bg-neutral-50 border border-neutral-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                <span>Identidad, cultura, principios y símbolos institucionales SENA</span>
              </div>
              <div className="p-2.5 rounded bg-neutral-50 border border-neutral-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                <span>Reglamento del Aprendiz, derechos, deberes y debido proceso</span>
              </div>
              <div className="p-2.5 rounded bg-neutral-50 border border-neutral-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                <span>Etapas de formación y alternativas de etapa productiva</span>
              </div>
              <div className="p-2.5 rounded bg-neutral-50 border border-neutral-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                <span>Servicios de bienestar al aprendiz, liderazgo y participación</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded text-xs border border-neutral-200 text-neutral-600">
              Programa: <strong>{apprentice.programName}</strong> — Ficha de Caracterización: <strong className="font-mono text-neutral-900">{apprentice.ficha}</strong>
            </div>
          </div>

          {/* Signatures & Verification footer */}
          <div className="pt-8 border-t border-neutral-200 grid grid-cols-3 gap-6 items-end text-center">
            {/* Signature 1 */}
            <div className="space-y-1">
              <div className="border-b border-neutral-400 w-36 mx-auto mb-2" />
              <p className="text-xs font-semibold text-neutral-900">Coordinación Misional</p>
              <p className="text-[10px] text-neutral-500">Centro de Formación SENA</p>
            </div>

            {/* Center QR Seal */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-2 border-neutral-800 p-1 flex items-center justify-center bg-white mb-1">
                <div className="grid grid-cols-4 gap-0.5 w-full h-full">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-full h-full ${
                        (i % 2 === 0 || i === 7 || i === 13) ? 'bg-neutral-900' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-[9px] font-mono text-neutral-500">ID: SENA-IND-2824910-{apprentice.id.toUpperCase()}</span>
            </div>

            {/* Signature 2 */}
            <div className="space-y-1">
              <div className="border-b border-neutral-400 w-36 mx-auto mb-2" />
              <p className="text-xs font-semibold text-neutral-900">Equipo de Inducción</p>
              <p className="text-[10px] text-neutral-500">Expedido el {currentDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
