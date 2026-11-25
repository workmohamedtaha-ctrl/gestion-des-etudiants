import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS, PROGRAMS, STATUSES } from '../constants/students.js';
import { sanitizeStudentInput, validateStudentInput } from '../utils/students.js';

export function StudentForm({
  initialValues,
  submitLabel,
  cancelTo,
  isSubmitting,
  serverError,
  onSubmit,
}) {
  const [matricule, setMatricule] = useState(initialValues.matricule);
  const [firstName, setFirstName] = useState(initialValues.firstName);
  const [lastName, setLastName] = useState(initialValues.lastName);
  const [email, setEmail] = useState(initialValues.email);
  const [phone, setPhone] = useState(initialValues.phone);
  const [program, setProgram] = useState(initialValues.program);
  const [level, setLevel] = useState(initialValues.level);
  const [status, setStatus] = useState(initialValues.status);
  const [gpa, setGpa] = useState(String(initialValues.gpa));
  const [birthDate, setBirthDate] = useState(initialValues.birthDate);
  const [enrollmentYear, setEnrollmentYear] = useState(String(initialValues.enrollmentYear));
  const [address, setAddress] = useState(initialValues.address);
  const [notes, setNotes] = useState(initialValues.notes);
  const [errors, setErrors] = useState({});

  const buildInput = () => ({
    matricule,
    firstName,
    lastName,
    email,
    phone,
    program,
    level,
    status,
    gpa: gpa.trim() === '' ? NaN : Number(gpa),
    birthDate,
    enrollmentYear: enrollmentYear.trim() === '' ? NaN : Number(enrollmentYear),
    address,
    notes,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const raw = buildInput();
    const nextErrors = validateStudentInput(raw);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    await onSubmit(sanitizeStudentInput(raw));
  };

  const inputClass = (hasError) =>
    `w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
      hasError
        ? 'border-red-500 focus:ring-red-200'
        : 'border-slate-300 focus:border-blue-700 focus:ring-blue-100'
    }`;

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      noValidate
      className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-8"
    >
      {serverError && (
        <div
          role="alert"
          className="p-4 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800"
        >
          {serverError}
        </div>
      )}

      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-1">Identité et coordonnées</h2>
        <p className="text-sm text-slate-500 mb-5">
          Informations personnelles et administratives de l’étudiant.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="student-matricule" className="block text-sm font-medium text-slate-700 mb-1.5">
              Matricule *
            </label>
            <input
              id="student-matricule"
              name="matricule"
              type="text"
              required
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              placeholder="ETU-2026-011"
              className={`${inputClass(Boolean(errors.matricule))} font-mono uppercase`}
            />
            {errors.matricule && (
              <p className="mt-1.5 text-xs text-red-600">{errors.matricule}</p>
            )}
          </div>

          <div>
            <label htmlFor="student-birthdate" className="block text-sm font-medium text-slate-700 mb-1.5">
              Date de naissance *
            </label>
            <input
              id="student-birthdate"
              name="birthDate"
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={`${inputClass(Boolean(errors.birthDate))} tabular-nums`}
            />
            {errors.birthDate && (
              <p className="mt-1.5 text-xs text-red-600">{errors.birthDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="student-firstname" className="block text-sm font-medium text-slate-700 mb-1.5">
              Prénom *
            </label>
            <input
              id="student-firstname"
              name="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Yanis"
              className={inputClass(Boolean(errors.firstName))}
            />
            {errors.firstName && (
              <p className="mt-1.5 text-xs text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="student-lastname" className="block text-sm font-medium text-slate-700 mb-1.5">
              Nom *
            </label>
            <input
              id="student-lastname"
              name="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Mansouri"
              className={inputClass(Boolean(errors.lastName))}
            />
            {errors.lastName && (
              <p className="mt-1.5 text-xs text-red-600">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label htmlFor="student-email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email académique *
            </label>
            <input
              id="student-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yanis.mansouri@campusia.fr"
              className={inputClass(Boolean(errors.email))}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="student-phone" className="block text-sm font-medium text-slate-700 mb-1.5">
              Téléphone *
            </label>
            <input
              id="student-phone"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className={`${inputClass(Boolean(errors.phone))} tabular-nums`}
            />
            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="student-address" className="block text-sm font-medium text-slate-700 mb-1.5">
              Adresse postale
            </label>
            <input
              id="student-address"
              name="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="12 Avenue Victor Hugo, 69002 Lyon"
              className={inputClass(Boolean(errors.address))}
            />
            {errors.address && (
              <p className="mt-1.5 text-xs text-red-600">{errors.address}</p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200">
        <h2 className="text-base font-semibold text-slate-900 mb-1">Parcours académique</h2>
        <p className="text-sm text-slate-500 mb-5">
          Filière, niveau actuel, résultats et observations pédagogiques.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="sm:col-span-2">
            <label htmlFor="student-program" className="block text-sm font-medium text-slate-700 mb-1.5">
              Filière *
            </label>
            <select
              id="student-program"
              name="program"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className={inputClass(Boolean(errors.program))}
            >
              {PROGRAMS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.program && (
              <p className="mt-1.5 text-xs text-red-600">{errors.program}</p>
            )}
          </div>

          <div>
            <label htmlFor="student-level" className="block text-sm font-medium text-slate-700 mb-1.5">
              Niveau *
            </label>
            <select
              id="student-level"
              name="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className={inputClass(Boolean(errors.level))}
            >
              {LEVELS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.level && (
              <p className="mt-1.5 text-xs text-red-600">{errors.level}</p>
            )}
          </div>

          <div>
            <label htmlFor="student-status" className="block text-sm font-medium text-slate-700 mb-1.5">
              Statut *
            </label>
            <select
              id="student-status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass(Boolean(errors.status))}
            >
              {STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1.5 text-xs text-red-600">{errors.status}</p>
            )}
          </div>

          <div>
            <label htmlFor="student-gpa" className="block text-sm font-medium text-slate-700 mb-1.5">
              Moyenne générale (/20) *
            </label>
            <input
              id="student-gpa"
              name="gpa"
              type="number"
              step="0.01"
              min="0"
              max="20"
              required
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
              className={`${inputClass(Boolean(errors.gpa))} tabular-nums`}
            />
            {errors.gpa && (
              <p className="mt-1.5 text-xs text-red-600">{errors.gpa}</p>
            )}
          </div>

          <div>
            <label htmlFor="student-year" className="block text-sm font-medium text-slate-700 mb-1.5">
              Année d’inscription *
            </label>
            <input
              id="student-year"
              name="enrollmentYear"
              type="number"
              min="2000"
              max="2035"
              required
              value={enrollmentYear}
              onChange={(e) => setEnrollmentYear(e.target.value)}
              className={`${inputClass(Boolean(errors.enrollmentYear))} tabular-nums`}
            />
            {errors.enrollmentYear && (
              <p className="mt-1.5 text-xs text-red-600">{errors.enrollmentYear}</p>
            )}
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="student-notes" className="block text-sm font-medium text-slate-700 mb-1.5">
              Observations pédagogiques
            </label>
            <textarea
              id="student-notes"
              name="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Suivi de stage, projets académiques, aménagements…"
              className={inputClass(Boolean(errors.notes))}
            />
            {errors.notes && (
              <p className="mt-1.5 text-xs text-red-600">{errors.notes}</p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3">
        <Link
          to={cancelTo}
          className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Enregistrement…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
