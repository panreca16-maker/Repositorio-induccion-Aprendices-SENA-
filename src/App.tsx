import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentView/StudentDashboard';
import { InstitutionalIdentityView } from './components/StudentView/InstitutionalIdentityView';
import { RegulationsView } from './components/StudentView/RegulationsView';
import { FormationStagesView } from './components/StudentView/FormationStagesView';
import { BienestarView } from './components/StudentView/BienestarView';
import { InstructorDashboard } from './components/InstructorView/InstructorDashboard';
import { TriviaChallenge } from './components/TriviaChallenge';
import { InductionAIAssistant } from './components/InductionAIAssistant';
import { QuizModal } from './components/QuizModal';
import { CertificateModal } from './components/CertificateModal';
import { ApprenticeProfileModal } from './components/ApprenticeProfileModal';
import { VideoModal } from './components/VideoModal';
import { LandingPage } from './components/LandingPage';

import {
  INITIAL_COHORT_APPRENTICES,
  INDUCTION_MODULES,
  SENA_LOGO_SVG
} from './data/senaData';
import { ApprenticeProgress, ModuleId, InductionModule } from './types/induction';

export default function App() {
  const [isLandingView, setIsLandingView] = useState<boolean>(true);
  const [apprentices, setApprentices] = useState<ApprenticeProgress[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sena_cohort_apprentices');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved apprentices', e);
        }
      }
    }
    return INITIAL_COHORT_APPRENTICES;
  });

  const [currentApprenticeId, setCurrentApprenticeId] = useState<string>(() => {
    return INITIAL_COHORT_APPRENTICES[1].id;
  });
  const [currentTab, setCurrentTab] = useState<'aprendiz' | 'identidad' | 'normativa' | 'seguimiento' | 'trivia' | 'asistente'>('aprendiz');
  const [activeRole, setActiveRole] = useState<'aprendiz' | 'instructor'>('aprendiz');
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showManualVideo, setShowManualVideo] = useState<boolean>(false);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sena_cohort_apprentices', JSON.stringify(apprentices));
    }
  }, [apprentices]);

  // Dark mode with blur transition
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sena_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isBlurringTheme, setIsBlurringTheme] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    // 1. Trigger blur transition
    setIsBlurringTheme(true);

    // 2. Midway into blur, switch dark class and colors
    setTimeout(() => {
      setIsDark(prev => {
        const next = !prev;
        if (next) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('sena_theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('sena_theme', 'light');
        }
        return next;
      });
    }, 220);

    // 3. Remove blur after color shift completes smoothly
    setTimeout(() => {
      setIsBlurringTheme(false);
    }, 520);
  };

  // Sub-modules navigation within student tab
  const [studentSubView, setStudentSubView] = useState<'dashboard' | ModuleId>('dashboard');

  // Modals
  const [activeQuizModule, setActiveQuizModule] = useState<InductionModule | null>(null);
  const [certificateApprentice, setCertificateApprentice] = useState<ApprenticeProgress | null>(null);

  const currentApprentice = apprentices.find(a => a.id === currentApprenticeId) || apprentices[0];

  // Helper to re-calculate overall progress of an apprentice
  const recalculateProgress = (app: ApprenticeProgress): ApprenticeProgress => {
    const modules: ModuleId[] = ['identidad', 'normativa', 'etapas', 'bienestar'];
    let completedCount = 0;
    modules.forEach(m => {
      if (app.moduleStatus[m] === 'completed') completedCount++;
    });
    const newProgress = Math.round((completedCount / modules.length) * 100);

    return {
      ...app,
      overallProgress: newProgress,
      certificateIssuedAt: newProgress === 100 ? (app.certificateIssuedAt || new Date().toISOString().slice(0, 10)) : undefined
    };
  };

  // Handler for completing a quiz
  const handleCompleteQuiz = (moduleId: string, score: number) => {
    setApprentices(prev => prev.map(app => {
      if (app.id !== currentApprentice.id) return app;

      const mId = moduleId as ModuleId;
      const isApproved = score >= 80;
      const targetModule = INDUCTION_MODULES.find(m => m.id === mId);

      const updatedScores = {
        ...app.quizScores,
        [mId]: Math.max(score, app.quizScores[mId] || 0)
      };

      const updatedStatus = {
        ...app.moduleStatus,
        [mId]: isApproved ? 'completed' : 'in_progress'
      };

      const newBadges = [...app.badgesEarned];
      if (isApproved && targetModule && !newBadges.includes(targetModule.badge.title)) {
        newBadges.push(targetModule.badge.title);
      }

      const updatedApp: ApprenticeProgress = {
        ...app,
        quizScores: updatedScores,
        moduleStatus: updatedStatus as Record<ModuleId, 'pending' | 'in_progress' | 'completed'>,
        badgesEarned: newBadges,
        lastActive: 'Hace un momento'
      };

      return recalculateProgress(updatedApp);
    }));
  };

  // Handler for solving a case in the simulator
  const handleSolveCase = (caseId: string) => {
    setApprentices(prev => prev.map(app => {
      if (app.id !== currentApprentice.id) return app;
      if (app.completedCases.includes(caseId)) return app;

      return {
        ...app,
        completedCases: [...app.completedCases, caseId],
        moduleStatus: {
          ...app.moduleStatus,
          normativa: app.moduleStatus.normativa === 'pending' ? 'in_progress' : app.moduleStatus.normativa
        }
      };
    }));
  };

  // Instructor adds note
  const handleUpdateApprenticeNote = (apprenticeId: string, note: string) => {
    setApprentices(prev => prev.map(a => {
      if (a.id !== apprenticeId) return a;
      return {
        ...a,
        instructorNotes: [note, ...(a.instructorNotes || [])]
      };
    }));
  };

  // Instructor registers new apprentice
  const handleAddApprentice = (newApp: ApprenticeProgress) => {
    setApprentices(prev => [newApp, ...prev]);
  };

  const handleToggleRole = () => {
    if (activeRole === 'aprendiz') {
      setActiveRole('instructor');
      setCurrentTab('seguimiento');
    } else {
      setActiveRole('aprendiz');
      setCurrentTab('aprendiz');
      setStudentSubView('dashboard');
    }
  };

  const handleOpenModule = (moduleId: ModuleId) => {
    if (moduleId === 'identidad') {
      setCurrentTab('identidad');
    } else if (moduleId === 'normativa') {
      setCurrentTab('normativa');
    } else {
      setCurrentTab('aprendiz');
      setStudentSubView(moduleId);
    }
  };

  const handleSaveApprenticeAndEnter = (savedApprentice: ApprenticeProgress) => {
    setApprentices(prev => {
      const idx = prev.findIndex(a => a.id === savedApprentice.id || a.documentNumber === savedApprentice.documentNumber);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedApprentice;
        return next;
      }
      return [savedApprentice, ...prev];
    });

    setCurrentApprenticeId(savedApprentice.id);
    setActiveRole('aprendiz');
    setCurrentTab('aprendiz');
    setStudentSubView('dashboard');
    setIsLandingView(false);
  };

  // If landing page is active, show the entry portal with role selection
  if (isLandingView) {
    return (
      <div className={`min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-500 relative ${
        isBlurringTheme ? 'filter blur-[8px] transition-all duration-300 ease-out' : 'transition-all duration-300 ease-in'
      }`}>
        {/* Cinematic Blur Overlay on theme change */}
        <div
          className={`fixed inset-0 z-[100] pointer-events-none transition-all duration-300 backdrop-blur-xl ${
            isBlurringTheme
              ? 'opacity-100 bg-neutral-900/20 dark:bg-black/30'
              : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden="true"
        />

        <LandingPage
          apprentices={apprentices}
          selectedApprenticeId={currentApprenticeId}
          onSaveApprenticeAndEnter={handleSaveApprenticeAndEnter}
          onEnterAsInstructor={() => {
            setActiveRole('instructor');
            setCurrentTab('seguimiento');
            setIsLandingView(false);
          }}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          onOpenManual={() => setShowManualVideo(true)}
        />

        {/* Manual Video Modal when on Landing Page */}
        {showManualVideo && (
          <VideoModal
            videoUrl="/assets/aistudio/2026__5_17_p.m._2858c9bb.mp4"
            onClose={() => setShowManualVideo(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-500 relative ${
      isBlurringTheme ? 'filter blur-[8px] transition-all duration-300 ease-out' : 'transition-all duration-300 ease-in'
    }`}>
      {/* Cinematic Blur Overlay on theme change */}
      <div
        className={`fixed inset-0 z-[100] pointer-events-none transition-all duration-300 backdrop-blur-xl ${
          isBlurringTheme
            ? 'opacity-100 bg-neutral-900/20 dark:bg-black/30'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Top Navbar with Dark Mode Toggle */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'aprendiz') setStudentSubView('dashboard');
        }}
        activeRole={activeRole}
        onToggleRole={handleToggleRole}
        progressPercent={currentApprentice.overallProgress}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onGoToLanding={() => setIsLandingView(true)}
        onOpenManual={() => setShowManualVideo(true)}
      />

      {/* Quick Apprentice Switcher Bar (Useful for testing & evaluation of prototype) */}
      <div className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-2 px-4 sm:px-6 lg:px-8 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">Aprendiz en sesión:</span>
          <select
            value={currentApprenticeId}
            onChange={(e) => setCurrentApprenticeId(e.target.value)}
            className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded px-2.5 py-1 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
          >
            {apprentices.map((app) => (
              <option key={app.id} value={app.id}>
                {app.name} — {app.overallProgress}% ({app.overallProgress === 100 ? 'Certificado' : 'En proceso'})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-neutral-500">
          <button
            type="button"
            onClick={() => setShowProfileModal(true)}
            className="text-xs font-semibold text-[#39A900] hover:underline flex items-center gap-1 cursor-pointer"
            title="Ver o modificar los datos de identificación del aprendiz"
          >
            <span>👤 Ver / Editar Perfil</span>
          </button>
          <span aria-hidden="true">·</span>
          <span>Doc: <strong>{currentApprentice.documentType || 'CC'} {currentApprentice.documentNumber}</strong></span>
          <span aria-hidden="true">·</span>
          <span>Ficha: <strong>{currentApprentice.ficha}</strong></span>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB: Aprendiz Dashboard & sub-views */}
        {currentTab === 'aprendiz' && (
          <div>
            {studentSubView === 'dashboard' && (
              <StudentDashboard
                apprentice={currentApprentice}
                onOpenModule={handleOpenModule}
                onOpenQuiz={(mId) => {
                  const m = INDUCTION_MODULES.find(mod => mod.id === mId);
                  if (m) setActiveQuizModule(m);
                }}
                onOpenCertificate={() => setCertificateApprentice(currentApprentice)}
                onOpenTrivia={() => setCurrentTab('trivia')}
                onOpenProfile={() => setShowProfileModal(true)}
              />
            )}

            {studentSubView === 'etapas' && (
              <div className="space-y-6">
                <button
                  onClick={() => setStudentSubView('dashboard')}
                  className="text-xs font-semibold text-[#39A900] hover:underline flex items-center gap-1"
                >
                  ← Volver al Panel de Inducción
                </button>
                <FormationStagesView
                  onStartQuiz={() => {
                    const m = INDUCTION_MODULES.find(mod => mod.id === 'etapas');
                    if (m) setActiveQuizModule(m);
                  }}
                  isModuleCompleted={currentApprentice.moduleStatus.etapas === 'completed'}
                  score={currentApprentice.quizScores.etapas}
                />
              </div>
            )}

            {studentSubView === 'bienestar' && (
              <div className="space-y-6">
                <button
                  onClick={() => setStudentSubView('dashboard')}
                  className="text-xs font-semibold text-[#39A900] hover:underline flex items-center gap-1"
                >
                  ← Volver al Panel de Inducción
                </button>
                <BienestarView
                  onStartQuiz={() => {
                    const m = INDUCTION_MODULES.find(mod => mod.id === 'bienestar');
                    if (m) setActiveQuizModule(m);
                  }}
                  isModuleCompleted={currentApprentice.moduleStatus.bienestar === 'completed'}
                  score={currentApprentice.quizScores.bienestar}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB: Identidad Institucional */}
        {currentTab === 'identidad' && (
          <InstitutionalIdentityView
            onStartQuiz={() => {
              const m = INDUCTION_MODULES.find(mod => mod.id === 'identidad');
              if (m) setActiveQuizModule(m);
            }}
            isModuleCompleted={currentApprentice.moduleStatus.identidad === 'completed'}
            score={currentApprentice.quizScores.identidad}
          />
        )}

        {/* TAB: Normativa & Reglamento */}
        {currentTab === 'normativa' && (
          <RegulationsView
            onStartQuiz={() => {
              const m = INDUCTION_MODULES.find(mod => mod.id === 'normativa');
              if (m) setActiveQuizModule(m);
            }}
            isModuleCompleted={currentApprentice.moduleStatus.normativa === 'completed'}
            score={currentApprentice.quizScores.normativa}
            completedCases={currentApprentice.completedCases}
            onSolveCase={handleSolveCase}
          />
        )}

        {/* TAB: Trivia Relámpago */}
        {currentTab === 'trivia' && (
          <TriviaChallenge />
        )}

        {/* TAB: Asistente IA */}
        {currentTab === 'asistente' && (
          <InductionAIAssistant />
        )}

        {/* TAB: Panel de Seguimiento (Instructor) */}
        {currentTab === 'seguimiento' && (
          <InstructorDashboard
            apprentices={apprentices}
            onSelectApprentice={(app) => {
              setCurrentApprenticeId(app.id);
              setCurrentTab('aprendiz');
              setStudentSubView('dashboard');
            }}
            onUpdateApprenticeNote={handleUpdateApprenticeNote}
            onViewCertificate={(app) => setCertificateApprentice(app)}
            onAddApprentice={handleAddApprentice}
          />
        )}
      </main>

      {/* Quiz Modal */}
      {activeQuizModule && (
        <QuizModal
          module={activeQuizModule}
          onClose={() => setActiveQuizModule(null)}
          onCompleteQuiz={handleCompleteQuiz}
          previousScore={currentApprentice.quizScores[activeQuizModule.id]}
        />
      )}

      {/* Official Certificate Modal */}
      {certificateApprentice && (
        <CertificateModal
          apprentice={certificateApprentice}
          onClose={() => setCertificateApprentice(null)}
        />
      )}

      {/* Apprentice Profile Modal */}
      {showProfileModal && (
        <ApprenticeProfileModal
          apprentice={currentApprentice}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onSave={(updated) => {
            setApprentices(prev => prev.map(a => a.id === updated.id ? updated : a));
          }}
        />
      )}

      {/* Manual Video Modal */}
      {showManualVideo && (
        <VideoModal
          videoUrl="/assets/aistudio/2026__5_17_p.m._2858c9bb.mp4"
          onClose={() => setShowManualVideo(false)}
        />
      )}

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-8 px-4 sm:px-6 lg:px-8 text-xs text-neutral-500">
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
            <span>Reglamento del Aprendiz (Acuerdo 007 de 2012)</span>
            <span aria-hidden="true">·</span>
            <span>Plataforma de Inducción y Seguimiento Curricular</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
