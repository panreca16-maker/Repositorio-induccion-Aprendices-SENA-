import React from 'react';
import {
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  BookOpen,
  Sparkles,
  Download,
  AlertCircle,
  PlayCircle,
  FileCheck
} from 'lucide-react';
import { INDUCTION_MODULES, SENA_WELCOME_IMG } from '../../data/senaData';
import { ApprenticeProgress, ModuleId } from '../../types/induction';
import { User } from 'lucide-react';

interface StudentDashboardProps {
  apprentice: ApprenticeProgress;
  onOpenModule: (moduleId: ModuleId) => void;
  onOpenQuiz: (moduleId: ModuleId) => void;
  onOpenCertificate: () => void;
  onOpenTrivia: () => void;
  onOpenProfile?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  apprentice,
  onOpenModule,
  onOpenQuiz,
  onOpenCertificate,
  onOpenTrivia,
  onOpenProfile
}) => {
  const isAllCompleted = apprentice.overallProgress === 100;

  return (
    <div className="space-y-10">
      {/* Welcome & Apprentice Credentials Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white p-6 md:p-8">
        <img
          src={SENA_WELCOME_IMG}
          alt="Aprendices SENA en inducción"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#39A900] uppercase tracking-wider">
              <span>Ruta de Inducción Institucional 2026</span>
              <span aria-hidden="true">·</span>
              <span>SENA Colombia</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
              ¡Bienvenido(a), {apprentice.name}!
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-300">
              <span>Doc: <strong className="font-mono text-white">{apprentice.documentType || 'CC'} {apprentice.documentNumber}</strong></span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>Ficha: <strong className="font-mono text-white">{apprentice.ficha}</strong></span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>{apprentice.programName}</span>
              {apprentice.jornada && (
                <>
                  <span aria-hidden="true" className="text-neutral-500">·</span>
                  <span>Jornada {apprentice.jornada}</span>
                </>
              )}
            </div>

            <p className="text-xs md:text-sm text-neutral-300 leading-relaxed max-w-2xl pt-1">
              Esta herramienta interactiva te guiará en tu proceso de inducción. Aprende la historia y símbolos institucionales, el Reglamento del Aprendiz, tus deberes y derechos, y las alternativas para certificar tu etapa productiva.
            </p>

            {onOpenProfile && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onOpenProfile}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer border border-white/10 shadow-xs"
                >
                  <User className="w-3.5 h-3.5 text-[#39A900]" />
                  <span>Ver / Editar Datos de Mi Perfil</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Progress KPI card */}
          <div className="lg:col-span-4 bg-white/10 dark:bg-black/30 backdrop-blur-md p-5 rounded-xl border border-white/15 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300">Progreso Total</span>
              <span className="font-mono font-bold text-[#39A900] text-sm tabular-nums">
                {apprentice.overallProgress}%
              </span>
            </div>

            <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#39A900] transition-all duration-700 ease-out"
                style={{ width: `${apprentice.overallProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-300 pt-1">
              <span>
                {Object.values(apprentice.moduleStatus).filter(s => s === 'completed').length} de 4 módulos aprobados
              </span>
              <span>{apprentice.badgesEarned.length} insignias</span>
            </div>

            {isAllCompleted ? (
              <button
                onClick={onOpenCertificate}
                className="w-full mt-2 py-2 px-3 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#329600] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Ver y Descargar Certificado</span>
              </button>
            ) : (
              <p className="text-[11px] text-neutral-400 text-center pt-1">
                Completa todos los módulos con $\ge 80\%$ para generar tu certificado oficial.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 4 Interactive Induction Modules Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">
              Módulos del Proceso de Inducción
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Interactúa con los contenidos dinámicos y aprueba los cuestionarios para avanzar.
            </p>
          </div>
          <button
            onClick={onOpenTrivia}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#39A900] hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Desafío Trivia Relámpago</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {INDUCTION_MODULES.map((module) => {
            const status = apprentice.moduleStatus[module.id];
            const score = apprentice.quizScores[module.id];
            const isCompleted = status === 'completed';

            return (
              <div
                key={module.id}
                className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs"
              >
                <div>
                  {/* Top Status & Duration */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="flex items-center gap-1 text-neutral-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{module.durationMinutes} min</span>
                      <span aria-hidden="true">·</span>
                      <span>{module.topicsCount} temas</span>
                    </span>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#39A900]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Aprobado ({score}%)</span>
                      </span>
                    ) : status === 'in_progress' ? (
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                        En curso
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400">
                        Pendiente
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-display font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                    {module.shortDescription}
                  </p>

                  {/* Badge Teaser */}
                  <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs mb-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        isCompleted
                          ? 'bg-[#39A900] text-white'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400'
                      }`}>
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200 block text-[11px]">
                          Insignia: {module.badge.title}
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          {isCompleted ? 'Desbloqueada' : 'Requiere aprobar cuestionario $\\ge 80\\%$'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    onClick={() => onOpenModule(module.id)}
                    className="flex-1 py-2 px-3 text-xs font-medium border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Explorar Contenido</span>
                  </button>

                  <button
                    onClick={() => onOpenQuiz(module.id)}
                    className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                      isCompleted
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        : 'bg-[#39A900] hover:bg-[#329600] text-white shadow-xs'
                    }`}
                  >
                    <span>{isCompleted ? 'Repetir Quiz' : 'Presentar Quiz'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Badges Earned Section */}
      <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 space-y-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
            Logros de Competencia
          </span>
          <h2 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
            Tus Insignias de Inducción
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Otorgadas por tu dominio de los componentes formativos y éticos del SENA.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {INDUCTION_MODULES.map((m) => {
            const isEarned = apprentice.badgesEarned.includes(m.badge.title);

            return (
              <div
                key={m.id}
                className={`p-4 rounded-xl border text-center flex flex-col items-center justify-between transition-all ${
                  isEarned
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/40 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  isEarned
                    ? 'bg-[#39A900] text-white shadow-xs'
                    : 'bg-neutral-200 dark:bg-neutral-750 text-neutral-400'
                }`}>
                  <Award className="w-6 h-6" />
                </div>

                <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  {m.badge.title}
                </h4>

                <p className="text-[10px] text-neutral-500 leading-tight">
                  {isEarned ? 'Insignia Obtenida' : 'Bloqueada'}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
