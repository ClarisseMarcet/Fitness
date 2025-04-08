"use client";

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Connectez-vous</h2>
        <p className="mt-2 text-sm text-gray-600">
          Ou{' '}
          <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
            créez un compte
          </Link>
        </p>
      </div>

      <div className="p-3 text-sm text-blue-700 bg-blue-50 rounded-md">
        <p className="font-medium">Problèmes de connexion</p>
        <p>Certains navigateurs ou configurations peuvent bloquer les connexions pour les raisons suivantes :</p>
        <ul className="ml-4 mt-1 list-disc">
          <li>Blocage des cookies tiers par Chrome</li>
          <li>Politiques de sécurité des agents utilisateurs (erreur 403)</li>
          <li>Paramètres de confidentialité restrictifs</li>
        </ul>
        <p className="mt-1">Solutions recommandées :</p>
        <ul className="ml-4 mt-1 list-disc">
          <li>Essayez la <strong>connexion avec Google</strong> (mode popup)</li>
          <li>Utilisez un autre navigateur (Firefox, Edge, Safari)</li>
          <li>Désactivez temporairement les extensions de blocage</li>
          <li>
            <a 
              href="#" 
              className="underline"
              onClick={(e) => {
                e.preventDefault();
                alert("Pour ajuster vos paramètres :\n\n1. Cookies tiers :\n   - Chrome : chrome://settings/cookies\n   - Firefox : about:preferences#privacy\n\n2. Si vous avez l'erreur 403 (agent utilisateur) :\n   - Essayez un autre appareil\n   - Utilisez un autre navigateur\n   - Désactivez les extensions VPN ou proxy");
              }}
            >
              Voir les instructions détaillées
            </a>
          </li>
        </ul>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white">Ou continuer avec</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <FaGoogle className="w-5 h-5 mr-2 text-red-500" />
            Google
          </button>
        </div>
      </div>
    </div>
  );
} 