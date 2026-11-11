import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { InductionModule } from '../types/induction';
import { senaAudio } from '../utils/audioSynthesizer';

interface QuizModalProps {
  module: InductionModule;
  onClose: () => void;
  onCompleteQuiz: (moduleId: string, score: number) => void;
  previousScore: number | null;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  module,
  onClose,
  onCompleteQuiz,
  previousScore
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = module.quiz[currentIndex];
  const totalQuestions = module.quiz.length;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctAnswer;
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      senaAudio.playSuccessTone();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Finished
      const finalScore = Math.round(((correctAnswersCount + (selectedOption === currentQ.correctAnswer ? 0 : 0)) / totalQuestions) * 100);
      setIsFinished(true);
      onCompleteQuiz(module.id, finalScore);

      if (finalScore >= 80) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectAnswersCount(0);
    setIsFinished(false);
  };

  const finalScorePercent = Math.round((correctAnswersCount / totalQuestions) * 100);
  const isApproved = finalScorePercent >= 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/60">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
              Evaluación Diagnóstica
            </span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
              {module.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {!isFinished ? (
            <div>
              {/* Question progress */}
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                <span>Pregunta {currentIndex + 1} de {totalQuestions}</span>
                <span className="font-mono tabular-nums">{Math.round(((currentIndex) / totalQuestions) * 100)}%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-[#39A900] transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>

              {/* Question title */}
              <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-5 leading-snug">
                {currentQ.question}
              </h4>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQ.options.map((option, idx) => {
                  let buttonStyle = 'border-neutral-200 dark:border-neutral-750 hover:border-[#39A900] bg-white dark:bg-neutral-850 text-neutral-800 dark:text-neutral-200';

                  if (isAnswered) {
                    if (idx === currentQ.correctAnswer) {
                      buttonStyle = 'border-[#39A900] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-medium';
                    } else if (idx === selectedOption) {
                      buttonStyle = 'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200';
                    } else {
                      buttonStyle = 'border-neutral-200 dark:border-neutral-800 opacity-50 bg-neutral-50 dark:bg-neutral-900';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-lg border text-sm transition-all flex items-start gap-3 ${buttonStyle}`}
                    >
                      <span className="w-6 h-6 rounded-md border flex items-center justify-center shrink-0 text-xs font-semibold mt-0.5 font-mono">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {isAnswered && idx === currentQ.correctAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-[#39A900] shrink-0" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && (
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Explanation */}
              {isAnswered && (
                <div className={`p-4 rounded-lg text-xs leading-relaxed mb-6 border ${
                  selectedOption === currentQ.correctAnswer
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300'
                    : 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-300'
                }`}>
                  <p className="font-semibold mb-1">
                    {selectedOption === currentQ.correctAnswer ? '¡Respuesta Correcta!' : 'Fundamento Normativo / Institucional:'}
                  </p>
                  <p>{currentQ.explanation}</p>
                  {currentQ.articleRef && (
                    <p className="mt-2 text-[11px] text-neutral-500 font-mono">
                      Referencia: {currentQ.articleRef}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-neutral-100 dark:bg-neutral-800">
                {isApproved ? (
                  <Award className="w-8 h-8 text-[#39A900]" />
                ) : (
                  <RotateCcw className="w-8 h-8 text-amber-600" />
                )}
              </div>

              <h4 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                {isApproved ? '¡Módulo Superado con Éxito!' : 'Nivel de Aprobación Pendiente'}
              </h4>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-6">
                {isApproved
                  ? `Has alcanzado un desempeño del ${finalScorePercent}%. Has desbloqueado la insignia oficial "${module.badge.title}".`
                  : `Obtuviste ${finalScorePercent}% (${correctAnswersCount} de ${totalQuestions} correctas). Se requiere un mínimo de 80% para validar el módulo de inducción.`}
              </p>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg max-w-sm mx-auto mb-8 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-neutral-500">Puntaje obtenido</span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 font-mono tabular-nums">{finalScorePercent}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Mínimo aprobatorio</span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300 font-mono">80%</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 text-sm font-medium border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors"
                >
                  Repetir Cuestionario
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-sm font-medium text-white bg-[#39A900] hover:bg-[#329600] rounded-lg transition-colors shadow-xs"
                >
                  Continuar Formación
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!isFinished && (
          <div className="px-6 py-3.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/40">
            <span className="text-xs text-neutral-400">
              {previousScore !== null && `Mejor intento previo: ${previousScore}%`}
            </span>
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                isAnswered
                  ? 'bg-[#39A900] text-white hover:bg-[#329600]'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <span>{currentIndex + 1 < totalQuestions ? 'Siguiente Pregunta' : 'Finalizar y Calificar'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
