"use client";

import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import HealthCalculator from '../../components/HealthCalculator';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

export default function CalculatorPage() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 mt-16 sm:mt-20">
        {user ? (
          <HealthCalculator />
        ) : (
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-3">Connectez-vous pour sauvegarder vos résultats</h2>
            <p className="text-gray-600 mb-6">
              Créez un compte gratuit pour sauvegarder vos calculs et suivre vos progrès au fil du temps.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link 
                href="/login"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                Se connecter
              </Link>
              <Link 
                href="/register"
                className="bg-gray-100 text-gray-800 px-6 py-2 rounded hover:bg-gray-200 transition-colors w-full sm:w-auto"
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