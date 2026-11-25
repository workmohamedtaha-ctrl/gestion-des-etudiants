import {
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function WorkspaceLayout({
  breadcrumb,
  primaryAction,
  children,
}) {
  const { user, mode, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
      isActive
        ? 'bg-blue-50 text-blue-800'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="h-16 px-5 flex items-center border-b border-slate-200">
        <Link
          to="/"
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap"
        >
          Campusia
        </Link>
      </div>

      <nav aria-label="Menu de gestion" className="flex-1 p-4 space-y-1">
        <NavLink
          to="/dashboard"
          onClick={() => setSidebarOpen(false)}
          className={navLinkClass}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span>Tableau de bord</span>
        </NavLink>
        <NavLink
          to="/students"
          end
          onClick={() => setSidebarOpen(false)}
          className={navLinkClass}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span>Étudiants</span>
        </NavLink>
        <NavLink
          to="/students/new"
          onClick={() => setSidebarOpen(false)}
          className={navLinkClass}
        >
          <UserPlus className="w-4 h-4 shrink-0" />
          <span>Ajouter un étudiant</span>
        </NavLink>

        <div className="pt-4 mt-4 border-t border-slate-200">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Page d’accueil</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200 space-y-3">
        <div className="px-2">
          <p className="text-sm font-medium text-slate-900 truncate">{user?.displayName}</p>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white border-r border-slate-200 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85vw] bg-white h-full border-r border-slate-200 z-10 flex flex-col">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fermer le menu latéral"
              className="absolute top-3.5 right-3.5 w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main viewport */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Ouvrir le menu de navigation"
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-sm text-slate-500 min-w-0">
              {breadcrumb.map((item, idx) => {
                const isLast = idx === breadcrumb.length - 1;
                return (
                  <span key={`${item}-${idx}`} className="flex items-center gap-2 min-w-0">
                    {idx > 0 && (
                      <span aria-hidden="true" className="hidden sm:inline">
                        /
                      </span>
                    )}
                    <span
                      className={
                        isLast
                          ? 'font-medium text-slate-900 truncate'
                          : 'truncate hidden sm:inline'
                      }
                    >
                      {item}
                    </span>
                  </span>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {primaryAction && (
              <Link
                to={primaryAction.to}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0"
              >
                {primaryAction.label}
              </Link>
            )}
          </div>
        </header>

        {mode === 'demo' && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-amber-900">
            <span>
              Mode démonstration actif — les données sont stockées localement pour cette session.
            </span>
            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              className="font-medium text-amber-950 underline underline-offset-2 hover:text-blue-800 whitespace-nowrap"
            >
              Connecter un compte Google
            </button>
          </div>
        )}

        <main className="flex-1 px-4 sm:px-8 py-8 max-w-[1200px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
