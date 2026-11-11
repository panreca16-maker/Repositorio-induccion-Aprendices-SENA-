import React, { useState } from 'react';
import {
  Play,
  Square,
  Volume2,
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  Compass,
  ArrowRight,
  Shield,
  Flag,
  Users
} from 'lucide-react';
import { SENA_GENERAL_INFO, SENA_SYMBOLS, SENA_CAMPUS_IMG, SENA_LOGO_SVG, SENA_ESCUDO_URL } from '../../data/senaData';
import { senaAudio } from '../../utils/audioSynthesizer';

interface InstitutionalIdentityViewProps {
  onStartQuiz: () => void;
  isModuleCompleted: boolean;
  score: number | null;
}

export const InstitutionalIdentityView: React.FC<InstitutionalIdentityViewProps> = ({
  onStartQuiz,
  isModuleCompleted,
  score
}) => {
  const [activeSymbol, setActiveSymbol] = useState<'shield' | 'flag' | 'logo' | 'hymn'>('shield');
  const [isPlayingHymn, setIsPlayingHymn] = useState(false);
  const [hymnProgress, setHymnProgress] = useState(0);
  const [selectedShieldPart, setSelectedShieldPart] = useState<number>(1);

  const toggleHymnPlayback = () => {
    if (isPlayingHymn) {
      senaAudio.stop();
      setIsPlayingHymn(false);
      setHymnProgress(0);
    } else {
      setIsPlayingHymn(true);
      senaAudio.playHymnFanfare(
        (progress) => setHymnProgress(progress),
        () => {
          setIsPlayingHymn(false);
          setHymnProgress(100);
        }
      );
    }
  };

  return (
    <div className="space-y-10">
      {/* Editorial Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white min-h-[300px] flex flex-col justify-end p-6 md:p-10">
        <img
          src={SENA_CAMPUS_IMG}
          alt="Campus Tecnológico del SENA"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#39A900] uppercase tracking-wider mb-2">
            <span>Módulo 1 · Identidad Institucional</span>
            <span aria-hidden="true">·</span>
            <span>Establecido en 1957</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-white mb-3">
            Símbolos, Historia y Cultura SENA
          </h1>

          <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-2xl">
            Descubre las raíces, la misión y los símbolos patrios del Servicio Nacional de Aprendizaje, una de las instituciones más queridas y transformadoras de Colombia.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={onStartQuiz}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#39A900] hover:bg-[#329600] text-white font-semibold rounded-lg transition-colors shadow-sm"
            >
              <Award className="w-4 h-4" />
              <span>{isModuleCompleted ? `Repetir Cuestionario (${score}%)` : 'Presentar Cuestionario del Módulo'}</span>
            </button>
            <span className="text-neutral-400">
              Duración estimada: 45 min · 4 temas clave
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Symbols Studio */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100">
              Símbolos Institucionales Interactivos
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Explora en detalle el Escudo, la Bandera, el Logo-símbolo y el Himno oficial del SENA.
            </p>
          </div>

          {/* Segmented Symbol Switcher */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <button
              onClick={() => setActiveSymbol('shield')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeSymbol === 'shield'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Escudo
            </button>
            <button
              onClick={() => setActiveSymbol('flag')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeSymbol === 'flag'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Bandera
            </button>
            <button
              onClick={() => setActiveSymbol('logo')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeSymbol === 'logo'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Logo-Símbolo
            </button>
            <button
              onClick={() => setActiveSymbol('hymn')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeSymbol === 'hymn'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              Himno SENA
            </button>
          </div>
        </div>

        {/* Dynamic Display of Active Symbol */}
        {activeSymbol === 'shield' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800">
            {/* Visual representation of Shield */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-850 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
              <div className="relative w-56 h-60 flex flex-col items-center justify-center p-3">
                {/* Official SENA Shield */}
                <img
                  src={SENA_ESCUDO_URL}
                  alt="Escudo Oficial del SENA"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <p className="text-xs text-neutral-500 font-semibold mt-3 text-center">
                Escudo Oficial del SENA
              </p>
            </div>

            {/* Explanation of 3 Sectors */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
                  Heráldica Institucional
                </span>
                <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  Los Tres Sectores de la Economía
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  {SENA_SYMBOLS.shield.description}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {SENA_SYMBOLS.shield.elements.map((elem, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedShieldPart(idx)}
                    className={`p-3.5 rounded-lg border text-sm cursor-pointer transition-all ${
                      selectedShieldPart === idx
                        ? 'border-[#39A900] bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-850'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {elem.part}
                      </span>
                      {selectedShieldPart === idx && (
                        <span className="text-xs font-bold text-[#39A900]">Seleccionado</span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {elem.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSymbol === 'flag' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-neutral-50 dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800">
              {/* Flag canvas */}
              <div className="w-full max-w-sm aspect-[3/2] bg-white border border-neutral-300 shadow-md flex items-center justify-center relative overflow-hidden rounded-xs">
                {/* Official SENA logo in center */}
                <img
                  src={SENA_LOGO_SVG}
                  alt="Escudo del SENA en la bandera"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <span className="text-xs text-neutral-400 mt-4">
                Proporción reglamentaria: 2:3 sobre fondo blanco
              </span>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
                Vexilología SENA
              </span>
              <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">
                {SENA_SYMBOLS.flag.title}
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {SENA_SYMBOLS.flag.description}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs">
                  <strong className="block text-neutral-900 dark:text-neutral-100 mb-0.5">El Color Blanco</strong>
                  <span className="text-neutral-600 dark:text-neutral-400">Paz, transparencia institucional y libertad con responsabilidad.</span>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs">
                  <strong className="block text-neutral-900 dark:text-neutral-100 mb-0.5">El Color Verde (#39A900)</strong>
                  <span className="text-neutral-600 dark:text-neutral-400">Esperanza viva, productividad agroecológica y sostenibilidad.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSymbol === 'logo' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-neutral-50 dark:bg-neutral-850 rounded-xl border border-neutral-200 dark:border-neutral-800">
              {/* Official Graphic Logo-symbol SVG */}
              <div className="w-56 h-56 flex items-center justify-center p-2">
                <img
                  src={SENA_LOGO_SVG}
                  alt="Logo-Símbolo Oficial SENA"
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>
              <span className="text-xs text-neutral-500 font-semibold mt-3">
                Logo-Símbolo Institucional Oficial
              </span>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
                Semiótica del Aprendiz
              </span>
              <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">
                {SENA_SYMBOLS.logoSymbol.title}
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {SENA_SYMBOLS.logoSymbol.description}
              </p>

              <div className="space-y-2 pt-2">
                {SENA_SYMBOLS.logoSymbol.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#39A900] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSymbol === 'hymn' && (
          <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
                  Patrimonio Cívico y Musical
                </span>
                <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {SENA_SYMBOLS.hymn.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                  <span>Letra: {SENA_SYMBOLS.hymn.lyricsAuthor}</span>
                  <span aria-hidden="true">·</span>
                  <span>Música: {SENA_SYMBOLS.hymn.musicAuthor}</span>
                </div>
              </div>

              {/* Synthesized Melody Player */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleHymnPlayback}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                    isPlayingHymn
                      ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                      : 'bg-[#39A900] text-white hover:bg-[#329600]'
                  }`}
                >
                  {isPlayingHymn ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Detener Fanfarria</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Escuchar Melodía Institucional</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Live Progress Bar when Playing */}
            {isPlayingHymn && (
              <div className="space-y-1.5 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span>Reproduciendo acordes oficiales del Himno SENA...</span>
                  </div>
                  <span className="font-mono tabular-nums">{hymnProgress}%</span>
                </div>
                <div className="w-full bg-emerald-200 dark:bg-emerald-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#39A900] transition-all duration-100"
                    style={{ width: `${hymnProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Hymn Lyrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Chorus */}
              <div className="p-5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#39A900]">
                    CORO PRINCIPAL
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono">Entonación solemne</span>
                </div>
                <pre className="font-sans text-sm font-semibold text-neutral-900 dark:text-neutral-100 whitespace-pre-line leading-relaxed">
                  {SENA_SYMBOLS.hymn.chorus}
                </pre>
              </div>

              {/* Stanza 1 */}
              <div className="p-5 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    ESTROFA I
                  </span>
                </div>
                <pre className="font-sans text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                  {SENA_SYMBOLS.hymn.stanzas[0].text}
                </pre>
              </div>

              {/* Stanza 2 */}
              <div className="p-5 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    ESTROFA II
                  </span>
                </div>
                <pre className="font-sans text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                  {SENA_SYMBOLS.hymn.stanzas[1].text}
                </pre>
              </div>

              {/* Stanza 3 & 4 */}
              <div className="p-5 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    ESTROFA III & IV
                  </span>
                </div>
                <pre className="font-sans text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                  {SENA_SYMBOLS.hymn.stanzas[2].text}
                </pre>
              </div>
            </div>

            {/* Glossary */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                Glosario del Himno
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SENA_SYMBOLS.hymn.glossary.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-xs">
                    <strong className="text-neutral-900 dark:text-neutral-100 font-semibold block mb-1">
                      {item.word}
                    </strong>
                    <span className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* History Timeline */}
      <section className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
            Trayectoria y Legado
          </span>
          <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
            Historia del SENA
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Desde su concepción por Rodolfo Martínez Tono en 1957 hasta la formación técnica 4.0.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800">
            <span className="font-mono text-sm font-bold text-[#39A900]">1957</span>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-1 mb-1.5">
              Nacimiento Institucional
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Decreto Ley 118 de 1957 impulsado por Rodolfo Martínez Tono con apoyo de gremios productivos y la OIT.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800">
            <span className="font-mono text-sm font-bold text-[#39A900]">1960–1980</span>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-1 mb-1.5">
              Expansión a Todo el País
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Apertura de centros de formación en las 33 regionales y creación de la modalidad de Contrato de Aprendizaje.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800">
            <span className="font-mono text-sm font-bold text-[#39A900]">1990–2010</span>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-1 mb-1.5">
              Enfoque de Competencias
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Adopción del modelo pedagógico de Formación Profesional Integral por competencias laborales y modernización curricular.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800">
            <span className="font-mono text-sm font-bold text-[#39A900]">Actualidad</span>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-1 mb-1.5">
              SENA Digital & 4.0
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Laboratorios de Inteligencia Artificial, ciberseguridad, energías renovables, bioeconomía y el LMS Zajuna.
            </p>
          </div>
        </div>
      </section>

      {/* Principles and Values Grid */}
      <section className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
            Marco Axiológico
          </span>
          <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
            Principios y Valores Institucionales
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Los pilares éticos que orientan el comportamiento de instructores, directivos y aprendices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SENA_GENERAL_INFO.institutionalPrinciples.map((principle, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                {principle.title}
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {principle.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
