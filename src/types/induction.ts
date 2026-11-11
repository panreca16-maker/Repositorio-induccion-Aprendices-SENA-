export type ModuleId = 'identidad' | 'normativa' | 'etapas' | 'bienestar';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  articleRef?: string;
}

export interface InductionModule {
  id: ModuleId;
  title: string;
  shortDescription: string;
  durationMinutes: number;
  iconName: string;
  color: string;
  topicsCount: number;
  badge: {
    title: string;
    description: string;
    icon: string;
  };
  quiz: QuizQuestion[];
}

export interface ApprenticeCaseDilemma {
  id: string;
  title: string;
  category: 'académica' | 'disciplinaria' | 'etapa_productiva' | 'seguridad';
  context: string;
  scenario: string;
  options: {
    id: string;
    text: string;
    isOptimal: boolean;
    consequence: string;
    normativeFeedback: string;
    ruleArticle: string;
  }[];
}

export interface ApprenticeProgress {
  id: string;
  name: string;
  documentType?: 'CC' | 'TI' | 'CE' | 'PPT' | string;
  documentNumber: string;
  email: string;
  phone?: string;
  ficha: string;
  programName: string;
  sede: string;
  regional?: string;
  jornada?: 'Diurna' | 'Nocturna' | 'Mixta' | 'Virtual' | string;
  overallProgress: number; // 0 - 100
  moduleStatus: Record<ModuleId, 'pending' | 'in_progress' | 'completed'>;
  quizScores: Record<ModuleId, number | null>; // score 0 - 100
  completedCases: string[];
  badgesEarned: string[];
  lastActive: string;
  attendanceStatus: 'presente' | 'inasistencia_justificada' | 'inasistencia_injustificada' | 'pendiente';
  instructorNotes?: string[];
  certificateIssuedAt?: string;
}

export interface CohortMetrics {
  totalApprentices: number;
  completionRate: number;
  averageScore: number;
  certifiedCount: number;
  atRiskCount: number;
}
