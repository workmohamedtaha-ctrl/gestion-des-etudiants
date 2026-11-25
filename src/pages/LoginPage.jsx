import { ArrowRight, GraduationCap, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PublicHeader } from '../components/PublicHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const STUDY_IMAGE = '/src/assets/images/campus_study_hall_1795627852403.jpg';

export function LoginPage() {
  const { user, authReady, isSigningIn, authError, signInWithGoogle, enterDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [imageError, setImageError] = useState(false);

  const destination = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (authReady && user) {
      navigate(destination, { replace: true });
    }
  }, [authReady, user, destination, navigate]);

  const handleGoogleSignIn = async () => {
    const ok = await signInWithGoogle();
    if (ok) {
      navigate(destination, { replace: true });
    }
  };

  const handleDemoAccess = () => {
    enterDemoMode();
    navigate(destination, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 flex flex-col">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-[960px] w-full bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-center">
            <p className="text-sm font-medium text-blue-800 mb-2">Authentification</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
              Accéder à l’espace scolarité
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-7">
              Identifiez-vous pour consulter le tableau de bord, rechercher les dossiers et gérer
              les inscriptions de votre établissement.
            </p>

            {authError && (
              <div
                role="alert"
                className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 text-sm text-red-800"
              >
                {authError}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="button"
                disabled={isSigningIn}
                onClick={() => void handleGoogleSignIn()}
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{isSigningIn ? 'Connexion en cours…' : 'Se connecter avec Google'}</span>
              </button>

              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span>Explorer en mode démonstration</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Accès chiffré via Firebase Auth</span>
              <Link to="/" className="font-medium text-slate-700 hover:text-slate-900 underline underline-offset-2">
                Retour à l’accueil
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-100 border-t lg:border-t-0 lg:border-l border-slate-200 min-h-[240px]">
            {!imageError ? (
              <img
                src={STUDY_IMAGE}
                alt="Salle de cours et de gestion pédagogique Campusia"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover lg:h-full"
              />
            ) : (
              <div className="w-full h-full min-h-[240px] flex flex-col items-center justify-center p-8 text-center">
                <GraduationCap className="w-10 h-10 text-blue-700 mb-3" />
                <p className="text-sm font-medium text-slate-700">Portail Campusia</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
