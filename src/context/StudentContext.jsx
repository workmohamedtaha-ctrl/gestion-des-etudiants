import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SEED_STUDENTS, SEED_STUDENT_INPUTS } from '../data/seedStudents.js';
import { OperationType, db, handleFirestoreError } from '../firebase.js';
import { sanitizeStudentInput, validateStudentInput } from '../utils/students.js';
import { useAuth } from './AuthContext.jsx';

const StudentContext = createContext(null);

function formatTimestamp(value) {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return new Date().toISOString();
}

function mapDocToStudent(id, data) {
  return {
    id,
    matricule: String(data.matricule ?? ''),
    firstName: String(data.firstName ?? ''),
    lastName: String(data.lastName ?? ''),
    email: String(data.email ?? ''),
    phone: String(data.phone ?? ''),
    program: data.program,
    level: data.level,
    status: data.status,
    gpa: Number(data.gpa ?? 0),
    birthDate: String(data.birthDate ?? ''),
    enrollmentYear: Number(data.enrollmentYear ?? new Date().getFullYear()),
    address: String(data.address ?? ''),
    notes: String(data.notes ?? ''),
    ownerId: String(data.ownerId ?? ''),
    createdAt: formatTimestamp(data.createdAt),
    updatedAt: formatTimestamp(data.updatedAt),
  };
}

export function StudentProvider({ children }) {
  const { user, mode, authReady } = useAuth();
  const [firebaseStudents, setFirebaseStudents] = useState([]);
  const [demoStudents, setDemoStudents] = useState(SEED_STUDENTS);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (mode !== 'firebase' || !user) {
      setFirebaseStudents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const studentsRef = collection(db, 'students');
    const studentsQuery = user.isAdmin
      ? studentsRef
      : query(studentsRef, where('ownerId', '==', user.uid));

    const unsubscribe = onSnapshot(
      studentsQuery,
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => mapDocToStudent(docSnap.id, docSnap.data()));
        setFirebaseStudents(list);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        setError('Impossible de charger les dossiers étudiants depuis Firestore.');
        handleFirestoreError(err, OperationType.LIST, 'students');
      }
    );

    return () => unsubscribe();
  }, [authReady, mode, user]);

  const students = mode === 'demo' ? demoStudents : firebaseStudents;

  const getStudentById = useCallback(
    (id) => students.find((student) => student.id === id),
    [students]
  );

  const addStudent = useCallback(
    async (rawInput) => {
      const sanitized = sanitizeStudentInput(rawInput);
      const validationErrors = validateStudentInput(sanitized);
      if (Object.keys(validationErrors).length > 0) {
        throw new Error('Les informations saisies contiennent des erreurs de validation.');
      }

      if (mode === 'demo') {
        const now = new Date().toISOString();
        const newStudent = {
          ...sanitized,
          id: `demo-stu-${Date.now()}`,
          ownerId: 'demo-user',
          createdAt: now,
          updatedAt: now,
        };
        setDemoStudents((prev) => [newStudent, ...prev]);
        return newStudent;
      }

      if (!user) {
        throw new Error('Authentification requise.');
      }

      setMutating(true);
      setError(null);
      const docRef = doc(collection(db, 'students'));
      const path = `students/${docRef.id}`;
      try {
        await setDoc(docRef, {
          ...sanitized,
          ownerId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        const now = new Date().toISOString();
        return {
          ...sanitized,
          id: docRef.id,
          ownerId: user.uid,
          createdAt: now,
          updatedAt: now,
        };
      } catch (err) {
        setError("Erreur lors de l'enregistrement de l'étudiant.");
        handleFirestoreError(err, OperationType.CREATE, path);
      } finally {
        setMutating(false);
      }
    },
    [mode, user]
  );

  const updateStudent = useCallback(
    async (id, rawInput) => {
      const sanitized = sanitizeStudentInput(rawInput);
      const validationErrors = validateStudentInput(sanitized);
      if (Object.keys(validationErrors).length > 0) {
        throw new Error('Les informations saisies contiennent des erreurs de validation.');
      }

      if (mode === 'demo') {
        const now = new Date().toISOString();
        setDemoStudents((prev) =>
          prev.map((student) =>
            student.id === id ? { ...student, ...sanitized, updatedAt: now } : student
          )
        );
        return;
      }

      if (!user) {
        throw new Error('Authentification requise.');
      }

      setMutating(true);
      setError(null);
      const path = `students/${id}`;
      try {
        await updateDoc(doc(db, 'students', id), {
          ...sanitized,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        setError('Erreur lors de la mise à jour du dossier étudiant.');
        handleFirestoreError(err, OperationType.UPDATE, path);
      } finally {
        setMutating(false);
      }
    },
    [mode, user]
  );

  const deleteStudent = useCallback(
    async (id) => {
      if (mode === 'demo') {
        setDemoStudents((prev) => prev.filter((student) => student.id !== id));
        return;
      }

      if (!user) {
        throw new Error('Authentification requise.');
      }

      setMutating(true);
      setError(null);
      const path = `students/${id}`;
      try {
        await deleteDoc(doc(db, 'students', id));
      } catch (err) {
        setError('Erreur lors de la suppression du dossier étudiant.');
        handleFirestoreError(err, OperationType.DELETE, path);
      } finally {
        setMutating(false);
      }
    },
    [mode, user]
  );

  const seedSampleStudents = useCallback(async () => {
    if (mode === 'demo') {
      setDemoStudents(SEED_STUDENTS);
      return;
    }

    if (!user) {
      throw new Error('Authentification requise.');
    }

    setMutating(true);
    setError(null);
    try {
      for (const sample of SEED_STUDENT_INPUTS) {
        const docRef = doc(collection(db, 'students'));
        await setDoc(docRef, {
          ...sample,
          ownerId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      setError("Impossible d'importer les dossiers d'exemple.");
      handleFirestoreError(err, OperationType.CREATE, 'students');
    } finally {
      setMutating(false);
    }
  }, [mode, user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      students,
      loading,
      mutating,
      error,
      getStudentById,
      addStudent,
      updateStudent,
      deleteStudent,
      seedSampleStudents,
      clearError,
    }),
    [
      students,
      loading,
      mutating,
      error,
      getStudentById,
      addStudent,
      updateStudent,
      deleteStudent,
      seedSampleStudents,
      clearError,
    ]
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudents() {
  const ctx = useContext(StudentContext);
  if (!ctx) {
    throw new Error('useStudents must be used inside StudentProvider');
  }
  return ctx;
}
