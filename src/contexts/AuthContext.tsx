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
  signInWithGoogle
} from '../services/firebaseService';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
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
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setError(null);
      const userProfile = await signIn(email, password);
      setUser(userProfile);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Email ou mot de passe incorrect');
    }
  };

  const handleSignUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      const userProfile = await signUp(email, password, displayName);
      setUser(userProfile);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Erreur lors de la création du compte');
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      setError(null);
      const userProfile = await signInWithGoogle();
      setUser(userProfile);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Erreur lors de la connexion avec Google');
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
    signIn: handleSignIn,
    signUp: handleSignUp,
    signInWithGoogle: handleSignInWithGoogle,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 