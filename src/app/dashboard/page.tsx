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
          new Date(b.date).getTime() - new Date(a.date).getTime()
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
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
        
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Poids</h3>
                <p className="text-3xl font-bold mb-2">{getLatestRecord().metrics.weight} kg</p>
                {calculateProgress() && (
                  <p className={`text-sm ${
                    getGoalStatus() === 'positive' ? 'text-green-600' : 
                    getGoalStatus() === 'negative' ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {calculateProgress()?.weight > 0 ? '+' : ''}{calculateProgress()?.weight.toFixed(1)} kg depuis le dernier calcul
                  </p>
                )}
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">IMC</h3>
                <p className="text-3xl font-bold mb-2">{getLatestRecord().results.bmi.toFixed(1)}</p>
                <p className="text-sm text-gray-600">{getLatestRecord().results.bmiStatus}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Besoins caloriques</h3>
                <p className="text-3xl font-bold mb-2">{Math.round(getLatestRecord().results.tdee)}</p>
                <p className="text-sm text-gray-600">calories/jour</p>
              </div>
            </div>

            {/* Objectif actuel */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Objectif actuel</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">
                    {getLatestRecord().metrics.goal === 'loss' 
                      ? 'Perte de poids' 
                      : getLatestRecord().metrics.goal === 'gain' 
                        ? 'Prise de poids' 
                        : 'Maintien du poids'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Objectif calorique: {Math.round(getLatestRecord().results.targetCalories)} calories/jour
                  </p>
                </div>
                <a 
                  href="/calculator" 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Nouveau calcul
                </a>
              </div>
            </div>

            {/* Dernières recommandations */}
            {getLatestRecord().recommendations && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Dernières recommandations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded">
                    <h4 className="font-medium mb-2">Alimentation</h4>
                    <p className="text-sm text-gray-600">{getLatestRecord().recommendations.diet}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded">
                    <h4 className="font-medium mb-2">Exercice</h4>
                    <p className="text-sm text-gray-600">{getLatestRecord().recommendations.exercise}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded">
                    <h4 className="font-medium mb-2">Mode de vie</h4>
                    <p className="text-sm text-gray-600">{getLatestRecord().recommendations.lifestyle}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Lien vers l'historique */}
            <div className="text-center">
              <a 
                href="/history" 
                className="text-blue-600 hover:text-blue-800"
              >
                Voir l'historique complet →
              </a>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 