import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { StudentForm } from '../components/StudentForm.jsx';
import { WorkspaceLayout } from '../components/WorkspaceLayout.jsx';
import { useStudents } from '../context/StudentContext.jsx';

export function StudentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudentById, updateStudent, mutating, loading } = useStudents();
  const [submitError, setSubmitError] = useState(null);

  const student = id ? getStudentById(id) : undefined;

  if (loading) {
    return (
      <WorkspaceLayout breadcrumb={['Étudiants', 'Modification']}>
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
            Impossible de modifier un dossier inexistant ou supprimé.
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
  const initialValues = {
    matricule: student.matricule,
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    phone: student.phone,
    program: student.program,
    level: student.level,
    status: student.status,
    gpa: student.gpa,
    birthDate: student.birthDate,
    enrollmentYear: student.enrollmentYear,
    address: student.address,
    notes: student.notes,
  };

  const handleSubmit = async (values) => {
    setSubmitError(null);
    try {
      await updateStudent(student.id, values);
      navigate(`/students/${student.id}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Impossible de mettre à jour ce dossier.'
      );
    }
  };

  return (
    <WorkspaceLayout breadcrumb={['Étudiants', fullName, 'Modifier']}>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Modifier {fullName}
          </h1>
          <p className="mt-1 text-sm text-slate-600 font-mono tabular-nums">
            Matricule {student.matricule}
          </p>
        </div>

        <StudentForm
          initialValues={initialValues}
          submitLabel="Enregistrer les modifications"
          cancelTo={`/students/${student.id}`}
          isSubmitting={mutating}
          serverError={submitError}
          onSubmit={handleSubmit}
        />
      </div>
    </WorkspaceLayout>
  );
}
