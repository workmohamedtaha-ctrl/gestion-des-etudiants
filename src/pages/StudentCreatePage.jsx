import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentForm } from '../components/StudentForm.jsx';
import { WorkspaceLayout } from '../components/WorkspaceLayout.jsx';
import { useStudents } from '../context/StudentContext.jsx';
import { generateNextMatricule } from '../utils/students.js';

export function StudentCreatePage() {
  const { students, addStudent, mutating } = useStudents();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(null);

  const initialValues = useMemo(
    () => ({
      matricule: generateNextMatricule(students, 2026),
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      program: 'Informatique & Systèmes',
      level: 'L1',
      status: 'Actif',
      gpa: 12.0,
      birthDate: '',
      enrollmentYear: 2026,
      address: '',
      notes: '',
    }),
    [students]
  );

  const handleSubmit = async (values) => {
    setSubmitError(null);
    try {
      const created = await addStudent(values);
      navigate(`/students/${created.id}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Impossible d'ajouter cet étudiant."
      );
    }
  };

  return (
    <WorkspaceLayout breadcrumb={['Étudiants', 'Nouvel étudiant']}>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Ajouter un étudiant
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Renseignez les informations administratives et académiques du nouveau dossier.
          </p>
        </div>

        <StudentForm
          initialValues={initialValues}
          submitLabel="Créer le dossier"
          cancelTo="/students"
          isSubmitting={mutating}
          serverError={submitError}
          onSubmit={handleSubmit}
        />
      </div>
    </WorkspaceLayout>
  );
}
