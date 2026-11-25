import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function PublicHeader() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#F8F9FB]/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <Link
          to="/"
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 rounded"
        >
          Campusia
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <Link
            to="/"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 rounded"
          >
            Accueil
          </Link>
          <a
            href="#fonctionnalites"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 rounded"
          >
            Fonctionnalités
          </a>
          <Link
            to="/dashboard"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 rounded"
          >
            Tableau de bord
          </Link>
          <Link
            to="/students"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 rounded"
          >
            Étudiants
          </Link>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to={user ? '/dashboard' : '/login'}
            className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            {user ? 'Ouvrir l’espace' : 'Connexion'}
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Navigation mobile"
          className="md:hidden border-t border-slate-200 bg-white px-6 py-4 flex flex-col gap-3"
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Accueil
          </Link>
          <a
            href="#fonctionnalites"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Fonctionnalités
          </a>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Tableau de bord
          </Link>
          <Link
            to="/students"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Étudiants
          </Link>
          <Link
            to={user ? '/dashboard' : '/login'}
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
          >
            {user ? 'Ouvrir l’espace' : 'Connexion'}
          </Link>
        </nav>
      )}
    </header>
  );
}
