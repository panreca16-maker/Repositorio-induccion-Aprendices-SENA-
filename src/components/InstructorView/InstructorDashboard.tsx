import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Award,
  Download,
  Search,
  Filter,
  FileText,
  UserPlus,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  Eye,
  Plus
} from 'lucide-react';
import { ApprenticeProgress } from '../../types/induction';

interface InstructorDashboardProps {
  apprentices: ApprenticeProgress[];
  onSelectApprentice: (apprentice: ApprenticeProgress) => void;
  onUpdateApprenticeNote: (apprenticeId: string, note: string) => void;
  onViewCertificate: (apprentice: ApprenticeProgress) => void;
  onAddApprentice: (newApprentice: ApprenticeProgress) => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  apprentices,
  onSelectApprentice,
  onUpdateApprenticeNote,
  onViewCertificate,
  onAddApprentice
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'at_risk'>('all');
  const [selectedApprenticeForNote, setSelectedApprenticeForNote] = useState<ApprenticeProgress | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New apprentice form state
  const [newForm, setNewForm] = useState({
    name: '',
    documentNumber: '',
    email: '',
    ficha: '2824910',
    programName: 'Tecnología en Análisis y Desarrollo de Software (ADSO)',
    sede: 'Complejo Central - Centro de Tecnologías de Información'
  });

  // Calculate cohort metrics
  const total = apprentices.length;
  const certifiedCount = apprentices.filter(a => a.overallProgress === 100).length;
  const atRiskCount = apprentices.filter(a => a.attendanceStatus === 'inasistencia_injustificada' || a.overallProgress < 30).length;
  const avgProgress = total > 0 ? Math.round(apprentices.reduce((acc, a) => acc + a.overallProgress, 0) / total) : 0;

  // Filter apprentices
  const filteredApprentices = apprentices.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.documentNumber.includes(searchTerm) ||
                          app.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'completed') return app.overallProgress === 100;
    if (statusFilter === 'in_progress') return app.overallProgress > 0 && app.overallProgress < 100 && app.attendanceStatus !== 'inasistencia_injustificada';
    if (statusFilter === 'at_risk') return app.attendanceStatus === 'inasistencia_injustificada' || app.overallProgress < 30;

    return true;
  });

  // Export to CSV report
  const handleExportCSV = () => {
    const headers = ['Nombre,Documento,Email,Ficha,Programa,Progreso(%),Identidad(%),Normativa(%),Etapas(%),Bienestar(%),Asistencia,Certificado'];
    const rows = apprentices.map(a => [
      `"${a.name}"`,
      a.documentNumber,
      a.email,
      a.ficha,
      `"${a.programName}"`,
      a.overallProgress,
      a.quizScores.identidad ?? 'N/A',
      a.quizScores.normativa ?? 'N/A',
      a.quizScores.etapas ?? 'N/A',
      a.quizScores.bienestar ?? 'N/A',
      a.attendanceStatus,
      a.overallProgress === 100 ? 'Si' : 'No'
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SENA_Seguimiento_Induccion_Ficha_2824910_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveNote = () => {
    if (selectedApprenticeForNote && newNoteText.trim()) {
      onUpdateApprenticeNote(selectedApprenticeForNote.id, newNoteText.trim());
      setNewNoteText('');
      setSelectedApprenticeForNote(null);
    }
  };

  const handleCreateApprentice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.documentNumber) return;

    const newApp: ApprenticeProgress = {
      id: `app_${Date.now()}`,
      name: newForm.name,
      documentNumber: newForm.documentNumber,
      email: newForm.email || `${newForm.name.toLowerCase().replace(/\s+/g, '.')}@misena.edu.co`,
      ficha: newForm.ficha,
      programName: newForm.programName,
      sede: newForm.sede,
      overallProgress: 0,
      moduleStatus: {
        identidad: 'pending',
        normativa: 'pending',
        etapas: 'pending',
        bienestar: 'pending'
      },
      quizScores: {
        identidad: null,
        normativa: null,
        etapas: null,
        bienestar: null
      },
      completedCases: [],
      badgesEarned: [],
      lastActive: 'Recién registrado',
      attendanceStatus: 'presente'
    };

    onAddApprentice(newApp);
    setShowAddModal(false);
    setNewForm({
      name: '',
      documentNumber: '',
      email: '',
      ficha: '2824910',
      programName: 'Tecnología en Análisis y Desarrollo de Software (ADSO)',
      sede: 'Complejo Central - Centro de Tecnologías de Información'
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#39A900] uppercase tracking-wider mb-1">
              <span>Panel de Instructor y Coordinación Misional</span>
              <span aria-hidden="true">·</span>
              <span>Seguimiento de Inducción</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100">
              Cohorte Ficha 2824910 · ADSO
            </h1>
            <p className="text-xs md:text-sm text-neutral-500 mt-1">
              Monitoreo en tiempo real de avance curricular, evaluaciones de normativa y novedades de inducción.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#39A900]" />
              <span>Registrar Aprendiz</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#329600] rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Informe CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cohort KPIs Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1">
          <span className="text-xs font-medium text-neutral-500">Total Aprendices</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
            {total}
          </div>
          <span className="text-[11px] text-neutral-400 block pt-1">
            Ficha 2824910 activa
          </span>
        </div>

        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1">
          <span className="text-xs font-medium text-neutral-500">Avance Promedio</span>
          <div className="text-2xl font-bold font-mono text-[#39A900] tabular-nums">
            {avgProgress}%
          </div>
          <span className="text-[11px] text-neutral-400 block pt-1">
            En los 4 módulos de inducción
          </span>
        </div>

        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1">
          <span className="text-xs font-medium text-neutral-500">Inducción Aprobada</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
            {certifiedCount}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block pt-1">
            Listos para etapa lectiva
          </span>
        </div>

        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1">
          <span className="text-xs font-medium text-neutral-500">Alertas Tempranas</span>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
            {atRiskCount}
          </div>
          <span className="text-[11px] text-neutral-400 block pt-1">
            Inasistencias o rezago
          </span>
        </div>
      </div>

      {/* Roster Controls & Filter */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre, documento o correo institucional..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
            />
          </div>

          {/* Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Todos ({total})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                statusFilter === 'completed'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Completados ({certifiedCount})
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                statusFilter === 'in_progress'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              En Curso
            </button>
            <button
              onClick={() => setStatusFilter('at_risk')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                statusFilter === 'at_risk'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              En Riesgo ({atRiskCount})
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-850 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3.5 px-5">Aprendiz & Documento</th>
                <th className="py-3.5 px-4 text-center">Progreso</th>
                <th className="py-3.5 px-4 text-center">Identidad</th>
                <th className="py-3.5 px-4 text-center">Normativa</th>
                <th className="py-3.5 px-4 text-center">Etapas</th>
                <th className="py-3.5 px-4 text-center">Bienestar</th>
                <th className="py-3.5 px-4">Asistencia</th>
                <th className="py-3.5 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredApprentices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-neutral-500">
                    No se encontraron aprendices con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredApprentices.map((app) => {
                  const isDone = app.overallProgress === 100;

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      {/* Name & ID */}
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {app.name}
                        </div>
                        <div className="text-[11px] text-neutral-500 font-mono">
                          CC/TI: {app.documentNumber} · {app.email}
                        </div>
                      </td>

                      {/* Overall Progress */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <span className="font-mono font-bold tabular-nums text-neutral-800 dark:text-neutral-200">
                            {app.overallProgress}%
                          </span>
                        </div>
                        <div className="w-16 mx-auto bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-[#39A900]"
                            style={{ width: `${app.overallProgress}%` }}
                          />
                        </div>
                      </td>

                      {/* Module 1 Score */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        {app.quizScores.identidad !== null ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{app.quizScores.identidad}%</span>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>

                      {/* Module 2 Score */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        {app.quizScores.normativa !== null ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{app.quizScores.normativa}%</span>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>

                      {/* Module 3 Score */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        {app.quizScores.etapas !== null ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{app.quizScores.etapas}%</span>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>

                      {/* Module 4 Score */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        {app.quizScores.bienestar !== null ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{app.quizScores.bienestar}%</span>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>

                      {/* Attendance status */}
                      <td className="py-3.5 px-4">
                        {app.attendanceStatus === 'presente' ? (
                          <span className="text-xs text-neutral-700 dark:text-neutral-300">
                            Asistencia al día
                          </span>
                        ) : app.attendanceStatus === 'inasistencia_justificada' ? (
                          <span className="text-xs text-amber-700 dark:text-amber-400">
                            Excusa médica radicada
                          </span>
                        ) : app.attendanceStatus === 'inasistencia_injustificada' ? (
                          <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                            Inasistencia injustificada
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400">Pendiente</span>
                        )}
                        {app.instructorNotes && app.instructorNotes.length > 0 && (
                          <span className="block text-[10px] text-neutral-400 truncate max-w-[140px]" title={app.instructorNotes[0]}>
                            Obs: {app.instructorNotes[0]}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedApprenticeForNote(app)}
                            className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="Añadir nota u observación pedagógica"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {isDone && (
                            <button
                              onClick={() => onViewCertificate(app)}
                              className="p-1.5 text-[#39A900] hover:text-[#329600] rounded hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                              title="Ver Constancia Oficial de Inducción"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note / Pedagogy Observation Modal */}
      {selectedApprenticeForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-lg w-full space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Registrar Novedad / Observación Formativa
            </h3>
            <p className="text-xs text-neutral-500">
              Aprendiz: <strong>{selectedApprenticeForNote.name}</strong> (CC: {selectedApprenticeForNote.documentNumber})
            </p>

            {selectedApprenticeForNote.instructorNotes && selectedApprenticeForNote.instructorNotes.length > 0 && (
              <div className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg text-xs space-y-1">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Historial de notas:</span>
                {selectedApprenticeForNote.instructorNotes.map((note, i) => (
                  <p key={i} className="text-neutral-600 dark:text-neutral-400">· {note}</p>
                ))}
              </div>
            )}

            <textarea
              rows={3}
              placeholder="Ejemplo: Se concertó plan de mejoramiento para el módulo de normativa. Justificó inasistencia del 09/11..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              className="w-full p-3 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedApprenticeForNote(null)}
                className="px-3.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNote}
                disabled={!newNoteText.trim()}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#329600] rounded-md transition-colors disabled:opacity-40"
              >
                Guardar Novedad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Apprentice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateApprentice}
            className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-md w-full space-y-4"
          >
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Vincular Nuevo Aprendiz a la Ficha 2824910
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Laura Camila Vargas"
                  value={newForm.name}
                  onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1">Documento de Identidad (CC/TI)</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 1045928103"
                  value={newForm.documentNumber}
                  onChange={(e) => setNewForm({ ...newForm, documentNumber: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1">Correo Institucional / Personal</label>
                <input
                  type="email"
                  placeholder="Ej: lvargas@misena.edu.co"
                  value={newForm.email}
                  onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#39A900]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#329600] rounded-md transition-colors"
              >
                Registrar Aprendiz
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
