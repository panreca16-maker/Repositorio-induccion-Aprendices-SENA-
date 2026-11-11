import React, { useState } from 'react';
import {
  X,
  User,
  CreditCard,
  Mail,
  Phone,
  BookOpen,
  Hash,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  Award,
  Save,
  AlertCircle
} from 'lucide-react';
import { ApprenticeProgress } from '../types/induction';
import { SENA_LOGO_SVG } from '../data/senaData';

interface ApprenticeProfileModalProps {
  apprentice: ApprenticeProgress;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedApprentice: ApprenticeProgress) => void;
}

const PROGRAM_PRESETS = [
  'Tecnología en Análisis y Desarrollo de Software (ADSO)',
  'Tecnología en Gestión de Redes de Datos',
  'Técnico en Animación Digital 3D',
  'Tecnología en Gestión Empresarial',
  'Técnico en Sistemas y Computación',
  'Tecnología en Mantenimiento Mecatrónico',
  'Tecnología en Control y Automatización',
  'Técnico en Contabilización de Operaciones Comerciales'
];

const REGIONAL_PRESETS = [
  'Regional Distrito Capital',
  'Regional Antioquia',
  'Regional Valle del Cauca',
  'Regional Santander',
  'Regional Atlántico',
  'Regional Bolívar',
  'Regional Cundinamarca',
  'Regional Caldas',
  'Regional Risaralda'
];

export const ApprenticeProfileModal: React.FC<ApprenticeProfileModalProps> = ({
  apprentice,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: apprentice.name || '',
    documentType: apprentice.documentType || 'CC',
    documentNumber: apprentice.documentNumber || '',
    email: apprentice.email || '',
    phone: apprentice.phone || '',
    programName: apprentice.programName || 'Tecnología en Análisis y Desarrollo de Software (ADSO)',
    ficha: apprentice.ficha || '2824910',
    sede: apprentice.sede || 'Centro de Tecnologías de Información y Comunicaciones (CTIC)',
    regional: apprentice.regional || 'Regional Distrito Capital',
    jornada: apprentice.jornada || 'Diurna'
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('Por favor ingresa los nombres y apellidos completos.');
      return;
    }
    if (!formData.documentNumber.trim()) {
      setErrorMessage('Por favor ingresa el número de documento de identidad.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Por favor ingresa un correo electrónico.');
      return;
    }
    if (!formData.ficha.trim()) {
      setErrorMessage('Por favor especifica el número de ficha de caracterización.');
      return;
    }

    setErrorMessage('');
    const updated: ApprenticeProgress = {
      ...apprentice,
      name: formData.name.trim(),
      documentType: formData.documentType,
      documentNumber: formData.documentNumber.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      programName: formData.programName.trim(),
      ficha: formData.ficha.trim(),
      sede: formData.sede.trim(),
      regional: formData.regional.trim(),
      jornada: formData.jornada,
      lastActive: 'Hace un momento'
    };

    onSave(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-2xl w-full my-8 overflow-hidden transition-all">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-850">
          <div className="flex items-center gap-3">
            <img
              src={SENA_LOGO_SVG}
              alt="Logo SENA"
              className="w-7 h-7 object-contain"
            />
            <div>
              <h2 className="text-base font-display font-bold text-neutral-900 dark:text-neutral-100">
                Perfil del Aprendiz SENA
              </h2>
              <p className="text-xs text-neutral-500">
                Datos de identificación y seguimiento curricular
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Progress summary card */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#39A900]">
                Trazabilidad del Proceso
              </span>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Avance General: {apprentice.overallProgress}%
              </h4>
              <p className="text-xs text-neutral-500">
                {apprentice.overallProgress === 100
                  ? '¡Inducción completada! Constancia oficial disponible.'
                  : 'En curso · 4 Módulos de inducción y reglamento institucional.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300">
                  {Object.values(apprentice.moduleStatus).filter(s => s === 'completed').length} / 4 Módulos
                </span>
                <span className="block text-[11px] text-neutral-400">Completados</span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-[#39A900] flex items-center justify-center font-bold text-xs text-[#39A900]">
                {apprentice.overallProgress}%
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-[#39A900] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>¡Perfil del aprendiz guardado exitosamente!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Nombres y Apellidos Completos *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Laura Camila Torres Mora"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                />
              </div>
            </div>

            {/* Document Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Tipo de Documento *
              </label>
              <select
                value={formData.documentType}
                onChange={e => setFormData({ ...formData, documentType: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
              >
                <option value="CC">Cédula de Ciudadanía (C.C.)</option>
                <option value="TI">Tarjeta de Identidad (T.I.)</option>
                <option value="CE">Cédula de Extranjería (C.E.)</option>
                <option value="PPT">Permiso por Protección Temporal (PPT)</option>
              </select>
            </div>

            {/* Document Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Número de Documento *
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.documentNumber}
                  onChange={e => setFormData({ ...formData, documentNumber: e.target.value })}
                  placeholder="Ej: 1024567890"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900] font-mono"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Correo Electrónico *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="correo@misena.edu.co"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Teléfono / Celular
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="310 123 4567"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                />
              </div>
            </div>

            {/* Ficha Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Número de Ficha *
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.ficha}
                  onChange={e => setFormData({ ...formData, ficha: e.target.value })}
                  placeholder="2824910"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900] font-mono"
                />
              </div>
            </div>

            {/* Jornada */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Jornada
              </label>
              <select
                value={formData.jornada}
                onChange={e => setFormData({ ...formData, jornada: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
              >
                <option value="Diurna">Diurna (6:00 a.m. - 1:00 p.m.)</option>
                <option value="Nocturna">Nocturna (6:00 p.m. - 10:00 p.m.)</option>
                <option value="Mixta">Mixta / Fines de Semana</option>
                <option value="Virtual">Virtual / A Distancia</option>
              </select>
            </div>

            {/* Training Program */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Programa de Formación *
              </label>
              <div className="space-y-2">
                <select
                  value={PROGRAM_PRESETS.includes(formData.programName) ? formData.programName : 'custom'}
                  onChange={e => {
                    if (e.target.value !== 'custom') {
                      setFormData({ ...formData, programName: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                >
                  {PROGRAM_PRESETS.map((p, idx) => (
                    <option key={idx} value={p}>{p}</option>
                  ))}
                  <option value="custom">Otro programa (escribir a continuación)...</option>
                </select>
                <input
                  type="text"
                  required
                  value={formData.programName}
                  onChange={e => setFormData({ ...formData, programName: e.target.value })}
                  placeholder="Nombre exacto del programa de formación"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-850 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                />
              </div>
            </div>

            {/* Regional & Training Center */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Regional SENA
              </label>
              <select
                value={formData.regional}
                onChange={e => setFormData({ ...formData, regional: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
              >
                {REGIONAL_PRESETS.map((r, idx) => (
                  <option key={idx} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Centro de Formación / Sede
              </label>
              <input
                type="text"
                value={formData.sede}
                onChange={e => setFormData({ ...formData, sede: e.target.value })}
                placeholder="Ej: Centro de Tecnologías CTIC"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
              />
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#39A900] hover:bg-[#329600] transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Perfil del Aprendiz</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
