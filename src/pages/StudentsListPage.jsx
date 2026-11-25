import { Database, Eye, Pencil, Search, Trash2, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal.jsx';
import { WorkspaceLayout } from '../components/WorkspaceLayout.jsx';
import { PROGRAMS, STATUSES } from '../constants/students.js';
import { useStudents } from '../context/StudentContext.jsx';
import { filterAndSortStudents } from '../utils/students.js';

const STATUS_TEXT_CLASS = {
  Actif: 'text-emerald-700 font-medium',
  'En stage': 'text-blue-700 font-medium',
  Diplômé: 'text-slate-700 font-medium',
  Suspendu: 'text-red-700 font-medium',
};

export function StudentsListPage() {
  const { students, loading, mutating, error, deleteStudent, seedSampleStudents } = useStudents();
  const [query, setQuery] = useState('');
  const [program, setProgram] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [studentToDelete, setStudentToDelete] = useState(null);

  const filteredStudents = useMemo(
    () => filterAndSortStudents(students, { query, program, status, sortBy }),
    [students, query, program, status, sortBy]
  );

  const hasActiveFilters = query.trim() !== '' || program !== 'all' || status !== 'all';

  const resetFilters = () => {
    setQuery('');
    setProgram('all');
    setStatus('all');
    setSortBy('name');
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    await deleteStudent(studentToDelete.id);
    setStudentToDelete(null);
  };

  return (
    <WorkspaceLayout
      breadcrumb={['Espace de gestion', 'Étudiants']}
      primaryAction={{ label: 'Nouvel étudiant', to: '/students/new' }}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Liste des étudiants
            </h1>
            <p className="mt-1 text-sm text-slate-600 tabular-nums">
              {filteredStudents.length}{' '}
              {filteredStudents.length > 1 ? 'dossiers affichés' : 'dossier affiché'} sur{' '}
              {students.length}
            </p>
          </div>
        </div>

        {error && (
          <div role="alert" className="p-4 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Search & Filters toolbar */}
        <section
          aria-label="Recherche et filtres"
          className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <label htmlFor="students-search" className="sr-only">
                Rechercher un étudiant
              </label>
              <Search
                aria-hidden="true"
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <input
                id="students-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher par nom, matricule, email ou filière…"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="md:col-span-3">
              <label htmlFor="students-program-filter" className="sr-only">
                Filtrer par filière
              </label>
              <select
                id="students-program-filter"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Toutes les filières</option>
                {PROGRAMS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label htmlFor="students-sort" className="sr-only">
                Trier les résultats
              </label>
              <select
                id="students-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              >
                <option value="name">Trier par nom (A–Z)</option>
                <option value="gpa">Trier par moyenne (/20)</option>
                <option value="recent">Mises à jour récentes</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="group"
              aria-label="Filtrer par statut"
              className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full"
            >
              {['all', ...STATUSES].map((item) => {
                const active = status === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStatus(item)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item === 'all' ? 'Tous' : item}
                  </button>
                );
              })}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-medium text-blue-700 hover:text-blue-800 underline underline-offset-2 whitespace-nowrap"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </section>

        {/* Data views */}
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="h-10 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-2">
              Aucun étudiant dans la base
            </h2>
            <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
              Ajoutez un premier étudiant manuellement ou chargez un jeu de dossiers d’exemple pour
              tester la recherche et les fiches détaillées.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/students/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                <span>Ajouter un étudiant</span>
              </Link>
              <button
                type="button"
                disabled={mutating}
                onClick={() => void seedSampleStudents()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Database className="w-4 h-4 shrink-0" />
                <span>{mutating ? 'Importation…' : 'Charger 10 dossiers exemples'}</span>
              </button>
            </div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-2">
              Aucun résultat correspondant
            </h2>
            <p className="text-sm text-slate-600 mb-5">
              Aucun étudiant ne correspond aux critères de recherche sélectionnés.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Effacer la recherche
            </button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-medium text-slate-500">
                    <th className="py-3 px-4">Matricule</th>
                    <th className="py-3 px-4">Étudiant</th>
                    <th className="py-3 px-4">Filière et niveau</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-right">Moyenne</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {filteredStudents.map((student) => {
                    const fullName = `${student.firstName} ${student.lastName}`;
                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                          {student.matricule}
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            to={`/students/${student.id}`}
                            className="font-medium text-slate-900 hover:text-blue-700 transition-colors"
                          >
                            {fullName}
                          </Link>
                          <p className="text-xs text-slate-500 truncate max-w-[240px]">
                            {student.email}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          <span>{student.program}</span>
                          <span aria-hidden="true" className="text-slate-400">
                            {' '}
                            ·{' '}
                          </span>
                          <span className="font-mono text-xs text-slate-600">{student.level}</span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`text-xs ${STATUS_TEXT_CLASS[student.status] ?? 'text-slate-700'}`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-900 tabular-nums whitespace-nowrap">
                          {student.gpa.toFixed(2)}/20
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-1">
                            <Link
                              to={`/students/${student.id}`}
                              aria-label={`Détails de ${fullName}`}
                              title="Détails"
                              className="p-2 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/students/${student.id}/edit`}
                              aria-label={`Modifier ${fullName}`}
                              title="Modifier"
                              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setStudentToDelete(student)}
                              aria-label={`Supprimer ${fullName}`}
                              title="Supprimer"
                              className="p-2 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked list */}
            <ul className="md:hidden divide-y divide-slate-200">
              {filteredStudents.map((student) => {
                const fullName = `${student.firstName} ${student.lastName}`;
                return (
                  <li key={student.id} className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/students/${student.id}`}
                          className="font-medium text-slate-900 hover:text-blue-700 block truncate"
                        >
                          {fullName}
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5">
                          <span className="font-mono tabular-nums">{student.matricule}</span>
                          <span aria-hidden="true"> · </span>
                          <span>{student.level}</span>
                          <span aria-hidden="true"> · </span>
                          <span className={STATUS_TEXT_CLASS[student.status] ?? 'text-slate-700'}>
                            {student.status}
                          </span>
                        </p>
                      </div>
                      <span className="font-mono text-sm font-semibold text-slate-900 tabular-nums shrink-0">
                        {student.gpa.toFixed(1)}/20
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate">{student.program}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        to={`/students/${student.id}`}
                        aria-label={`Détails de ${fullName}`}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
                      >
                        Détails
                      </Link>
                      <Link
                        to={`/students/${student.id}/edit`}
                        aria-label={`Modifier ${fullName}`}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
                      >
                        Modifier
                      </Link>
                      <button
                        type="button"
                        onClick={() => setStudentToDelete(student)}
                        aria-label={`Supprimer ${fullName}`}
                        className="px-3 py-1.5 text-xs font-medium text-red-700 border border-red-200 rounded-lg hover:bg-red-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        open={Boolean(studentToDelete)}
        studentName={
          studentToDelete ? `${studentToDelete.firstName} ${studentToDelete.lastName}` : ''
        }
        matricule={studentToDelete?.matricule ?? ''}
        isDeleting={mutating}
        onCancel={() => setStudentToDelete(null)}
        onConfirm={() => void handleConfirmDelete()}
      />
    </WorkspaceLayout>
  );
}
