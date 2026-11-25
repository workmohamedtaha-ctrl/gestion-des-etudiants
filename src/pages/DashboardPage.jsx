import { ArrowRight, Database, UserPlus } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { WorkspaceLayout } from '../components/WorkspaceLayout.jsx';
import { useStudents } from '../context/StudentContext.jsx';
import { computeDashboardMetrics, getAcademicMention } from '../utils/students.js';

const STATUS_COLORS = {
  Actif: 'text-emerald-700',
  'En stage': 'text-blue-700',
  Diplômé: 'text-slate-700',
  Suspendu: 'text-red-700',
};

export function DashboardPage() {
  const { students, loading, mutating, error, seedSampleStudents } = useStudents();

  const metrics = useMemo(() => computeDashboardMetrics(students), [students]);

  return (
    <WorkspaceLayout
      breadcrumb={['Espace de gestion', 'Tableau de bord']}
      primaryAction={{ label: 'Nouvel étudiant', to: '/students/new' }}
    >
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600">
            Synthèse des effectifs, des résultats académiques et des dossiers récents.
          </p>
        </div>

        {error && (
          <div role="alert" className="p-4 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="h-28 bg-white border border-slate-200 rounded-xl p-5 animate-pulse"
              >
                <div className="h-3.5 w-24 bg-slate-200 rounded mb-4" />
                <div className="h-7 w-16 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center max-w-2xl mx-auto">
            <h2 className="font-display text-xl font-semibold text-slate-900 mb-2">
              Aucun dossier étudiant enregistré
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Votre annuaire est vide pour le moment. Créez votre premier dossier étudiant ou
              importez un jeu de 10 dossiers exemples pour démarrer rapidement.
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
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <Database className="w-4 h-4 shrink-0" />
                <span>{mutating ? 'Importation…' : 'Charger 10 dossiers exemples'}</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 4-column KPI strip */}
            <section
              aria-label="Indicateurs clés"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-medium text-slate-500 mb-2">Effectif total</p>
                <p
                  data-testid="kpi-total-students"
                  className="font-mono text-3xl font-semibold text-slate-900 tabular-nums"
                >
                  {metrics.totalCount}
                </p>
                <p className="mt-2 text-xs text-slate-500">Dossiers dans l’annuaire</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-medium text-slate-500 mb-2">Étudiants actifs</p>
                <p className="font-mono text-3xl font-semibold text-slate-900 tabular-nums">
                  {metrics.activeCount}
                </p>
                <p className="mt-2 text-xs text-slate-500 tabular-nums">
                  {metrics.internshipCount} en stage · {metrics.graduatedCount} diplômés
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-medium text-slate-500 mb-2">Moyenne générale</p>
                <p className="font-mono text-3xl font-semibold text-slate-900 tabular-nums">
                  {metrics.averageGpa.toFixed(2)}
                  <span className="text-base font-normal text-slate-400"> /20</span>
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Mention globale : {getAcademicMention(metrics.averageGpa)}
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-medium text-slate-500 mb-2">
                  Mentions Bien et Très bien
                </p>
                <p className="font-mono text-3xl font-semibold text-slate-900 tabular-nums">
                  {metrics.honorsCount}
                </p>
                <p className="mt-2 text-xs text-slate-500 tabular-nums">
                  Moyenne supérieure ou égale à 14/20
                </p>
              </div>
            </section>

            {/* Distribution + Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-slate-900">
                      Répartition par filière
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Effectifs et moyenne académique par spécialité
                    </p>
                  </div>
                  <Link
                    to="/students"
                    className="text-sm font-medium text-blue-700 hover:text-blue-800 whitespace-nowrap"
                  >
                    Voir l’annuaire
                  </Link>
                </div>

                <div className="space-y-5">
                  {metrics.programBreakdown.map((item) => (
                    <div key={item.program} className="space-y-1.5">
                      <div className="flex items-baseline justify-between gap-4 text-sm">
                        <span className="font-medium text-slate-800 truncate">{item.program}</span>
                        <span className="font-mono text-xs text-slate-600 tabular-nums shrink-0">
                          {item.count} {item.count > 1 ? 'étudiants' : 'étudiant'} ({item.sharePercent}%)
                          {item.count > 0 ? ` · ${item.averageGpa.toFixed(1)}/20` : ''}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-700 rounded-full transition-all"
                          style={{ width: `${item.sharePercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <h2 className="font-display text-lg font-semibold text-slate-900">
                    Dossiers récents
                  </h2>
                  <Link
                    to="/students"
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800 whitespace-nowrap"
                  >
                    <span>Tout afficher</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <ul className="divide-y divide-slate-200">
                  {metrics.recentStudents.map((student) => (
                    <li key={student.id} className="py-3.5 first:pt-0 last:pb-0">
                      <Link
                        to={`/students/${student.id}`}
                        className="flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            <span className="font-mono tabular-nums">{student.matricule}</span>
                            <span aria-hidden="true"> · </span>
                            <span>{student.level}</span>
                            <span aria-hidden="true"> · </span>
                            <span className={STATUS_COLORS[student.status] ?? 'text-slate-600'}>
                              {student.status}
                            </span>
                          </p>
                        </div>
                        <span className="font-mono text-sm font-medium text-slate-900 tabular-nums shrink-0">
                          {student.gpa.toFixed(1)}/20
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </>
        )}
      </div>
    </WorkspaceLayout>
  );
}
