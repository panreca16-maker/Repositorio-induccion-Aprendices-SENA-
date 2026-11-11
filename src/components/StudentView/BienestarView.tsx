import React from 'react';
import {
  HeartHandshake,
  Activity,
  Music,
  Coins,
  Users2,
  Award,
  Sparkles,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';

interface BienestarViewProps {
  onStartQuiz: () => void;
  isModuleCompleted: boolean;
  score: number | null;
}

export const BienestarView: React.FC<BienestarViewProps> = ({
  onStartQuiz,
  isModuleCompleted,
  score
}) => {
  const bienestarAreas = [
    {
      title: 'Salud Integral & Acompañamiento Psicológico',
      icon: Activity,
      desc: 'Atención primaria en primeros auxilios, campañas de salud preventiva y orientación psicológica individual y grupal para garantizar la salud mental y emocional.',
      benefits: ['Línea de orientación psicológica confidencial', 'Campañas de salud visual y sexual responsable', 'Póliza de accidentes personales para aprendices']
    },
    {
      title: 'Deporte, Recreación y Actividad Física',
      icon: HeartHandshake,
      desc: 'Fomento de hábitos de vida saludable a través de torneos intercentros, selecciones deportivas y los tradicionales Juegos Nacionales de la Confraternidad SENA.',
      benefits: ['Torneos de fútbol sala, voleibol y baloncesto', 'Gimnasios y zonas activas en los centros', 'Participación en competencias zonales y nacionales']
    },
    {
      title: 'Expresión Artística y Cultural',
      icon: Music,
      desc: 'Espacios formativos y grupos representativos en danza folclórica colombiana, música tradicional y urbana, teatro y artes plásticas.',
      benefits: ['Talleres extracurriculares de música y danza', 'Encuentros culturales regionales', 'Fortalecimiento de la identidad nacional']
    },
    {
      title: 'Apoyos Socioeconómicos (Regular y FIC)',
      icon: Coins,
      desc: 'Programas de auxilio económico para aprendices en condiciones de vulnerabilidad socioeconómica focalizados por estrato y rendimiento académico.',
      benefits: ['Convocatorias transparentes semestrales', 'Apoyo mensual de sostenimiento', 'Apoyo especial para el Fondo de la Construcción (FIC)']
    },
    {
      title: 'Liderazgo, Vocería y Representación Estudiantil',
      icon: Users2,
      desc: 'Democracia activa en el SENA: elección de voceros de ficha, representantes de aprendices ante el Comité de Centro y liderazgo en iniciativas comunitarias.',
      benefits: ['Elección democrática con voto electrónico', 'Voz y voto en el Comité Directivo de Centro', 'Escuela Nacional de Liderazgo SENA']
    }
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
              Módulo 4 · Desarrollo Humano
            </span>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100 mt-1 mb-2">
              Plan Integral de Bienestar al Aprendiz
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              El SENA no solo forma para el trabajo técnico; forma seres humanos integrales. Descubre todos los servicios de apoyo psicosocial, salud, deporte, arte, auxilios de sostenimiento y participación democrática a los que tienes derecho como aprendiz.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
            <button
              onClick={onStartQuiz}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#39A900] hover:bg-[#329600] text-white font-semibold rounded-lg transition-colors text-xs shadow-xs"
            >
              <Award className="w-4 h-4" />
              <span>{isModuleCompleted ? `Repetir Cuestionario (${score}%)` : 'Evaluar Módulo 4'}</span>
            </button>
            <span className="text-xs text-neutral-400">
              Duración recomendada: 35 minutos
            </span>
          </div>
        </div>
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bienestarAreas.map((area, idx) => {
          const Icon = area.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#39A900] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  {area.title}
                </h3>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                  {area.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1.5 text-[11px] text-neutral-600 dark:text-neutral-300">
                {area.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Support channel strip */}
      <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#39A900] flex items-center justify-center text-white shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Ruta de Atención y Primer Respondiente</h4>
            <p className="text-xs text-neutral-300">
              ¿Requieres apoyo urgente o tienes dudas sobre convocatorias de bienestar?
            </p>
          </div>
        </div>

        <div className="text-xs text-neutral-300 text-right">
          <span>Acércate a la oficina de <strong>Bienestar al Aprendiz</strong> en tu sede o consulta por el campus Zajuna.</span>
        </div>
      </div>
    </div>
  );
};
