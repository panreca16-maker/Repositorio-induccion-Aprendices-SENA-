import React, { useState } from 'react';
import {
  Scale,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  FileCheck,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { CASE_DILEMMAS, SENA_LAB_IMG } from '../../data/senaData';
import { ApprenticeCaseDilemma } from '../../types/induction';

interface RegulationsViewProps {
  onStartQuiz: () => void;
  isModuleCompleted: boolean;
  score: number | null;
  completedCases: string[];
  onSolveCase: (caseId: string) => void;
}

export const RegulationsView: React.FC<RegulationsViewProps> = ({
  onStartQuiz,
  isModuleCompleted,
  score,
  completedCases,
  onSolveCase
}) => {
  const [activeTab, setActiveTab] = useState<'simulador' | 'compendio'>('simulador');
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  // Regulatory search & category in compendium
  const [selectedCategory, setSelectedCategory] = useState<'derechos' | 'deberes' | 'prohibiciones' | 'faltas' | 'debido_proceso'>('derechos');

  const currentCase = CASE_DILEMMAS[currentCaseIndex];
  const isCaseCompleted = completedCases.includes(currentCase.id);

  const handleChooseOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    setHasEvaluated(true);
    onSolveCase(currentCase.id);
  };

  const handleNextCase = () => {
    if (currentCaseIndex + 1 < CASE_DILEMMAS.length) {
      setCurrentCaseIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setHasEvaluated(false);
    }
  };

  const handlePrevCase = () => {
    if (currentCaseIndex > 0) {
      setCurrentCaseIndex(prev => prev - 1);
      setSelectedOptionId(null);
      setHasEvaluated(false);
    }
  };

  const selectedOption = currentCase.options.find(o => o.id === selectedOptionId);

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white min-h-[260px] flex flex-col justify-end p-6 md:p-10">
        <img
          src={SENA_LAB_IMG}
          alt="Aprendices SENA en ambiente colaborativo"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#39A900] uppercase tracking-wider mb-2">
            <span>Módulo 2 · Normativa Institucional</span>
            <span aria-hidden="true">·</span>
            <span>Reglamento del Aprendiz</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-white mb-3">
            Convivencia, Ética y Debido Proceso
          </h1>

          <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-2xl">
            Aprende a ejercer tus derechos, cumplir con tus deberes y tomar decisiones éticas fundamentadas en el Acuerdo 007 de 2012 y normas vigentes del SENA.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={onStartQuiz}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#39A900] hover:bg-[#329600] text-white font-semibold rounded-lg transition-colors shadow-sm"
            >
              <Award className="w-4 h-4" />
              <span>{isModuleCompleted ? `Repetir Evaluación (${score}%)` : 'Presentar Cuestionario Normativo'}</span>
            </button>
            <span className="text-neutral-400">
              Casos resueltos: {completedCases.length} de {CASE_DILEMMAS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Switcher */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('simulador')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'simulador'
                ? 'bg-[#39A900] text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Simulador de Casos Reales
          </button>
          <button
            onClick={() => setActiveTab('compendio')}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'compendio'
                ? 'bg-[#39A900] text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Compendio de Artículos Clave
          </button>
        </div>

        <span className="text-xs text-neutral-500 hidden sm:inline">
          Acuerdo 007 de 2012 / Dirección General SENA
        </span>
      </div>

      {/* Tab 1: Simulator */}
      {activeTab === 'simulador' && (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {/* Case Navigation bar */}
          <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#39A900]">
                Caso {currentCaseIndex + 1} de {CASE_DILEMMAS.length}
              </span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="text-xs text-neutral-500 capitalize">
                Ámbito: {currentCase.category.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevCase}
                disabled={currentCaseIndex === 0}
                className="px-2.5 py-1 text-xs font-medium border border-neutral-300 dark:border-neutral-700 rounded-md disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={handleNextCase}
                disabled={currentCaseIndex === CASE_DILEMMAS.length - 1}
                className="px-2.5 py-1 text-xs font-medium border border-neutral-300 dark:border-neutral-700 rounded-md disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>

          {/* Case Content */}
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">
                  {currentCase.title}
                </h3>
                {isCaseCompleted && (
                  <span className="flex items-center gap-1.5 text-xs text-[#39A900] font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Resuelto</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Contexto: {currentCase.context}
              </p>
            </div>

            {/* Scenario Box */}
            <div className="p-5 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
              <p className="font-semibold text-xs text-neutral-500 uppercase tracking-wider mb-1.5">
                Situación en el ambiente de aprendizaje:
              </p>
              <p>{currentCase.scenario}</p>
            </div>

            {/* Decision Options */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                ¿Qué decisión tomas como aprendiz SENA?
              </h4>

              <div className="space-y-3">
                {currentCase.options.map((option, idx) => {
                  let style = 'border-neutral-200 dark:border-neutral-750 hover:border-[#39A900] bg-white dark:bg-neutral-900';

                  if (hasEvaluated) {
                    if (option.id === selectedOptionId) {
                      style = option.isOptimal
                        ? 'border-[#39A900] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-200'
                        : 'border-red-400 bg-red-50 dark:bg-red-950/20 text-red-950 dark:text-red-200';
                    } else if (option.isOptimal) {
                      style = 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/10 opacity-70';
                    } else {
                      style = 'opacity-40 border-neutral-200 dark:border-neutral-800';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChooseOption(option.id)}
                      className={`w-full text-left p-4 rounded-lg border text-sm transition-all flex items-start gap-3 ${style}`}
                    >
                      <span className="w-6 h-6 rounded-md border flex items-center justify-center shrink-0 text-xs font-semibold mt-0.5 font-mono">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">{option.text}</p>
                        {hasEvaluated && option.id === selectedOptionId && (
                          <p className="text-xs mt-2 text-neutral-600 dark:text-neutral-300">
                            <strong>Consecuencia:</strong> {option.consequence}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback Card upon Decision */}
            {hasEvaluated && selectedOption && (
              <div className={`p-5 rounded-lg border text-xs leading-relaxed space-y-2 ${
                selectedOption.isOptimal
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {selectedOption.isOptimal ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[#39A900]" />
                      <span>Decisión Acorde al Reglamento</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span>Acción con Riesgo Disciplinario o Académico</span>
                    </>
                  )}
                </div>

                <p className="text-xs md:text-sm">{selectedOption.normativeFeedback}</p>

                <div className="pt-2 text-[11px] font-mono text-neutral-500 border-t border-neutral-200 dark:border-neutral-700">
                  {selectedOption.ruleArticle}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Articles Compendium */}
      {activeTab === 'compendio' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Category Selector */}
          <div className="md:col-span-4 space-y-2">
            <button
              onClick={() => setSelectedCategory('derechos')}
              className={`w-full text-left p-3.5 rounded-lg border text-sm font-semibold transition-all ${
                selectedCategory === 'derechos'
                  ? 'border-[#39A900] bg-emerald-50 dark:bg-emerald-950/20 text-[#39A900]'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              1. Derechos del Aprendiz (Art. 7)
            </button>
            <button
              onClick={() => setSelectedCategory('deberes')}
              className={`w-full text-left p-3.5 rounded-lg border text-sm font-semibold transition-all ${
                selectedCategory === 'deberes'
                  ? 'border-[#39A900] bg-emerald-50 dark:bg-emerald-950/20 text-[#39A900]'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              2. Deberes del Aprendiz (Art. 8)
            </button>
            <button
              onClick={() => setSelectedCategory('prohibiciones')}
              className={`w-full text-left p-3.5 rounded-lg border text-sm font-semibold transition-all ${
                selectedCategory === 'prohibiciones'
                  ? 'border-[#39A900] bg-emerald-50 dark:bg-emerald-950/20 text-[#39A900]'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              3. Prohibiciones Expresas (Art. 9)
            </button>
            <button
              onClick={() => setSelectedCategory('faltas')}
              className={`w-full text-left p-3.5 rounded-lg border text-sm font-semibold transition-all ${
                selectedCategory === 'faltas'
                  ? 'border-[#39A900] bg-emerald-50 dark:bg-emerald-950/20 text-[#39A900]'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              4. Tipificación de Faltas & Sanciones
            </button>
            <button
              onClick={() => setSelectedCategory('debido_proceso')}
              className={`w-full text-left p-3.5 rounded-lg border text-sm font-semibold transition-all ${
                selectedCategory === 'debido_proceso'
                  ? 'border-[#39A900] bg-emerald-50 dark:bg-emerald-950/20 text-[#39A900]'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              5. Medidas Formativas & Debido Proceso
            </button>
          </div>

          {/* Details View */}
          <div className="md:col-span-8 bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            {selectedCategory === 'derechos' && (
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
                  Capítulo II · Artículo 7
                </span>
                <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">
                  Derechos Fundamentales del Aprendiz
                </h3>
                <p className="text-xs text-neutral-500">
                  El aprendiz goza de garantías plenas durante todas las etapas de su proceso formativo:
                </p>
                <ul className="space-y-3 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  <li className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <strong className="block text-neutral-900 dark:text-neutral-100 mb-1">1. Formación Profesional de Calidad</strong>
                    Recibir formación acorde con el programa matriculado, haciendo uso de instalaciones, talleres y tecnologías idóneas.
                  </li>
                  <li className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <strong className="block text-neutral-900 dark:text-neutral-100 mb-1">2. Trato Digno y Respetuoso</strong>
                    Ser escuchado y tratado con respeto y dignidad por instructores, directivos, compañeros y colaboradores del SENA.
                  </li>
                  <li className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <strong className="block text-neutral-900 dark:text-neutral-100 mb-1">3. Retroalimentación Oportuna</strong>
                    Conocer oportunamente las evaluaciones, juicios evaluativos y contar con planes de mejoramiento antes de cierres académicos.
                  </li>
                  <li className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <strong className="block text-neutral-900 dark:text-neutral-100 mb-1">4. Servicios de Bienestar y Liderazgo</strong>
                    Acceder a programas deportivos, culturales, consejería psicológica y postularse a la representación de aprendices.
                  </li>
                </ul>
              </div>
            )}

            {selectedCategory === 'deberes' && (
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
                  Capítulo III · Artículo 8
                </span>
                <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">
                  Deberes Ineludibles del Aprendiz
                </h3>
                <ul className="space-y-3 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  <li className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <strong className="block text-neutral-900 dark:text-neutral-100 mb-1">1. Portar el Carné Institucional</strong>
                    Llevar el carné en lugar visible al ingresar, permanecer y salir del centro, así como en giras técnicas.
                  </li>
                  <li className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <strong className="block text-neutral-900 dark:text-neutral-100 mb-1">2. Asistencia y Puntualidad</strong>
                    Asistir puntualmente a todas las actividades formativas y justificar inasistencias dentro de los 3 días hábiles.
                  </li>
                  <li className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <strong className="block text-neutral-900 dark:text-neutral-100 mb-1">3. Cuidado de Bienes y Equipos</strong>
                    Velar por el buen estado de computadores, herramientas, maquinaria e infraestructura del SENA.
                  </li>
                  <li className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <strong className="block text-neutral-900 dark:text-neutral-100 mb-1">4. Seguridad y Salud en el Trabajo</strong>
                    Usar los Elementos de Protección Personal (EPP) y respetar protocolos de bioseguridad.
                  </li>
                </ul>
              </div>
            )}

            {selectedCategory === 'prohibiciones' && (
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
                  Capítulo IV · Artículo 9
                </span>
                <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">
                  Prohibiciones Expresas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-700 dark:text-neutral-300">
                  <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                    <strong className="block text-red-900 dark:text-red-200 mb-1">Plagio y Fraude</strong>
                    Copiar o apropiarse de trabajos ajenos o facilitar fraude en evaluaciones.
                  </div>
                  <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                    <strong className="block text-red-900 dark:text-red-200 mb-1">Sustancias Prohibidas</strong>
                    Ingresar, comercializar o consumir alcohol o sustancias psicoactivas en el centro.
                  </div>
                  <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                    <strong className="block text-red-900 dark:text-red-200 mb-1">Violencia y Acoso</strong>
                    Agredir física, verbal o virtualmente a cualquier miembro de la comunidad educativa.
                  </div>
                  <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                    <strong className="block text-red-900 dark:text-red-200 mb-1">Uso Indebido de Carné</strong>
                    Prestar, transferir o alterar el carné institucional para permitir el ingreso de terceros.
                  </div>
                </div>
              </div>
            )}

            {selectedCategory === 'faltas' && (
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
                  Capítulo VIII · Faltas y Clasificación
                </span>
                <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">
                  Faltas Académicas y Disciplinarias
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <strong className="text-neutral-900 dark:text-neutral-100 font-semibold block mb-0.5">Faltas Leves</strong>
                    Infracciones menores a la convivencia o incumplimientos esporádicos que no afectan gravemente la formación.
                  </div>
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <strong className="text-amber-800 dark:text-amber-300 font-semibold block mb-0.5">Faltas Graves</strong>
                    Reincidencia en faltas leves, plagio comprobado, desacato reiterado a normas de seguridad o daño a equipos.
                  </div>
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <strong className="text-red-800 dark:text-red-300 font-semibold block mb-0.5">Faltas Gravísimas</strong>
                    Agresiones físicas, porte de armas, falsificación de documentos oficiales o hurto de bienes públicos.
                  </div>
                </div>
              </div>
            )}

            {selectedCategory === 'debido_proceso' && (
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
                  Capítulos IX y X · Garantías Constitucionales
                </span>
                <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">
                  Medidas Formativas y Debido Proceso
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  El SENA no aplica sanciones arbitrarias. Todo proceso pasa por el Comité de Evaluación y Seguimiento:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850">
                    <strong className="block text-neutral-900 dark:text-neutral-100 mb-0.5">1. Llamado de Atención Escrito</strong>
                    Medida formativa pedagógica concertada cuando se presenta la primera falta o bajo rendimiento.
                  </div>
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850">
                    <strong className="block text-neutral-900 dark:text-neutral-100 mb-0.5">2. Plan de Mejoramiento</strong>
                    Compromiso formativo con actividades y plazos definidos para alcanzar los resultados de aprendizaje.
                  </div>
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850">
                    <strong className="block text-neutral-900 dark:text-neutral-100 mb-0.5">3. Derecho a Descargos</strong>
                    El aprendiz tiene derecho a ser escuchado formalmente y aportar pruebas en el Comité de Evaluación.
                  </div>
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850">
                    <strong className="block text-neutral-900 dark:text-neutral-100 mb-0.5">4. Recurso de Reposición</strong>
                    Contra las decisiones del Subdirector de Centro procede el recurso legal en los términos del debido proceso.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
