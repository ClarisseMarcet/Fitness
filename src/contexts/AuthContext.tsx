"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { 
  signIn, 
  signUp, 
  logOut, 
  getCurrentUser, 
  getUserProfile,
  UserProfile,
  signInWithGoogle,
  handleRedirectResult
} from '../services/firebaseService';

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  handleSignIn: (email: string, password: string) => Promise<void>;
  handleSignUp: (email: string, password: string, displayName: string) => Promise<void>;
  handleSignInWithGoogle: () => Promise<void>;
  handleSignOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Vérifier s'il y a un résultat de redirection
        const redirectResult = await handleRedirectResult();
        if (redirectResult) {
          setUser(redirectResult);
          router.push('/dashboard');
          return;
        }

        // Sinon, charger l'utilisateur normalement
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
        setError('Erreur lors du chargement de l\'utilisateur');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setError(null);
      const userProfile = await signIn(email, password);
      setUser(userProfile);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error);
      
      // Gérer les différents types d'erreurs de manière plus précise
      if (error.code === 'auth/invalid-login-credentials') {
        setError('Email ou mot de passe incorrect. Si vous êtes sûr de vos identifiants, essayez de vous connecter avec Google ou utilisez le mode incognito.');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Email ou mot de passe incorrect');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Trop de tentatives de connexion. Veuillez réessayer plus tard ou réinitialiser votre mot de passe.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Problème de connexion réseau. Veuillez vérifier votre connexion Internet.');
      } else if (error.code === 'auth/cookies-blocked') {
        setError('Les cookies tiers sont bloqués par votre navigateur. Pour vous connecter, veuillez les activer ou utiliser un autre navigateur.');
      } else if (error.message?.includes('third-party cookies') || error.message?.includes('third party cookies')) {
        setError('Les cookies tiers semblent bloqués. Veuillez vérifier les paramètres de votre navigateur ou utiliser la connexion avec Google.');
      } else if (error.message?.includes('Cross-Origin-Opener-Policy') || error.message?.includes('COOP')) {
        setError('Blocage de sécurité cross-origin détecté. Essayez un autre navigateur ou désactivez les fonctionnalités de protection renforcée.');
      } else {
        setError('Erreur lors de la connexion. Veuillez réessayer. Si le problème persiste, vérifiez les paramètres de cookies de votre navigateur.');
      }
    }
  };

  const handleSignUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      const userProfile = await signUp(email, password, displayName);
      setUser(userProfile);
      // La redirection est maintenant gérée dans le composant RegisterForm
    } catch (error: any) {
      console.error('Error signing up:', error);
      
      // Gérer les différents types d'erreurs d'inscription
      if (error.code === 'auth/email-already-in-use') {
        setError('Cette adresse email est déjà utilisée. Veuillez vous connecter ou utiliser une autre adresse.');
      } else if (error.code === 'auth/weak-password') {
        setError('Le mot de passe est trop faible. Utilisez au moins 6 caractères.');
      } else if (error.code === 'auth/invalid-email') {
        setError('L\'adresse email n\'est pas valide.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Problème de connexion réseau. Veuillez vérifier votre connexion Internet.');
      } else if (error.message?.includes('invalid data') || error.message?.includes('Unsupported field value')) {
        setError('Erreur lors de la création du profil. Veuillez réessayer avec des informations valides.');
      } else {
        setError('Erreur lors de la création du compte. Veuillez réessayer.');
      }
      throw error; // Propager l'erreur pour qu'elle soit gérée dans le composant
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      setError(null);
      const userProfile = await signInWithGoogle();
      setUser(userProfile);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      if (error.code === 'auth/popup-blocked') {
        setError('La fenêtre pop-up a été bloquée. Veuillez autoriser les pop-ups pour ce site.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('Vous avez fermé la fenêtre de connexion avant de terminer.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Cette erreur est normale lorsque plusieurs popups sont demandés, pas besoin d'afficher d'erreur
        return;
      } else if (error.code === 'auth/network-request-failed') {
        setError('Problème de connexion réseau. Veuillez vérifier votre connexion Internet.');
      } else if (error.message?.includes('third-party cookies') || error.message?.includes('third party cookies')) {
        setError('Les cookies tiers semblent bloqués. Veuillez vérifier les paramètres de votre navigateur.');
      } else if (error.code === 'auth/user-agent-rejected' || error.code === 'auth/unauthorized-domain' || 
                 error.message?.includes('403') || error.message?.includes('forbidden') || 
                 error.message?.includes('disallow') || error.message?.includes('user agent')) {
        setError('Votre navigateur a été bloqué par les politiques de sécurité Google (erreur 403). Veuillez essayer un autre navigateur ou appareil.');
      } else {
        setError('Erreur lors de la connexion avec Google. Veuillez réessayer.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Erreur lors de la déconnexion');
    }
  };

  const value = {
    user,
    loading,
    error,
    handleSignIn,
    handleSignUp,
    handleSignInWithGoogle,
    handleSignOut: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 