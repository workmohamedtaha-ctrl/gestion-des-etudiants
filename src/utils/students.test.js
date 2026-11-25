import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeDashboardMetrics,
  filterAndSortStudents,
  generateNextMatricule,
  getAcademicMention,
  sanitizeStudentInput,
  validateStudentInput,
} from './students.js';

const validInput = {
  matricule: 'ETU-2026-042',
  firstName: 'Lina',
  lastName: 'Benali',
  email: 'lina.benali@campusia.fr',
  phone: '+33 6 42 18 90 12',
  program: 'Informatique & Systèmes',
  level: 'L3',
  status: 'Actif',
  gpa: 15.8,
  birthDate: '2004-05-14',
  enrollmentYear: 2024,
  address: '14 Rue des Écoles, Lyon',
  notes: 'Projet de fin de semestre validé avec félicitations.',
};

const sampleStudents = [
  {
    ...validInput,
    id: 'stu-1',
    ownerId: 'user-1',
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-10-12T10:00:00.000Z',
  },
  {
    id: 'stu-2',
    matricule: 'ETU-2026-009',
    firstName: 'Thomas',
    lastName: 'Lefèvre',
    email: 'thomas.lefevre@campusia.fr',
    phone: '+33 6 11 22 33 44',
    program: 'Cybersécurité',
    level: 'M1',
    status: 'En stage',
    gpa: 13.2,
    birthDate: '2003-11-03',
    enrollmentYear: 2023,
    address: '8 Avenue Jean Jaurès, Paris',
    notes: '',
    ownerId: 'user-1',
    createdAt: '2026-09-02T09:00:00.000Z',
    updatedAt: '2026-10-15T14:30:00.000Z',
  },
  {
    id: 'stu-3',
    matricule: 'ETU-2025-014',
    firstName: 'Camille',
    lastName: 'Moreau',
    email: 'camille.moreau@campusia.fr',
    phone: '+33 6 77 88 99 00',
    program: 'Informatique & Systèmes',
    level: 'M2',
    status: 'Diplômé',
    gpa: 17.4,
    birthDate: '2002-02-19',
    enrollmentYear: 2022,
    address: '22 Cours Gambetta, Bordeaux',
    notes: 'Major de promotion.',
    ownerId: 'user-1',
    createdAt: '2025-09-01T08:00:00.000Z',
    updatedAt: '2026-07-01T16:00:00.000Z',
  },
];

test('validateStudentInput accepts a complete valid student payload', () => {
  const errors = validateStudentInput(validInput);
  assert.deepEqual(errors, {});
});

test('validateStudentInput rejects invalid matricule, email, GPA, and empty names', () => {
  const errors = validateStudentInput({
    ...validInput,
    matricule: 'ab',
    firstName: '   ',
    email: 'invalid-email',
    gpa: 24,
    birthDate: '2004-02-31',
  });
  assert.ok(errors.matricule);
  assert.ok(errors.firstName);
  assert.ok(errors.email);
  assert.ok(errors.gpa);
  assert.ok(errors.birthDate);
});

test('sanitizeStudentInput trims fields and normalizes matricule and email', () => {
  const sanitized = sanitizeStudentInput({
    ...validInput,
    matricule: ' etu-2026-042 ',
    email: ' LINA.Benali@Campusia.FR ',
    gpa: 15.847,
  });
  assert.equal(sanitized.matricule, 'ETU-2026-042');
  assert.equal(sanitized.email, 'lina.benali@campusia.fr');
  assert.equal(sanitized.gpa, 15.85);
});

test('filterAndSortStudents filters by query, program, and status and sorts accurately', () => {
  const byQuery = filterAndSortStudents(sampleStudents, {
    query: 'benali',
    program: 'all',
    status: 'all',
    sortBy: 'name',
  });
  assert.equal(byQuery.length, 1);
  assert.equal(byQuery[0].id, 'stu-1');

  const byProgramAndStatus = filterAndSortStudents(sampleStudents, {
    query: '',
    program: 'Informatique & Systèmes',
    status: 'Diplômé',
    sortBy: 'gpa',
  });
  assert.equal(byProgramAndStatus.length, 1);
  assert.equal(byProgramAndStatus[0].id, 'stu-3');

  const sortedByGpa = filterAndSortStudents(sampleStudents, {
    query: '',
    program: 'all',
    status: 'all',
    sortBy: 'gpa',
  });
  assert.deepEqual(
    sortedByGpa.map((s) => s.id),
    ['stu-3', 'stu-1', 'stu-2']
  );
});

test('computeDashboardMetrics aggregates counts, average GPA, and program shares', () => {
  const metrics = computeDashboardMetrics(sampleStudents);
  assert.equal(metrics.totalCount, 3);
  assert.equal(metrics.activeCount, 1);
  assert.equal(metrics.internshipCount, 1);
  assert.equal(metrics.graduatedCount, 1);
  assert.equal(metrics.honorsCount, 2);
  assert.equal(metrics.averageGpa, 15.47);
  assert.equal(metrics.programBreakdown[0].program, 'Informatique & Systèmes');
  assert.equal(metrics.programBreakdown[0].count, 2);
  assert.equal(metrics.recentStudents[0].id, 'stu-2');
});

test('getAcademicMention maps GPA ranges to French academic honors', () => {
  assert.equal(getAcademicMention(17.4), 'Très bien');
  assert.equal(getAcademicMention(14.5), 'Bien');
  assert.equal(getAcademicMention(12.3), 'Assez bien');
  assert.equal(getAcademicMention(10.0), 'Passable');
  assert.equal(getAcademicMention(8.9), 'À renforcer');
});

test('generateNextMatricule increments sequence for current year', () => {
  assert.equal(generateNextMatricule(sampleStudents, 2026), 'ETU-2026-043');
});
