import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  GraduationCap,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Users,
  Search,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  CreditCard,
  Mail,
  Phone,
  Hash,
  Building2,
  MapPin,
  Clock,
  Save,
  AlertCircle,
  Play,
  Video,
  KeyRound,
  X
} from 'lucide-react';
import {
  SENA_LOGO_SVG,
  SENA_WELCOME_IMG,
  SENA_GENERAL_INFO
} from '../data/senaData';
import { ApprenticeProgress } from '../types/induction';

interface LandingPageProps {
  apprentices: ApprenticeProgress[];
  selectedApprenticeId: string;
  onSaveApprenticeAndEnter: (apprentice: ApprenticeProgress) => void;
  onEnterAsInstructor: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenManual?: () => void;
}

const PROGRAM_PRESETS = [
  'Tecnología en Análisis y Desarrollo de Software (ADSO)',
  'Tecnología en Gestión de Redes de Datos',
  'Técnico en Animación Digital 3D',
  'Tecnología en Gestión Empresarial',
  'Técnico en Sistemas y Computación',
  'Tecnología en Mantenimiento Mecatrónico Industrial',
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

export const LandingPage: React.FC<LandingPageProps> = ({
  apprentices,
  selectedApprenticeId,
  onSaveApprenticeAndEnter,
  onEnterAsInstructor,
  isDark,
  onToggleTheme,
  onOpenManual
}) => {
  // Step flow: 'roles' -> 'apprentice_profile'
  const [step, setStep] = useState<'roles' | 'apprentice_profile'>('roles');
  const [mode, setMode] = useState<'create_new' | 'select_existing'>('create_new');

  // Instructor Login Modal State
  const [showInstructorLogin, setShowInstructorLogin] = useState(false);
  const [instructorUser, setInstructorUser] = useState('');
  const [instructorPass, setInstructorPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleInstructorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (instructorUser.trim() === 'instructor_sena' && instructorPass === 'SENA2026_Login') {
      setLoginError('');
      setShowInstructorLogin(false);
      onEnterAsInstructor();
    } else {
      setLoginError('Credenciales incorrectas. Verifica el usuario y la contraseña.');
    }
  };

  const handleFillDemoInstructor = () => {
    setInstructorUser('instructor_sena');
    setInstructorPass('SENA2026_Login');
    setLoginError('');
  };

  // Selected or active apprentice
  const initialApprentice = apprentices.find(a => a.id === selectedApprenticeId) || apprentices[0];

  const [existingApprenticeId, setExistingApprenticeId] = useState<string>(initialApprentice?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    documentType: 'CC',
    documentNumber: '',
    email: '',
    phone: '',
    programName: 'Tecnología en Análisis y Desarrollo de Software (ADSO)',
    ficha: '2824910',
    sede: 'Centro de Tecnologías de Información y Comunicaciones (CTIC)',
    regional: 'Regional Distrito Capital',
    jornada: 'Diurna'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when an existing apprentice is loaded
  const handleSelectExistingApprentice = (app: ApprenticeProgress) => {
    setExistingApprenticeId(app.id);
    setFormData({
      name: app.name,
      documentType: app.documentType || 'CC',
      documentNumber: app.documentNumber,
      email: app.email,
      phone: app.phone || '',
      programName: app.programName,
      ficha: app.ficha,
      sede: app.sede,
      regional: app.regional || 'Regional Distrito Capital',
      jornada: app.jornada || 'Diurna'
    });
    setShowDropdown(false);
    setErrorMsg('');
  };

  // Filtered apprentices for the existing search
  const filteredApprentices = apprentices.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.documentNumber.includes(searchTerm)
  );

  const selectedExisting = apprentices.find(a => a.id === existingApprenticeId) || apprentices[0];

  // Handler when clicking "Rol Aprendiz"
  const handleChooseApprenticeRole = () => {
    setStep('apprentice_profile');
    if (!formData.name && initialApprentice) {
      setFormData({
        name: '',
        documentType: 'CC',
        documentNumber: '',
        email: '',
        phone: '',
        programName: 'Tecnología en Análisis y Desarrollo de Software (ADSO)',
        ficha: '2824910',
        sede: 'Centro de Tecnologías de Información y Comunicaciones (CTIC)',
        regional: 'Regional Distrito Capital',
        jornada: 'Diurna'
      });
      setMode('create_new');
    }
  };

  // Handler for form submission: "Guardar perfil y continuar a la app"
  const handleSaveAndContinue = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMsg('Por favor ingresa los nombres y apellidos completos del aprendiz.');
      return;
    }
    if (!formData.documentNumber.trim()) {
      setErrorMsg('Por favor ingresa el número de documento de identidad.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg('Por favor ingresa el correo electrónico para el seguimiento institucional.');
      return;
    }
    if (!formData.ficha.trim()) {
      setErrorMsg('Por favor indica el número de ficha de caracterización.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const existingIndex = apprentices.findIndex(
      a => a.documentNumber === formData.documentNumber.trim() || (mode === 'select_existing' && a.id === existingApprenticeId)
    );

    let apprenticeToSave: ApprenticeProgress;

    if (existingIndex >= 0) {
      const found = apprentices[existingIndex];
      apprenticeToSave = {
        ...found,
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
    } else {
      const newId = `app_${Date.now()}`;
      apprenticeToSave = {
        id: newId,
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
        overallProgress: 0,
        moduleStatus: {
          identidad: 'pending',
          normativa: 'pending',
          etapas: 'pending',
          bienestar: 'pending'
        },
        quizScores: {
          identidad: null,
          normativa: null,
          etapas: null,
          bienestar: null
        },
        completedCases: [],
        badgesEarned: [],
        lastActive: 'Recién registrado',
        attendanceStatus: 'presente'
      };
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onSaveApprenticeAndEnter(apprenticeToSave);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col justify-between selection:bg-[#39A900] selection:text-white">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <img
              src={SENA_LOGO_SVG}
              alt="Logo SENA"
              className="w-9 h-9 object-contain shrink-0"
            />
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-neutral-900 dark:text-neutral-100 block leading-none">
                SENA Inducción Digital
              </span>
              <span className="text-[11px] text-neutral-500 font-medium">
                Servicio Nacional de Aprendizaje · Colombia
              </span>
            </div>
          </div>

          {/* Quick Actions (Video Manual, Ficha, Theme toggle) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenManual && (
              <button
                onClick={onOpenManual}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-[#39A900]/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-semibold text-[#39A900] transition-colors cursor-pointer"
                title="Ver video del manual de usuario de la plataforma"
              >
                <Play className="w-3.5 h-3.5 fill-[#39A900]" />
                <span className="hidden sm:inline">Ver Video Manual</span>
                <span className="sm:hidden">Video</span>
              </button>
            )}

            <span className="text-xs text-neutral-500 hidden md:inline font-mono">
              Ficha 2824910 · ADSO
            </span>

            <button
              onClick={onToggleTheme}
              className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-all shadow-xs cursor-pointer"
              title={isDark ? "Cambiar a modo claro" : "Activar modo oscuro"}
              aria-label="Alternar modo oscuro"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
        {/* STEP 1: ROLE SELECTION */}
        {step === 'roles' && (
          <div className="space-y-14">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#39A900] uppercase tracking-wider">
                  <span>Formación Profesional Integral</span>
                  <span aria-hidden="true">·</span>
                  <span>Inducción Institucional 2026</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.15]">
                  Bienvenido al proceso de inducción del <span className="text-[#39A900]">SENA</span>
                </h1>

                <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
                  Aprende la identidad y normativa institucional, el Reglamento del Aprendiz y las etapas formativas con seguimiento pedagógico en tiempo real.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {onOpenManual && (
                    <button
                      type="button"
                      onClick={onOpenManual}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-white text-white dark:text-neutral-900 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current text-[#39A900]" />
                      <span>Ver Video Tutorial del Manual</span>
                    </button>
                  )}
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-neutral-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#39A900]" />
                    <span>40 Horas de Inducción</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#39A900]" />
                    <span>Reglamento Acuerdo 007</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#39A900]" />
                    <span>Constancia Oficial con QR</span>
                  </div>
                </div>
              </div>

              {/* Hero Visual Card */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl bg-neutral-900 min-h-[280px] flex flex-col justify-end p-6">
                <img
                  src={SENA_WELCOME_IMG}
                  alt="Aprendices SENA en bienvenida institucional"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                <div className="relative z-10 text-white space-y-1">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#39A900]">
                    {SENA_GENERAL_INFO.motto}
                  </span>
                  <p className="text-sm font-medium text-neutral-200">
                    Transformando vidas a través de la educación técnica y tecnológica desde 1957.
                  </p>
                </div>
              </div>
            </div>

            {/* Role Selection Section */}
            <section className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
                  Paso 1 de 2
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100">
                  Selecciona tu rol para ingresar
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500">
                  Elige tu rol para iniciar tu proceso formativo como aprendiz o acceder a la consola docente como instructor líder.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* ROL 1: APRENDIZ */}
                <div
                  onClick={handleChooseApprenticeRole}
                  className="bg-white dark:bg-neutral-900 rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-[#39A900] dark:hover:border-[#39A900] p-6 sm:p-8 flex flex-col justify-between transition-all shadow-sm hover:shadow-md group cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#39A900] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900] bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
                        Rol Aprendiz
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-[#39A900] transition-colors">
                        Soy Aprendiz SENA
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                        Ingresa para completar tu perfil de identificación, realizar los módulos interactivos de inducción, resolver casos disciplinarios y certificar tu aprendizaje.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800 text-xs space-y-2">
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                        <span>Registro de perfil y seguimiento personalizado</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                        <span>4 Módulos con evaluaciones y cuestionarios dinámicos</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                        <span>Constancia de inducción oficial generada a tu nombre</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChooseApprenticeRole();
                      }}
                      className="w-full py-3 px-4 bg-[#39A900] hover:bg-[#329600] text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continuar como Aprendiz</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* ROL 2: INSTRUCTOR LÍDER */}
                <div
                  onClick={() => setShowInstructorLogin(true)}
                  className="bg-white dark:bg-neutral-900 rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100 p-6 sm:p-8 flex flex-col justify-between transition-all shadow-sm hover:shadow-md group cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <ShieldCheck className="w-6 h-6 text-[#39A900]" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full">
                        Instructor Único
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-[#39A900] transition-colors">
                        Soy el Instructor Líder
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                        Consola única de supervisión y gestión docente para monitorear el avance de los aprendices, registrar novedades académicas y certificar la cohorte.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-850 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <strong className="text-neutral-900 dark:text-neutral-100">
                          Ing. Carlos Mario Restrepo
                        </strong>
                        <span className="text-[10px] text-[#39A900] font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                          Docente Encargado
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-mono">
                        Instructor Líder de Inducción · Ficha 2824910 (ADSO)
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800 text-xs space-y-2">
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                        <span>Monitoreo de {apprentices.length} aprendices en tiempo real</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                        <KeyRound className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
                        <span>Acceso protegido con usuario y contraseña</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInstructorLogin(true);
                      }}
                      className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Ingresar con Credenciales</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* STEP 2: APPRENTICE PROFILE DATA & REGISTRATION */}
        {step === 'apprentice_profile' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            {/* Top Back Navigation & Indicator */}
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <button
                type="button"
                onClick={() => setStep('roles')}
                className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a Selección de Roles</span>
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-[#39A900]">Paso 2 de 2</span>
                <span className="text-neutral-400">·</span>
                <span className="text-neutral-500">Identificación del Aprendiz</span>
              </div>
            </div>

            {/* Profile Header Title */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-[#39A900] border border-emerald-200/50 dark:border-emerald-800/40">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Registro y Caracterización de Aprendiz</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100">
                Diligencia tus datos para iniciar tu proceso
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Estos datos son requeridos para identificar tu perfil institucional, realizar el seguimiento de tu progreso en los módulos y emitir tu constancia oficial de inducción.
              </p>
            </div>

            {/* Mode Selector Tabs: New vs Existing */}
            <div className="grid grid-cols-2 p-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('create_new');
                  setFormData({
                    name: '',
                    documentType: 'CC',
                    documentNumber: '',
                    email: '',
                    phone: '',
                    programName: 'Tecnología en Análisis y Desarrollo de Software (ADSO)',
                    ficha: '2824910',
                    sede: 'Centro de Tecnologías de Información y Comunicaciones (CTIC)',
                    regional: 'Regional Distrito Capital',
                    jornada: 'Diurna'
                  });
                  setErrorMsg('');
                }}
                className={`py-2 px-4 rounded-lg transition-all cursor-pointer ${
                  mode === 'create_new'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                1. Nuevo Aprendiz (Registrar Perfil)
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('select_existing');
                  if (initialApprentice) {
                    handleSelectExistingApprentice(initialApprentice);
                  }
                  setErrorMsg('');
                }}
                className={`py-2 px-4 rounded-lg transition-all cursor-pointer ${
                  mode === 'select_existing'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                2. Aprendiz Existente (Cargar mi Progreso)
              </button>
            </div>

            {/* Existing Apprentice Quick Search / Selector Box (Only in existing mode) */}
            {mode === 'select_existing' && (
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Selecciona tu perfil de aprendiz de la cohorte:
                  </label>
                  <span className="text-[11px] font-mono text-[#39A900]">
                    Avance guardado: {selectedExisting?.overallProgress || 0}%
                  </span>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full p-3 text-left rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="truncate pr-2">
                      <strong className="block text-neutral-900 dark:text-neutral-100">
                        {formData.name || selectedExisting.name}
                      </strong>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        Documento: {formData.documentNumber || selectedExisting.documentNumber} · Ficha: {formData.ficha || selectedExisting.ficha}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  </button>

                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-xl z-50 p-2 space-y-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Buscar por nombre o número de documento..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:border-[#39A900]"
                        />
                      </div>

                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {filteredApprentices.map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => handleSelectExistingApprentice(app)}
                            className={`w-full text-left p-2 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                              app.id === existingApprenticeId
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#39A900] font-semibold'
                                : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                            }`}
                          >
                            <div className="truncate">
                              <span>{app.name}</span>
                              <span className="block text-[10px] text-neutral-400 font-mono">
                                {app.documentNumber} · {app.programName}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono shrink-0 ml-2">
                              {app.overallProgress}%
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* The Main Identification Form */}
            <form onSubmit={handleSaveAndContinue} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  <User className="w-4 h-4 text-[#39A900]" />
                  <span>Datos de Interés Requeridos del Aprendiz</span>
                </div>
                <span className="text-[11px] text-neutral-400">
                  * Campos obligatorios
                </span>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombres y Apellidos */}
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
                      placeholder="Ej: Daniel Alejandro Moreno Rojas"
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                    />
                  </div>
                </div>

                {/* Tipo de Documento */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Tipo de Documento *
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={e => setFormData({ ...formData, documentType: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                  >
                    <option value="CC">Cédula de Ciudadanía (C.C.)</option>
                    <option value="TI">Tarjeta de Identidad (T.I.)</option>
                    <option value="CE">Cédula de Extranjería (C.E.)</option>
                    <option value="PPT">Permiso por Protección Temporal (PPT)</option>
                  </select>
                </div>

                {/* Número de Documento */}
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
                      placeholder="Ej: 1019283746"
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900] font-mono"
                    />
                  </div>
                </div>

                {/* Correo Electrónico */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Correo Electrónico (@misena o personal) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="aprendiz@misena.edu.co"
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Teléfono / WhatsApp de Contacto
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="310 987 6543"
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                    />
                  </div>
                </div>

                {/* Número de Ficha */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Número de Ficha de Caracterización *
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.ficha}
                      onChange={e => setFormData({ ...formData, ficha: e.target.value })}
                      placeholder="2824910"
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900] font-mono"
                    />
                  </div>
                </div>

                {/* Jornada */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Jornada de Formación
                  </label>
                  <select
                    value={formData.jornada}
                    onChange={e => setFormData({ ...formData, jornada: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                  >
                    <option value="Diurna">Diurna (6:00 a.m. - 1:00 p.m.)</option>
                    <option value="Nocturna">Nocturna (6:00 p.m. - 10:00 p.m.)</option>
                    <option value="Mixta">Mixta / Fines de Semana</option>
                    <option value="Virtual">Virtual / A Distancia</option>
                  </select>
                </div>

                {/* Programa de Formación */}
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
                      className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                    >
                      {PROGRAM_PRESETS.map((p, idx) => (
                        <option key={idx} value={p}>{p}</option>
                      ))}
                      <option value="custom">Otro programa (personalizado)...</option>
                    </select>

                    <input
                      type="text"
                      required
                      value={formData.programName}
                      onChange={e => setFormData({ ...formData, programName: e.target.value })}
                      placeholder="Escribe el nombre del programa de formación"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-850 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                    />
                  </div>
                </div>

                {/* Regional & Centro */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Regional SENA
                  </label>
                  <select
                    value={formData.regional}
                    onChange={e => setFormData({ ...formData, regional: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
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
                    placeholder="Centro de Tecnologías de Información CTIC"
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                  />
                </div>
              </div>

              {/* Action Buttons: Save profile & continue to app */}
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep('roles')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#39A900] hover:bg-[#329600] active:scale-[0.99] text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'Guardando perfil...' : 'Guardar Perfil y Continuar a la Inducción'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4 Pillars Summary always accessible on Landing */}
        <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-10 space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
              Estructura Pedagógica
            </span>
            <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
              Los 4 Pilares de la Inducción SENA
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Diseñados para garantizar una integración exitosa a la comunidad educativa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 space-y-2">
              <span className="text-xs font-mono font-bold text-[#39A900]">01</span>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Identidad Institucional
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Historia desde 1957 con Rodolfo Martínez Tono, misión, principios, escudo, bandera, himno y logo-símbolo.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 space-y-2">
              <span className="text-xs font-mono font-bold text-[#39A900]">02</span>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Normativa & Convivencia
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Reglamento del Aprendiz (Acuerdo 007), derechos, deberes, prohibiciones, medidas formativas y comités.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 space-y-2">
              <span className="text-xs font-mono font-bold text-[#39A900]">03</span>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Formación & Etapa Práctica
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Etapa lectiva, competencias, plataformas y las 6 alternativas de etapa productiva (contrato, proyecto, pasantía).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 space-y-2">
              <span className="text-xs font-mono font-bold text-[#39A900]">04</span>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Bienestar & Liderazgo
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Salud física y mental, apoyos socioeconómicos (FIC/Regular), torneos deportivos, arte y representación estudiantil.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL: INSTRUCTOR LOGIN */}
      {showInstructorLogin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 w-full max-w-md space-y-6 shadow-2xl relative">
            <button
              onClick={() => {
                setShowInstructorLogin(false);
                setLoginError('');
              }}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#39A900] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-neutral-900 dark:text-neutral-100">
                  Acceso al Portal Docente
                </h3>
                <p className="text-xs text-neutral-500">
                  Instructor Líder de Inducción · Cohorte 2026
                </p>
              </div>
            </div>

            {/* Test Credentials Helper Card */}
            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Credenciales de Acceso:
                </span>
                <button
                  type="button"
                  onClick={handleFillDemoInstructor}
                  className="text-[11px] font-semibold text-[#39A900] hover:underline cursor-pointer"
                >
                  Autocompletar datos
                </button>
              </div>
              <div className="font-mono text-[11px] space-y-0.5 text-neutral-600 dark:text-neutral-400">
                <div>Usuario: <strong className="text-neutral-900 dark:text-neutral-100">instructor_sena</strong></div>
                <div>Contraseña: <strong className="text-neutral-900 dark:text-neutral-100">SENA2026_Login</strong></div>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleInstructorLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Usuario Institucional
                </label>
                <input
                  type="text"
                  required
                  placeholder="instructor_sena"
                  value={instructorUser}
                  onChange={e => setInstructorUser(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={instructorPass}
                  onChange={e => setInstructorPass(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowInstructorLogin(false);
                    setLoginError('');
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-[#39A900] hover:bg-[#329600] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Ingresar al Panel Docente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-8 px-4 sm:px-6 lg:px-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={SENA_LOGO_SVG}
              alt="Logo SENA"
              className="w-6 h-6 object-contain"
            />
            <span>
              Servicio Nacional de Aprendizaje — SENA · República de Colombia
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span>Ficha 2824910</span>
            <span aria-hidden="true">·</span>
            <span>Reglamento del Aprendiz (Acuerdo 007 de 2012)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
