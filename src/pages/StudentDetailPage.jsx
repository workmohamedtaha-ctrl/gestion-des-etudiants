import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal.jsx';
import { WorkspaceLayout } from '../components/WorkspaceLayout.jsx';
import { useStudents } from '../context/StudentContext.jsx';
import { getAcademicMention } from '../utils/students.js';

const STATUS_TEXT_CLASS = {
  Actif: 'text-emerald-700',
  'En stage': 'text-blue-700',
  Diplômé: 'text-slate-700',
  Suspendu: 'text-red-700',
};

export function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudentById, deleteStudent, mutating, loading } = useStudents();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const student = id ? getStudentById(id) : undefined;

  if (loading) {
    return (
      <WorkspaceLayout breadcrumb={['Étudiants', 'Chargement…']}>
        <div className="bg-white border border-slate-200 rounded-xl p-8 animate-pulse space-y-4">
          <div className="h-6 w-48 bg-slate-200 rounded" />
          <div className="h-4 w-72 bg-slate-100 rounded" />
        </div>
      </WorkspaceLayout>
    );
  }

  if (!student) {
    return (
      <WorkspaceLayout breadcrumb={['Étudiants', 'Dossier introuvable']}>
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center max-w-lg mx-auto">
          <h1 className="font-display text-xl font-semibold text-slate-900 mb-2">
            Dossier étudiant introuvable
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            Ce dossier n’existe pas ou a été retiré de l’annuaire.
          </p>
          <Link
            to="/students"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la liste</span>
          </Link>
        </div>
      </WorkspaceLayout>
    );
  }

  const fullName = `${student.firstName} ${student.lastName}`;
  const mention = getAcademicMention(student.gpa);

  const handleConfirmDelete = async () => {
    await deleteStudent(student.id);
    setConfirmOpen(false);
    navigate('/students', { replace: true });
  };

  return (
    <WorkspaceLayout breadcrumb={['Étudiants', fullName]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              to="/students"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 mb-3 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à la liste des étudiants</span>
            </Link>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {fullName}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              <span className="font-mono text-slate-800 tabular-nums">{student.matricule}</span>
              <span aria-hidden="true"> · </span>
              <span>{student.program}</span>
              <span aria-hidden="true"> · </span>
              <span>Niveau {student.level}</span>
              <span aria-hidden="true"> · </span>
              <span className={`font-medium ${STATUS_TEXT_CLASS[student.status] ?? 'text-slate-700'}`}>
                {student.status}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={`/students/${student.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <Pencil className="w-4 h-4 shrink-0" />
              <span>Modifier</span>
            </Link>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              <span>Supprimer</span>
            </button>
          </div>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500 mb-1.5">Moyenne générale</p>
            <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
              {student.gpa.toFixed(2)}
              <span className="text-sm font-normal text-slate-400"> /20</span>
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500 mb-1.5">Mention académique</p>
            <p className="font-display text-2xl font-semibold text-slate-900">{mention}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500 mb-1.5">Année d’inscription</p>
            <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
              {student.enrollmentYear}
            </p>
          </div>
        </div>

        {/* Detailed information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="font-display text-base font-semibold text-slate-900 mb-4">
              Coordonnées et état civil
            </h2>
            <dl className="divide-y divide-slate-200 text-sm">
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium text-slate-900 text-right break-all">{student.email}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Téléphone</dt>
                <dd className="font-mono text-slate-900 tabular-nums text-right">{student.phone}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Date de naissance</dt>
                <dd className="font-mono text-slate-900 tabular-nums text-right">
                  {student.birthDate}
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Adresse</dt>
                <dd className="text-slate-900 text-right">
                  {student.address || 'Non renseignée'}
                </dd>
              </div>
            </dl>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="font-display text-base font-semibold text-slate-900 mb-4">
              Parcours et observations
            </h2>
            <dl className="divide-y divide-slate-200 text-sm">
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Filière</dt>
                <dd className="font-medium text-slate-900 text-right">{student.program}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Niveau</dt>
                <dd className="font-mono text-slate-900 text-right">{student.level}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-slate-500">Statut administratif</dt>
                <dd className={`font-medium text-right ${STATUS_TEXT_CLASS[student.status] ?? 'text-slate-900'}`}>
                  {student.status}
                </dd>
              </div>
            </dl>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs font-medium text-slate-500 mb-1.5">Observations pédagogiques</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {student.notes || 'Aucune observation enregistrée pour cet étudiant.'}
              </p>
            </div>
          </section>
        </div>
      </div>

      <ConfirmDeleteModal
        open={confirmOpen}
        studentName={fullName}
        matricule={student.matricule}
        isDeleting={mutating}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void handleConfirmDelete()}
      />
    </WorkspaceLayout>
  );
}
