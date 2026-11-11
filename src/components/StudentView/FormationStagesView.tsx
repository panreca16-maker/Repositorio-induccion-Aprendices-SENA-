import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  Lightbulb,
  Building,
  CheckCircle2,
  Award,
  HelpCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface FormationStagesViewProps {
  onStartQuiz: () => void;
  isModuleCompleted: boolean;
  score: number | null;
}

export const FormationStagesView: React.FC<FormationStagesViewProps> = ({
  onStartQuiz,
  isModuleCompleted,
  score
}) => {
  const [selectedAlternative, setSelectedAlternative] = useState<string>('contrato');

  const alternatives = [
    {
      id: 'contrato',
      title: 'Contrato de Aprendizaje',
      badgeText: 'La más popular',
      coverage: '100% regulado por Ley 789 de 2002',
      stipend: '75% a 100% SMLMV + EPS + ARL en etapa práctica (50% en lectiva)',
      description: 'Vinculación formativa no laboral con una empresa patrocinadora que aporta apoyo económico y afiliación al sistema de seguridad social integral.',
      requirements: ['No haber tenido contrato de aprendizaje previo para el mismo nivel técnico/tecnológico.', 'Aprobación del 100% de los resultados de aprendizaje de la etapa lectiva.'],
      pros: ['Inmersión directa en grandes empresas', 'Apoyo económico garantizado', 'Alta probabilidad de contratación posterior']
    },
    {
      id: 'proyecto',
      title: 'Proyecto Productivo (Emprendimiento)',
      badgeText: 'Innovación & Empresa',
      coverage: 'Fondo Emprender SENA',
      stipend: 'Capital semilla no reembolsable en convocatorias aprobadas',
      description: 'Formulación y puesta en marcha de una idea de negocio o unidad productiva con acompañamiento de los Centros de Desarrollo Empresarial (SBDC).',
      requirements: ['Plan de negocio estructurado y validado con asesor de emprendimiento.', 'Articulación directa con las competencias del programa formativo.'],
      pros: ['Eres tu propio jefe', 'Posibilidad de obtener capital semilla', 'Impacto económico en tu comunidad']
    },
    {
      id: 'pasantia',
      title: 'Pasantía Comunitaria o Pyme',
      badgeText: 'Sector Social o Pyme',
      coverage: 'Convenio formal suscrito',
      stipend: 'Concertado entre las partes o apoyo voluntario',
      description: 'Práctica concertada en pequeñas y medianas empresas, ONGs o instituciones públicas orientada a la aplicación directa de competencias.',
      requirements: ['Plan concertado de actividades firmado por el representante de la entidad y el SENA.', 'Afiliación a ARL a cargo de la entidad receptora.'],
      pros: ['Flexibilidad en proyectos especiales', 'Impacto social y comunitario', 'Experiencia en proyectos específicos']
    },
    {
      id: 'laboral',
      title: 'Vínculo Laboral o Contractual',
      badgeText: 'Para aprendices que ya laboran',
      coverage: 'Código Sustantivo del Trabajo',
      stipend: 'Salario formal pactado con la empresa',
      description: 'Homologación de la etapa productiva si el aprendiz ya labora en una empresa desempeñando funciones directamente relacionadas con su programa de formación.',
      requirements: ['Certificación de funciones afines al programa expedida por la empresa.', 'Visto bueno del coordinador académico.'],
      pros: ['Conservas tu empleo formal', 'No requiere buscar una nueva plaza', 'Salario y prestaciones de ley vigentes']
    },
    {
      id: 'monitoria',
      title: 'Monitoría Institucional',
      badgeText: 'Mérito Académico',
      coverage: 'Reglamento interno SENA',
      stipend: 'Apoyo económico de sostenimiento por monitoría',
      description: 'Apoyo a instructores en ambientes de aprendizaje y laboratorios tecnológicos por parte de aprendices con rendimiento académico y liderazgo sobresaliente.',
      requirements: ['Promedio académico destacado y convocatoria pública en el centro.', 'Cumplimiento de horas asignadas de apoyo pedagógico.'],
      pros: ['Desarrollo de habilidades pedagógicas', 'Profundización en tecnologías de punta', 'Certificado con alto valor curricular']
    }
  ];

  const currentAlt = alternatives.find(a => a.id === selectedAlternative) || alternatives[0];

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
              Módulo 3 · Ruta Formativa
            </span>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100 mt-1 mb-2">
              Etapas Formativas & Modalidades Productivas
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              La Formación Profesional Integral del SENA se compone de dos grandes fases articuladas: la <strong>Etapa Lectiva</strong> (desarrollo de competencias en ambientes de aprendizaje) y la <strong>Etapa Productiva</strong> (aplicación real en el sector empresarial o de emprendimiento).
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
            <button
              onClick={onStartQuiz}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#39A900] hover:bg-[#329600] text-white font-semibold rounded-lg transition-colors text-xs shadow-xs"
            >
              <Award className="w-4 h-4" />
              <span>{isModuleCompleted ? `Repetir Cuestionario (${score}%)` : 'Evaluar Módulo 3'}</span>
            </button>
            <span className="text-xs text-neutral-400">
              Duración recomendada: 40 minutos
            </span>
          </div>
        </div>
      </div>

      {/* Two Stages Comparison Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lectiva */}
        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
              <GraduationCap className="w-4 h-4 text-[#39A900]" />
              <span>Fase 1</span>
            </div>
            <span className="text-xs text-neutral-500 font-mono">Ambiente de Centro</span>
          </div>

          <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">
            Etapa Lectiva
          </h3>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Apropiación de conocimientos teóricos, habilidades técnicas, trabajo en equipo y competencias transversales (ética, comunicación, bilingüismo, TIC y cultura física).
          </p>

          <div className="space-y-2 pt-2 text-xs text-neutral-700 dark:text-neutral-300">
            <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-850 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
              <span>Evaluación cualitativa por juicios: <strong>Aprobado (A)</strong> o <strong>No Aprobado (D)</strong>.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-850 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
              <span>Plataformas: Sofía Plus (gestión) y Zajuna (campus virtual).</span>
            </div>
          </div>
        </div>

        {/* Productiva */}
        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#39A900]">
              <Briefcase className="w-4 h-4 text-[#39A900]" />
              <span>Fase 2</span>
            </div>
            <span className="text-xs text-neutral-500 font-mono">Entorno Real</span>
          </div>

          <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">
            Etapa Productiva
          </h3>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Consolidación y aplicación de las competencias adquiridas directamente en el sector productivo o mediante el desarrollo de proyectos innovadores.
          </p>

          <div className="space-y-2 pt-2 text-xs text-neutral-700 dark:text-neutral-300">
            <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-850 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
              <span>Acompañamiento periódico de un <strong>Instructor de Seguimiento</strong> asignado.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-850 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
              <span>Entrega de bitácoras quincenales y concertación de plan de trabajo.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Alternative Explorer */}
      <section className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
            Elige tu camino de certificación
          </span>
          <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
            Alternativas de Etapa Productiva Avaladas
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Conoce los requisitos, ventajas y cobertura económica de cada modalidad.
          </p>
        </div>

        {/* Alternative buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {alternatives.map((alt) => (
            <button
              key={alt.id}
              onClick={() => setSelectedAlternative(alt.id)}
              className={`p-3 text-left rounded-lg border transition-all text-xs flex flex-col justify-between min-h-[88px] ${
                selectedAlternative === alt.id
                  ? 'border-[#39A900] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 shadow-xs'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              <span className="font-bold">{alt.title}</span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 block">{alt.badgeText}</span>
            </button>
          ))}
        </div>

        {/* Selected Alternative Details */}
        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-850 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {currentAlt.title}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Marco Legal: {currentAlt.coverage}
              </p>
            </div>
            <div className="text-xs font-mono text-[#39A900] bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded border border-emerald-200 dark:border-emerald-800">
              Apoyo: {currentAlt.stipend}
            </div>
          </div>

          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {currentAlt.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-2">
              <strong className="block text-neutral-900 dark:text-neutral-100">Requisitos indispensables:</strong>
              <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-400">
                {currentAlt.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#39A900] font-bold">·</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-2">
              <strong className="block text-neutral-900 dark:text-neutral-100">Beneficios estratégicos:</strong>
              <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-400">
                {currentAlt.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
