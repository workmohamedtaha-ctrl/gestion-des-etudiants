import {
  LEVELS,
  PROGRAMS,
  STATUSES,
  STUDENT_SCHEMA_LIMITS,
} from '../constants/students.js';

export function sanitizeStudentInput(input) {
  return {
    matricule: input.matricule.trim().toUpperCase().slice(0, STUDENT_SCHEMA_LIMITS.matriculeMax),
    firstName: input.firstName.trim().slice(0, STUDENT_SCHEMA_LIMITS.nameMax),
    lastName: input.lastName.trim().slice(0, STUDENT_SCHEMA_LIMITS.nameMax),
    email: input.email.trim().toLowerCase().slice(0, STUDENT_SCHEMA_LIMITS.emailMax),
    phone: input.phone.trim().slice(0, STUDENT_SCHEMA_LIMITS.phoneMax),
    program: input.program,
    level: input.level,
    status: input.status,
    gpa: Number.isFinite(input.gpa) ? Math.round(input.gpa * 100) / 100 : NaN,
    birthDate: input.birthDate.trim(),
    enrollmentYear: Math.trunc(input.enrollmentYear),
    address: input.address.trim().slice(0, STUDENT_SCHEMA_LIMITS.addressMax),
    notes: input.notes.trim().slice(0, STUDENT_SCHEMA_LIMITS.notesMax),
  };
}

export function validateStudentInput(rawInput) {
  const errors = {};
  const matricule = rawInput.matricule.trim().toUpperCase();
  const firstName = rawInput.firstName.trim();
  const lastName = rawInput.lastName.trim();
  const email = rawInput.email.trim();
  const phone = rawInput.phone.trim();
  const birthDate = rawInput.birthDate.trim();
  const address = rawInput.address.trim();
  const notes = rawInput.notes.trim();

  if (
    matricule.length < STUDENT_SCHEMA_LIMITS.matriculeMin ||
    matricule.length > STUDENT_SCHEMA_LIMITS.matriculeMax
  ) {
    errors.matricule = `Le matricule doit contenir entre ${STUDENT_SCHEMA_LIMITS.matriculeMin} et ${STUDENT_SCHEMA_LIMITS.matriculeMax} caractères.`;
  } else if (!STUDENT_SCHEMA_LIMITS.matriculePattern.test(matricule)) {
    errors.matricule =
      'Le matricule ne peut contenir que des lettres majuscules, chiffres et tirets.';
  }

  if (
    firstName.length < STUDENT_SCHEMA_LIMITS.nameMin ||
    firstName.length > STUDENT_SCHEMA_LIMITS.nameMax
  ) {
    errors.firstName = 'Le prénom est obligatoire (80 caractères maximum).';
  }

  if (
    lastName.length < STUDENT_SCHEMA_LIMITS.nameMin ||
    lastName.length > STUDENT_SCHEMA_LIMITS.nameMax
  ) {
    errors.lastName = 'Le nom de famille est obligatoire (80 caractères maximum).';
  }

  if (
    email.length < STUDENT_SCHEMA_LIMITS.emailMin ||
    email.length > STUDENT_SCHEMA_LIMITS.emailMax ||
    !STUDENT_SCHEMA_LIMITS.emailPattern.test(email)
  ) {
    errors.email = 'Veuillez saisir une adresse email valide.';
  }

  if (
    phone.length < STUDENT_SCHEMA_LIMITS.phoneMin ||
    phone.length > STUDENT_SCHEMA_LIMITS.phoneMax
  ) {
    errors.phone = `Le numéro de téléphone doit contenir entre ${STUDENT_SCHEMA_LIMITS.phoneMin} et ${STUDENT_SCHEMA_LIMITS.phoneMax} caractères.`;
  }

  if (!PROGRAMS.includes(rawInput.program)) {
    errors.program = 'Filière invalide.';
  }

  if (!LEVELS.includes(rawInput.level)) {
    errors.level = "Niveau d'études invalide.";
  }

  if (!STATUSES.includes(rawInput.status)) {
    errors.status = 'Statut invalide.';
  }

  if (
    typeof rawInput.gpa !== 'number' ||
    !Number.isFinite(rawInput.gpa) ||
    rawInput.gpa < STUDENT_SCHEMA_LIMITS.gpaMin ||
    rawInput.gpa > STUDENT_SCHEMA_LIMITS.gpaMax
  ) {
    errors.gpa = 'La moyenne générale doit être comprise entre 0 et 20.';
  }

  if (!STUDENT_SCHEMA_LIMITS.birthDatePattern.test(birthDate)) {
    errors.birthDate = 'La date de naissance doit être au format AAAA-MM-JJ.';
  } else {
    const parsedDate = new Date(`${birthDate}T00:00:00Z`);
    if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== birthDate) {
      errors.birthDate = 'Date de naissance invalide.';
    }
  }

  if (
    typeof rawInput.enrollmentYear !== 'number' ||
    !Number.isInteger(rawInput.enrollmentYear) ||
    rawInput.enrollmentYear < STUDENT_SCHEMA_LIMITS.enrollmentYearMin ||
    rawInput.enrollmentYear > STUDENT_SCHEMA_LIMITS.enrollmentYearMax
  ) {
    errors.enrollmentYear = `L'année d'inscription doit être comprise entre ${STUDENT_SCHEMA_LIMITS.enrollmentYearMin} et ${STUDENT_SCHEMA_LIMITS.enrollmentYearMax}.`;
  }

  if (address.length > STUDENT_SCHEMA_LIMITS.addressMax) {
    errors.address = `L'adresse ne doit pas dépasser ${STUDENT_SCHEMA_LIMITS.addressMax} caractères.`;
  }

  if (notes.length > STUDENT_SCHEMA_LIMITS.notesMax) {
    errors.notes = `Les observations ne doivent pas dépasser ${STUDENT_SCHEMA_LIMITS.notesMax} caractères.`;
  }

  return errors;
}

export function filterAndSortStudents(students, options) {
  const normalizedQuery = options.query.trim().toLowerCase();

  const filtered = students.filter((student) => {
    if (options.program !== 'all' && student.program !== options.program) {
      return false;
    }
    if (options.status !== 'all' && student.status !== options.status) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    const haystack = [
      student.firstName,
      student.lastName,
      `${student.firstName} ${student.lastName}`,
      student.matricule,
      student.email,
      student.program,
      student.level,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  return [...filtered].sort((a, b) => {
    if (options.sortBy === 'gpa') {
      if (b.gpa !== a.gpa) {
        return b.gpa - a.gpa;
      }
      return a.lastName.localeCompare(b.lastName, 'fr');
    }
    if (options.sortBy === 'recent') {
      const timeCompare = b.updatedAt.localeCompare(a.updatedAt);
      if (timeCompare !== 0) {
        return timeCompare;
      }
      return a.lastName.localeCompare(b.lastName, 'fr');
    }
    const lastCompare = a.lastName.localeCompare(b.lastName, 'fr');
    if (lastCompare !== 0) {
      return lastCompare;
    }
    return a.firstName.localeCompare(b.firstName, 'fr');
  });
}

export function computeDashboardMetrics(students) {
  const totalCount = students.length;
  let activeCount = 0;
  let internshipCount = 0;
  let graduatedCount = 0;
  let suspendedCount = 0;
  let gpaSum = 0;
  let honorsCount = 0;

  const programBuckets = new Map();
  for (const program of PROGRAMS) {
    programBuckets.set(program, { count: 0, gpaSum: 0 });
  }

  for (const student of students) {
    if (student.status === 'Actif') activeCount += 1;
    else if (student.status === 'En stage') internshipCount += 1;
    else if (student.status === 'Diplômé') graduatedCount += 1;
    else if (student.status === 'Suspendu') suspendedCount += 1;

    gpaSum += student.gpa;
    if (student.gpa >= 14) {
      honorsCount += 1;
    }

    const bucket = programBuckets.get(student.program);
    if (bucket) {
      bucket.count += 1;
      bucket.gpaSum += student.gpa;
    }
  }

  const programBreakdown = PROGRAMS.map((program) => {
    const bucket = programBuckets.get(program) ?? { count: 0, gpaSum: 0 };
    return {
      program,
      count: bucket.count,
      averageGpa: bucket.count > 0 ? Math.round((bucket.gpaSum / bucket.count) * 100) / 100 : 0,
      sharePercent: totalCount > 0 ? Math.round((bucket.count / totalCount) * 100) : 0,
    };
  }).sort((a, b) => b.count - a.count || a.program.localeCompare(b.program, 'fr'));

  const recentStudents = [...students]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  return {
    totalCount,
    activeCount,
    internshipCount,
    graduatedCount,
    suspendedCount,
    averageGpa: totalCount > 0 ? Math.round((gpaSum / totalCount) * 100) / 100 : 0,
    honorsCount,
    programBreakdown,
    recentStudents,
  };
}

export function getAcademicMention(gpa) {
  if (gpa >= 16) return 'Très bien';
  if (gpa >= 14) return 'Bien';
  if (gpa >= 12) return 'Assez bien';
  if (gpa >= 10) return 'Passable';
  return 'À renforcer';
}

export function generateNextMatricule(students, year) {
  const prefix = `ETU-${year}-`;
  let maxNumber = 0;
  for (const student of students) {
    if (student.matricule.startsWith(prefix)) {
      const suffix = Number.parseInt(student.matricule.slice(prefix.length), 10);
      if (Number.isFinite(suffix) && suffix > maxNumber) {
        maxNumber = suffix;
      }
    }
  }
  return `${prefix}${String(maxNumber + 1).padStart(3, '0')}`;
}
