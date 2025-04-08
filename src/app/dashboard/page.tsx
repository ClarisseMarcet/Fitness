"use client";

import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { getUserHealthRecords, HealthRecord } from '../../services/firebaseService';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        setLoading(true);
        const userRecords = await getUserHealthRecords();
        setRecords(userRecords.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError('Impossible de charger les données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [user, router]);

  const getLatestRecord = () => {
    return records[0];
  };

  const calculateProgress = () => {
    if (records.length < 2) return null;

    const latest = records[0];
    const previous = records[1];
    
    return {
      weight: latest.metrics.weight - previous.metrics.weight,
      bmi: latest.results.bmi - previous.results.bmi,
      tdee: latest.results.tdee - previous.results.tdee
    };
  };

  const getGoalStatus = () => {
    if (!records.length) return null;
    
    const latest = records[0];
    const progress = calculateProgress();
    
    if (!progress) return null;

    switch (latest.metrics.goal) {
      case 'loss':
        return progress.weight < 0 ? 'positive' : 'negative';
      case 'gain':
        return progress.weight > 0 ? 'positive' : 'negative';
      default:
        return 'neutral';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-16 sm:mt-20">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Tableau de bord</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        ) : records.length === 0 ? (
          <div className="p-6 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600 mb-4">Bienvenue ! Commencez par faire votre premier calcul.</p>
            <a 
              href="/calculator" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Faire un calcul
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Résumé des progrès */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Poids</h3>
                <p className="text-2xl sm:text-3xl font-bold mb-2">{getLatestRecord().metrics.weight} kg</p>
                {calculateProgress() && (
                  <p className={`text-sm ${
                    getGoalStatus() === 'positive' ? 'text-green-600' : 
                    getGoalStatus() === 'negative' ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {(() => {
                      const progress = calculateProgress();
                      if (!progress) return null;
                      return (
                        <>
                          {progress.weight > 0 ? '+' : ''}
                          {progress.weight.toFixed(1)} kg depuis le dernier calcul
                        </>
                      );
                    })()}
                  </p>
                )}
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">IMC</h3>
                <p className="text-2xl sm:text-3xl font-bold mb-2">{getLatestRecord().results.bmi.toFixed(1)}</p>
                <p className="text-sm text-gray-600">{getLatestRecord().results.bmiStatus}</p>
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md sm:col-span-2 lg:col-span-1">
                <h3 className="text-lg font-semibold mb-2">Besoins caloriques</h3>
                <p className="text-2xl sm:text-3xl font-bold mb-2">{Math.round(getLatestRecord().results.tdee)}</p>
                <p className="text-sm text-gray-600">calories/jour</p>
              </div>
            </div>

            {/* Objectif actuel */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3 sm:mb-4">Objectif actuel</h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                <div>
                  <p className="text-gray-600">
                    {getLatestRecord().metrics.goal === 'loss' 
                      ? 'Perte de poids' 
                      : getLatestRecord().metrics.goal === 'gain' 
                        ? 'Prise de poids' 
                        : 'Maintien du poids'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Objectif calorique: {Math.round(getLatestRecord().results.targetCalories)} calories/jour
                  </p>
                </div>
                <a 
                  href="/calculator" 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center sm:text-left w-full sm:w-auto"
                >
                  Nouveau calcul
                </a>
              </div>
            </div>

            {/* Dernières recommandations */}
            {getLatestRecord().recommendations && (
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-3 sm:mb-4">Dernières recommandations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 sm:p-4 bg-gray-50 rounded">
                    <h4 className="font-medium mb-2 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      Alimentation
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      {Array.isArray(getLatestRecord().recommendations.diet) ? 
                        getLatestRecord().recommendations.diet.map((item, idx) => (
                          <p key={idx} className="pl-4 border-l-2 border-green-100">• {item}</p>
                        )) : 
                        <p>{getLatestRecord().recommendations.diet}</p>
                      }
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 bg-gray-50 rounded">
                    <h4 className="font-medium mb-2 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      Exercice
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      {Array.isArray(getLatestRecord().recommendations.exercise) ? 
                        getLatestRecord().recommendations.exercise.map((item, idx) => (
                          <p key={idx} className="pl-4 border-l-2 border-blue-100">• {item}</p>
                        )) : 
                        <p>{getLatestRecord().recommendations.exercise}</p>
                      }
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 bg-gray-50 rounded">
                    <h4 className="font-medium mb-2 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                      Mode de vie
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      {Array.isArray(getLatestRecord().recommendations.lifestyle) ? 
                        getLatestRecord().recommendations.lifestyle.map((item, idx) => (
                          <p key={idx} className="pl-4 border-l-2 border-purple-100">• {item}</p>
                        )) : 
                        <p>{getLatestRecord().recommendations.lifestyle}</p>
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Lien vers l'historique */}
            <div className="text-center pt-2">
              <a 
                href="/history" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                Voir l'historique complet
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 