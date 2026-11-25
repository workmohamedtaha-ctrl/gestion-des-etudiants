export const PROGRAMS = [
  'Informatique & Systèmes',
  'Data & Intelligence Artificielle',
  'Cybersécurité',
  'Génie Civil',
  'Gestion & Finance',
  'Design Numérique',
];

export const LEVELS = ['BTS 1', 'BTS 2', 'L1', 'L2', 'L3', 'M1', 'M2'];

export const STATUSES = ['Actif', 'En stage', 'Diplômé', 'Suspendu'];

export const ADMIN_EMAIL = 'workmohamedtaha@gmail.com';

export const STUDENT_SCHEMA_LIMITS = {
  matriculeMin: 3,
  matriculeMax: 32,
  matriculePattern: /^[A-Z0-9-]+$/,
  nameMin: 1,
  nameMax: 80,
  emailMin: 5,
  emailMax: 160,
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phoneMin: 6,
  phoneMax: 30,
  birthDatePattern: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
  gpaMin: 0,
  gpaMax: 20,
  enrollmentYearMin: 2000,
  enrollmentYearMax: 2035,
  addressMax: 240,
  notesMax: 1000,
};
