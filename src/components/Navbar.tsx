import React from 'react';
import { UserCheck, Shield, GraduationCap, Trophy, HelpCircle, Sun, Moon, Home } from 'lucide-react';
import { SENA_LOGO_SVG } from '../data/senaData';

interface NavbarProps {
  currentTab: 'aprendiz' | 'identidad' | 'normativa' | 'seguimiento' | 'trivia' | 'asistente';
  onSelectTab: (tab: 'aprendiz' | 'identidad' | 'normativa' | 'seguimiento' | 'trivia' | 'asistente') => void;
  activeRole: 'aprendiz' | 'instructor';
  onToggleRole: () => void;
  progressPercent: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onGoToLanding: () => void;
  onOpenManual: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeRole,
  onToggleRole,
  progressPercent,
  isDark,
  onToggleTheme,
  onGoToLanding,
  onOpenManual
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <button
          onClick={onGoToLanding}
          className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0 cursor-pointer"
          title="Ir a la página de inicio y selección de roles"
        >
          <img
            src={SENA_LOGO_SVG}
            alt="Logo SENA"
            className="w-8 h-8 object-contain shrink-0"
          />
          <span className="font-display font-bold text-lg tracking-tight text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
            SENA Inducción
          </span>
        </button>

        {/* Zone 2: Navigation links (single line, clean typography) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <button
            onClick={() => onSelectTab('aprendiz')}
            className={`whitespace-nowrap transition-colors hover:text-[#39A900] ${
              currentTab === 'aprendiz' ? 'text-[#39A900] font-semibold underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Mi Inducción
          </button>
          <button
            onClick={() => onSelectTab('identidad')}
            className={`whitespace-nowrap transition-colors hover:text-[#39A900] ${
              currentTab === 'identidad' ? 'text-[#39A900] font-semibold underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Identidad SENA
          </button>
          <button
            onClick={() => onSelectTab('normativa')}
            className={`whitespace-nowrap transition-colors hover:text-[#39A900] ${
              currentTab === 'normativa' ? 'text-[#39A900] font-semibold underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Reglamento & Casos
          </button>
          <button
            onClick={() => onSelectTab('trivia')}
            className={`whitespace-nowrap transition-colors hover:text-[#39A900] ${
              currentTab === 'trivia' ? 'text-[#39A900] font-semibold underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Trivia Relámpago
          </button>
          <button
            onClick={() => onSelectTab('asistente')}
            className={`whitespace-nowrap transition-colors hover:text-[#39A900] ${
              currentTab === 'asistente' ? 'text-[#39A900] font-semibold underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Tutor IA
          </button>
          <button
            onClick={() => onSelectTab('seguimiento')}
            className={`whitespace-nowrap transition-colors hover:text-[#39A900] ${
              currentTab === 'seguimiento' ? 'text-[#39A900] font-semibold underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Panel Seguimiento
          </button>
        </nav>

        {/* Zone 3: Actions (Role switcher, Cambiar Rol, Dark Mode toggle) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleRole}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            title="Alternar entre vista de aprendiz y panel de instructor"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#39A900]" />
            <span>Rol: <strong className="font-semibold">{activeRole === 'aprendiz' ? 'Aprendiz' : 'Instructor'}</strong></span>
          </button>

          <button
            onClick={onOpenManual}
            className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-[#39A900] transition-colors"
            title="Ver video del manual de la plataforma"
            aria-label="Ver video del manual"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <button
            onClick={onGoToLanding}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            title="Ir a la pantalla de selección de roles (Landing)"
          >
            <Home className="w-3.5 h-3.5 text-neutral-500" />
            <span>Inicio / Roles</span>
          </button>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-all shadow-xs flex items-center justify-center cursor-pointer"
            title={isDark ? "Cambiar a modo claro" : "Activar modo oscuro"}
            aria-label="Alternar modo oscuro"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-once" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-700" />
            )}
          </button>
        </div>
      </div>

      {/* Subtle apprentice progress hairline indicator */}
      {activeRole === 'aprendiz' && (
        <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1">
          <div
            className="h-full bg-[#39A900] transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </header>
  );
};
