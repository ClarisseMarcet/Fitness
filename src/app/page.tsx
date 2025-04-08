"use client";

import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/fitness.jpg"
              alt="Fitness"
              fill
              style={{ objectFit: 'cover' }}
              priority
              className="brightness-50"
            />
          </div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              Coach IA - Votre coach sportif personnel
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 max-w-2xl mx-auto">
              Obtenez des recommandations personnalisées pour atteindre vos objectifs de santé
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link 
                href="/calculator" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors text-sm sm:text-base"
              >
                Commencer
              </Link>
              {!user && (
                <Link 
                  href="/register" 
                  className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors text-sm sm:text-base"
                >
                  S'inscrire gratuitement
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 md:py-16 px-4 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Fonctionnalités</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-5 md:p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl md:text-4xl mb-3 md:mb-4">📊</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Calculs personnalisés</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Calculez votre IMC, métabolisme de base et besoins caloriques quotidiens.
              </p>
            </div>
            
            <div className="bg-white p-5 md:p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl md:text-4xl mb-3 md:mb-4">🤖</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Recommandations IA</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Recevez des conseils personnalisés pour l'alimentation, l'exercice et le mode de vie.
              </p>
            </div>
            
            <div className="bg-white p-5 md:p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl md:text-4xl mb-3 md:mb-4">📱</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Suivi de progression</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Suivez vos progrès au fil du temps et visualisez votre historique de calculs.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 text-white py-12 md:py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Prêt à commencer votre voyage vers une meilleure santé ?</h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8">
              Rejoignez Coach IA aujourd'hui et obtenez des recommandations personnalisées pour atteindre vos objectifs.
            </p>
            <Link 
              href={user ? "/calculator" : "/register"} 
              className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors inline-block text-sm sm:text-base"
            >
              {user ? "Faire un calcul" : "S'inscrire gratuitement"}
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
