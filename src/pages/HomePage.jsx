import { ArrowRight, GraduationCap, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicHeader } from '../components/PublicHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const HERO_IMAGE = '/src/assets/images/hero_campus_academy_1795627852373.jpg';
const STUDY_IMAGE = '/src/assets/images/campus_study_hall_1795627852403.jpg';

const CAPABILITIES = [
  {
    index: '01',
    title: 'Tableau de bord de la scolarité',
    description:
      'Visualisez instantanément les effectifs par filière, la répartition des statuts et la moyenne académique de chaque promotion.',
  },
  {
    index: '02',
    title: 'Annuaire et recherche multicritère',
    description:
      'Retrouvez un dossier en moins d’une seconde par nom, prénom, numéro matricule, adresse email ou filière d’études.',
  },
  {
    index: '03',
    title: 'Dossiers étudiants complets',
    description:
      'Centralisez l’état civil, les coordonnées, le niveau, les résultats sur 20 et les observations pédagogiques sur une fiche unifiée.',
  },
  {
    index: '04',
    title: 'Gestion sécurisée et traçable',
    description:
      'Ajoutez, mettez à jour ou archivez des dossiers avec validation stricte des champs et contrôle d’accès authentifié.',
  },
];

export function HomePage() {
  const { user } = useAuth();
  const [heroError, setHeroError] = useState(false);
  const [studyError, setStudyError] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero section */}
        <section className="max-w-[1200px] mx-auto px-6 pt-12 pb-16 lg:pt-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-sm font-medium text-blue-800 mb-3">
                Établissement de formation supérieure et technique
              </p>
              <h1 className="font-display text-[clamp(2.25rem,4vw,3.35rem)] leading-[1.08] font-bold tracking-tight text-slate-900 text-balance max-w-2xl mb-5">
                Pilotage clair des dossiers étudiants et de la scolarité.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8">
                Campusia réunit les inscriptions, le suivi des filières, les résultats
                académiques et l’annuaire administratif dans une interface conçue pour les équipes
                pédagogiques.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to={user ? '/dashboard' : '/login'}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap"
                >
                  <span>{user ? 'Accéder au tableau de bord' : 'Accéder à la plateforme'}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
                <Link
                  to="/students"
                  className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 underline underline-offset-4 transition-colors whitespace-nowrap"
                >
                  Consulter les étudiants
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[280px] lg:min-h-[420px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                {!heroError ? (
                  <img
                    src={HERO_IMAGE}
                    alt="Atrium et bibliothèque universitaire de l’établissement Campusia"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroError(true)}
                    className="w-full h-full object-cover lg:h-full"
                  />
                ) : (
                  <div className="w-full h-full min-h-[280px] bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center p-8 text-center">
                    <GraduationCap className="w-10 h-10 text-blue-700 mb-3" />
                    <p className="text-sm font-medium text-slate-700">
                      Campus universitaire Campusia
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4-column proof strip below hero split */}
          <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-semibold text-slate-900 tabular-nums">
                6
              </p>
              <p className="mt-1 text-sm text-slate-600">Filières de formation suivies</p>
            </div>
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-semibold text-slate-900 tabular-nums">
                7
              </p>
              <p className="mt-1 text-sm text-slate-600">Niveaux académiques, BTS à M2</p>
            </div>
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-semibold text-slate-900 tabular-nums">
                100 %
              </p>
              <p className="mt-1 text-sm text-slate-600">Dossiers centralisés et vérifiés</p>
            </div>
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-semibold text-slate-900 tabular-nums">
                &lt; 1 s
              </p>
              <p className="mt-1 text-sm text-slate-600">Recherche instantanée par matricule</p>
            </div>
          </div>
        </section>

        {/* Capabilities section */}
        <section
          id="fonctionnalites"
          className="bg-white border-y border-slate-200 py-16 lg:py-20"
        >
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-2xl mb-12">
              <p className="text-sm font-medium text-blue-800 mb-2">Gestion académique</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
                Tout le cycle de vie étudiant, sans dispersion.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {CAPABILITIES.map((item) => (
                <div key={item.index} className="pt-5 border-t border-slate-200">
                  <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">
                    <span className="font-mono text-sm text-blue-700 mr-2.5 tabular-nums">
                      {item.index}.
                    </span>
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Institutional showcase & CTA */}
        <section className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-6">
              <div className="h-full min-h-[260px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                {!studyError ? (
                  <img
                    src={STUDY_IMAGE}
                    alt="Salle de séminaire et de suivi pédagogique avec étudiants et enseignants"
                    referrerPolicy="no-referrer"
                    onError={() => setStudyError(true)}
                    className="w-full h-full object-cover lg:h-full"
                  />
                ) : (
                  <div className="w-full h-full min-h-[260px] bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center p-8 text-center">
                    <ShieldCheck className="w-10 h-10 text-blue-700 mb-3" />
                    <p className="text-sm font-medium text-slate-700">
                      Suivi pédagogique structuré
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center bg-white border border-slate-200 rounded-xl p-8 sm:p-10">
              <p className="text-sm font-medium text-blue-800 mb-2">Accès scolarité</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance mb-4">
                Démarrez la gestion de vos promotions en quelques instants.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                Connectez-vous avec votre compte Google pour enregistrer vos étudiants dans votre
                base sécurisée Firestore, ou explorez immédiatement l’interface grâce au mode
                démonstration intégré.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to={user ? '/dashboard' : '/login'}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap"
                >
                  <span>{user ? 'Ouvrir le tableau de bord' : 'Se connecter'}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-slate-500">
          <p className="font-medium text-slate-700">
            Campusia · Gestion des étudiants et de la scolarité
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Accueil
            </Link>
            <Link to="/login" className="hover:text-slate-900 transition-colors">
              Authentification
            </Link>
            <Link to="/dashboard" className="hover:text-slate-900 transition-colors">
              Tableau de bord
            </Link>
            <Link to="/students" className="hover:text-slate-900 transition-colors">
              Liste des étudiants
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
