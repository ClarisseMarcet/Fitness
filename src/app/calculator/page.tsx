"use client";

import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { HealthCalculator } from '../../components/HealthCalculator';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

export default function CalculatorPage() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Calculateur de Santé</h1>
          <p className="text-gray-600">
            Entrez vos informations pour obtenir des calculs personnalisés et des recommandations adaptées à vos objectifs.
          </p>
        </div>

        {user ? (
          <HealthCalculator />
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Connectez-vous pour sauvegarder vos résultats</h2>
            <p className="text-gray-600 mb-6">
              Créez un compte gratuit pour sauvegarder vos calculs et suivre vos progrès au fil du temps.
            </p>
            <div className="space-x-4">
              <Link 
                href="/login"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Se connecter
              </Link>
              <Link 
                href="/register"
                className="bg-gray-100 text-gray-800 px-6 py-2 rounded hover:bg-gray-200 transition-colors"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 