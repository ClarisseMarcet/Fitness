"use client";

import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { getUserHealthRecords, HealthRecord } from '../../services/firebaseService';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

export default function HistoryPage() {
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
        setRecords(userRecords);
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError('Impossible de charger l\'historique. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [user, router]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Historique de vos calculs</h1>
        
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
            <p className="text-gray-600 mb-4">Vous n'avez pas encore de calculs enregistrés.</p>
            <a 
              href="/calculator" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Faire un calcul
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {records.map((record) => (
              <div key={record.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">
                    Calcul du {formatDate(record.createdAt)}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    record.metrics.activityLevel === 'sedentary' 
                      ? 'bg-red-100 text-red-800' 
                      : record.metrics.activityLevel === 'extra'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {record.metrics.activityLevel === 'sedentary' 
                      ? 'Sédentaire' 
                      : record.metrics.activityLevel === 'extra'
                        ? 'Très actif'
                        : 'Modérément actif'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h3 className="font-medium mb-2">Métriques</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li>Poids: {record.metrics.weight} kg</li>
                      <li>Taille: {record.metrics.height} cm</li>
                      <li>Âge: {record.metrics.age} ans</li>
                      <li>Genre: {record.metrics.gender === 'male' ? 'Homme' : 'Femme'}</li>
                      <li>Niveau d'activité: {
                        record.metrics.activityLevel === 'sedentary' ? 'Sédentaire' :
                        record.metrics.activityLevel === 'light' ? 'Légèrement actif' :
                        record.metrics.activityLevel === 'moderate' ? 'Modérément actif' :
                        record.metrics.activityLevel === 'very' ? 'Très actif' :
                        'Extrêmement actif'
                      }</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Résultats</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li>IMC: {record.results.bmi.toFixed(1)}</li>
                      <li>Métabolisme de base: {Math.round(record.results.bmr)} calories/jour</li>
                      <li>Besoins caloriques: {Math.round(record.results.tdee)} calories/jour</li>
                      <li>Objectif calorique: {Math.round(record.results.targetCalories)} calories/jour</li>
                    </ul>
                  </div>
                </div>
                
                {record.recommendations && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-medium mb-2">Recommandations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-gray-50 rounded">
                        <h4 className="font-medium text-sm mb-1">Alimentation</h4>
                        <ul className="text-sm text-gray-600">
                          {record.recommendations.diet.map((rec, index) => (
                            <li key={index} className="mb-1">• {rec}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <h4 className="font-medium text-sm mb-1">Exercice</h4>
                        <ul className="text-sm text-gray-600">
                          {record.recommendations.exercise.map((rec, index) => (
                            <li key={index} className="mb-1">• {rec}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <h4 className="font-medium text-sm mb-1">Mode de vie</h4>
                        <ul className="text-sm text-gray-600">
                          {record.recommendations.lifestyle.map((rec, index) => (
                            <li key={index} className="mb-1">• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
} 