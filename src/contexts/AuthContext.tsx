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
  UserProfile
} from '../services/firebaseService';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
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
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          const profile = await getUserProfile(currentUser.uid);
          setUserProfile(profile);
        }
      } catch (err) {
        console.error('Error loading user:', err);
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
      const user = await signIn(email, password);
      setUser(user);
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
      router.push('/dashboard');
    } catch (err) {
      console.error('Error signing in:', err);
      setError('Identifiants incorrects');
      throw err;
    }
  };

  const handleSignUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      const profile = await signUp(email, password, displayName);
      setUserProfile(profile);
      router.push('/dashboard');
    } catch (err) {
      console.error('Error signing up:', err);
      setError('Erreur lors de l\'inscription');
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      setError(null);
      await logOut();
      setUser(null);
      setUserProfile(null);
      router.push('/');
    } catch (err) {
      console.error('Error logging out:', err);
      setError('Erreur lors de la déconnexion');
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 