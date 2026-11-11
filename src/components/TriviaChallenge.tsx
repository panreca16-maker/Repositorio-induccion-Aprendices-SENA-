import React, { useState, useEffect } from 'react';
import { Sparkles, Timer, Trophy, CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TRIVIA_QUESTIONS } from '../data/senaData';
import { senaAudio } from '../utils/audioSynthesizer';

export const TriviaChallenge: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('sena_trivia_high') || 0);
  });

  useEffect(() => {
    let timer: number;
    if (isPlaying && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      handleEndGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleStart = () => {
    setIsPlaying(true);
    setTimeLeft(60);
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setGameOver(false);
  };

  const handleEndGame = () => {
    setIsPlaying(false);
    setGameOver(true);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('sena_trivia_high', score.toString());
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const currentQ = TRIVIA_QUESTIONS[currentIdx % TRIVIA_QUESTIONS.length];
    const isCorrect = idx === currentQ.a;

    if (isCorrect) {
      senaAudio.playSuccessTone();
      const points = 100 + streak * 20;
      setScore(prev => prev + points);
      setStreak(prev => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (timeLeft > 0) {
        setCurrentIdx(prev => prev + 1);
        setSelectedOpt(null);
        setIsAnswered(false);
      }
    }, 1200);
  };

  const currentQ = TRIVIA_QUESTIONS[currentIdx % TRIVIA_QUESTIONS.length];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 md:p-8">
        {!isPlaying && !gameOver ? (
          /* Start Screen */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#39A900] flex items-center justify-center mx-auto shadow-xs">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#39A900]">
                Desafío Gamificado
              </span>
              <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                Trivia Relámpago SENA
              </h2>
              <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mt-2 leading-relaxed">
                Pon a prueba tus reflejos institucionales en <strong>60 segundos</strong>. Responde preguntas sobre historia, símbolos y el Reglamento del Aprendiz acumulando rachas de aciertos.
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-neutral-500 font-mono">
              <div>Récord personal: <strong className="text-neutral-900 dark:text-neutral-100 tabular-nums">{highScore} pts</strong></div>
              <span aria-hidden="true">·</span>
              <div>Tiempo: <strong>60s</strong></div>
            </div>

            <button
              onClick={handleStart}
              className="px-6 py-2.5 bg-[#39A900] hover:bg-[#329600] text-white font-semibold rounded-lg text-sm transition-all shadow-xs"
            >
              Comenzar Trivia
            </button>
          </div>
        ) : isPlaying ? (
          /* Active Playing Screen */
          <div className="space-y-6">
            {/* HUD Bar */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <Timer className="w-4 h-4 text-amber-500" />
                <span className={`font-bold tabular-nums text-sm ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-neutral-800 dark:text-neutral-200'}`}>
                  {timeLeft}s
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                {streak > 1 && (
                  <span className="text-amber-500 font-bold">
                    Racha x{streak} 🔥
                  </span>
                )}
                <div>
                  Puntos: <strong className="text-neutral-900 dark:text-neutral-100 tabular-nums">{score}</strong>
                </div>
              </div>
            </div>

            {/* Question */}
            <div>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Pregunta {currentIdx + 1}
              </span>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mt-1 leading-snug">
                {currentQ.q}
              </h3>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.opts.map((opt, i) => {
                let style = 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-850 hover:border-[#39A900] text-neutral-800 dark:text-neutral-200';

                if (isAnswered) {
                  if (i === currentQ.a) {
                    style = 'border-[#39A900] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold';
                  } else if (i === selectedOpt) {
                    style = 'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200';
                  } else {
                    style = 'opacity-40 border-neutral-200 dark:border-neutral-800';
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={isAnswered}
                    className={`p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${style}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && i === currentQ.a && (
                      <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                    )}
                    {isAnswered && i === selectedOpt && i !== currentQ.a && (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tip on answer */}
            {isAnswered && (
              <p className="text-[11px] text-neutral-500 text-center italic">
                {currentQ.tip}
              </p>
            )}
          </div>
        ) : (
          /* Game Over Screen */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 text-[#39A900]" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                ¡Tiempo Finalizado!
              </span>
              <h3 className="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                Puntaje Obtenido: {score} pts
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Mejor racha consecutiva: {bestStreak} aciertos.
              </p>
            </div>

            {score >= highScore && score > 0 && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 max-w-sm mx-auto">
                🌟 ¡Nuevo récord personal en la trivia!
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#39A900] hover:bg-[#329600] text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Jugar de Nuevo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
