import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute({ children }) {
  const { user, authReady } = useAuth();
  const location = useLocation();

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6">
        <p className="text-sm text-slate-600">Vérification de la session…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
