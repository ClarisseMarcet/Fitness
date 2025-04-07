"use client";

import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

export default function HomePage() {
  const { user } = useAuth();

  return (
    
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Votre Coach Santé Personnel
              </h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Calculez votre IMC, métabolisme et obtenez des recommandations personnalisées pour atteindre vos objectifs de santé.
              </p>
              {user ? (
                <Link 
                  href="/dashboard"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Accéder à mon tableau de bord
                </Link>
              ) : (
                <div className="space-x-4">
                  <Link 
                    href="/login"
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Se connecter
                  </Link>
                  <Link 
                    href="/register"
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Fonctionnalités principales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Calculs précis</h3>
              <p className="text-gray-600">
                Obtenez des calculs précis de votre IMC, métabolisme de base et besoins caloriques quotidiens.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Suivi personnalisé</h3>
              <p className="text-gray-600">
                Suivez vos progrès au fil du temps et visualisez votre évolution dans votre tableau de bord personnel.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Recommandations IA</h3>
              <p className="text-gray-600">
                Recevez des recommandations personnalisées basées sur l'IA pour l'alimentation, l'exercice et le mode de vie.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Prêt à commencer votre voyage vers une meilleure santé ?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Rejoignez-nous dès aujourd'hui et commencez à suivre vos progrès avec notre coach santé personnel.
            </p>
            {user ? (
              <Link 
                href="/calculator"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Faire un nouveau calcul
              </Link>
            ) : (
              <Link 
                href="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Commencer gratuitement
              </Link>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
