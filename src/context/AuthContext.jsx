import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ADMIN_EMAIL } from '../constants/students.js';
import { auth, googleProvider } from '../firebase.js';

const AuthContext = createContext(null);

function mapFirebaseUser(user) {
  const email = user.email ?? '';
  return {
    uid: user.uid,
    displayName: user.displayName || email || 'Gestionnaire académique',
    email,
    emailVerified: user.emailVerified,
    photoURL: user.photoURL,
    isAdmin: user.emailVerified && email === ADMIN_EMAIL,
  };
}

const DEMO_USER = {
  uid: 'demo-user',
  displayName: 'Responsable Pédagogique (Démo)',
  email: 'scolarite.demo@campusia.fr',
  emailVerified: true,
  photoURL: null,
  isAdmin: false,
};

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [demoActive, setDemoActive] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        setDemoActive(false);
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setDemoActive(false);
      return true;
    } catch (error) {
      const code = error?.code ?? '';
      if (code === 'auth/popup-closed-by-user') {
        setAuthError('La fenêtre de connexion Google a été fermée avant la validation.');
      } else if (code === 'auth/popup-blocked') {
        setAuthError(
          "Le navigateur a bloqué la fenêtre de connexion. Autorisez les pop-ups pour ce site ou utilisez l'aperçu démonstration."
        );
      } else {
        setAuthError('Impossible de finaliser la connexion Google. Veuillez réessayer.');
      }
      return false;
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const enterDemoMode = useCallback(() => {
    setAuthError(null);
    setDemoActive(true);
  }, []);

  const signOut = useCallback(async () => {
    setAuthError(null);
    setDemoActive(false);
    if (auth.currentUser) {
      await firebaseSignOut(auth);
    }
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = useMemo(() => {
    if (firebaseUser) {
      return {
        user: mapFirebaseUser(firebaseUser),
        mode: 'firebase',
        authReady,
        isSigningIn,
        authError,
        signInWithGoogle,
        enterDemoMode,
        signOut,
        clearAuthError,
      };
    }
    if (demoActive) {
      return {
        user: DEMO_USER,
        mode: 'demo',
        authReady,
        isSigningIn,
        authError,
        signInWithGoogle,
        enterDemoMode,
        signOut,
        clearAuthError,
      };
    }
    return {
      user: null,
      mode: null,
      authReady,
      isSigningIn,
      authError,
      signInWithGoogle,
      enterDemoMode,
      signOut,
      clearAuthError,
    };
  }, [
    firebaseUser,
    demoActive,
    authReady,
    isSigningIn,
    authError,
    signInWithGoogle,
    enterDemoMode,
    signOut,
    clearAuthError,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
