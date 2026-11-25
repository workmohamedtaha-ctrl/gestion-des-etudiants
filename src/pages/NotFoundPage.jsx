import { Link } from 'react-router-dom';
import { PublicHeader } from '../components/PublicHeader.jsx';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 flex flex-col">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-8 text-center">
          <p className="font-mono text-sm font-semibold text-blue-700 mb-2">404</p>
          <h1 className="font-display text-2xl font-bold text-slate-900 mb-3">
            Page introuvable
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            L’adresse demandée ne correspond à aucune route de l’application Campusia.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Page d’accueil
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Tableau de bord
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
