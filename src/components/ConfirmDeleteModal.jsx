import { useEffect } from 'react';

export function ConfirmDeleteModal({
  open,
  studentName,
  matricule,
  isDeleting,
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isDeleting) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isDeleting, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
      role="presentation"
      onClick={() => {
        if (!isDeleting) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-medium text-red-700 mb-1.5">Suppression définitive</p>
        <h2 id="confirm-delete-title" className="text-lg font-semibold text-slate-900 mb-2">
          Supprimer le dossier de {studentName} ?
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Le dossier académique <span className="font-mono text-slate-800">{matricule}</span> sera
          retiré de l’annuaire de l’établissement. Cette action est irréversible.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Suppression…' : 'Confirmer la suppression'}
          </button>
        </div>
      </div>
    </div>
  );
}
