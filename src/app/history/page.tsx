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
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto mb-12 lg:mb-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 shadow-xl">
            <div className="px-8 py-12 sm:py-16 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                VOS PERFORMANCES
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 font-medium max-w-3xl mx-auto">
                Suivez votre progression fitness avec précision
              </p>
              <div className="mt-8 animate-bounce">
                <Icon icon="mdi:arrow-down" className="text-3xl text-white opacity-80" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-t-blue-500 border-r-blue-600 border-b-blue-700 border-l-blue-800 animate-spin"></div>
                <Icon 
                  icon="mdi:dumbbell" 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-blue-600" 
                />
              </div>
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto p-6 bg-red-500 text-white rounded-xl text-center font-bold shadow-md">
              <div className="flex justify-center items-center mb-2">
                <Icon icon="mdi:alert-circle" className="text-3xl mr-2" />
                <span className="text-xl">ATTENTION</span>
              </div>
              <p className="text-lg">{error}</p>
            </div>
          ) : records.length === 0 ? (
            <div className="max-w-2xl mx-auto">
              <div className="p-8 bg-white rounded-xl shadow-lg border-2 border-blue-400 text-center">
                <div className="inline-block p-5 bg-blue-100 rounded-full mb-5">
                  <Icon icon="mdi:dumbbell" className="text-5xl text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Commencez votre parcours fitness
                </h2>
                <p className="text-gray-600 mb-6">
                  Aucun résultat enregistré. Lancez votre premier calcul !
                </p>
                <a 
                  href="/calculator" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  Nouveau calcul
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {records.map((record) => (
                <div 
                  key={record.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors duration-300"
                >
                  {/* Record Header */}
                  <div className="bg-blue-600 px-6 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center">
                        <Icon 
                          icon={record.metrics.gender === 'male' ? "mdi:weight-lifter" : "mdi:woman-athlete"} 
                          className={`text-3xl mr-4 ${
                            record.metrics.gender === 'male' ? 'text-blue-300' : 'text-pink-300'
                          }`} 
                        />
                        <div>
                          <h2 className="text-xl font-bold text-white">
                            {formatDate(record.createdAt)}
                          </h2>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-1 bg-white bg-opacity-20 text-white rounded-full text-xs font-semibold">
                              {record.metrics.age} ans
                            </span>
                            <span className="px-2 py-1 bg-white bg-opacity-20 text-white rounded-full text-xs font-semibold">
                              {record.metrics.weight} kg
                            </span>
                            <span className="px-2 py-1 bg-white bg-opacity-20 text-white rounded-full text-xs font-semibold">
                              {record.metrics.height} cm
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${
                        record.metrics.activityLevel === 'sedentary' 
                          ? 'bg-red-500 text-white' 
                          : record.metrics.activityLevel === 'extra'
                            ? 'bg-green-500 text-white'
                            : 'bg-yellow-500 text-white'
                      }`}>
                        {record.metrics.activityLevel === 'sedentary' 
                          ? 'Sédentaire' 
                          : record.metrics.activityLevel === 'extra'
                            ? 'Extra actif'
                            : 'Actif'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Metrics & Results */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Metrics Card */}
                    <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <Icon icon="mdi:chart-box" className="text-xl text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Métriques
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <Icon icon="mdi:weight" className="text-gray-500 mr-3" />
                          <span className="text-gray-700">
                            <span className="font-semibold">Poids:</span> {record.metrics.weight} kg
                          </span>
                        </li>
                        <li className="flex items-center">
                          <Icon icon="mdi:human-male-height" className="text-gray-500 mr-3" />
                          <span className="text-gray-700">
                            <span className="font-semibold">Taille:</span> {record.metrics.height} cm
                          </span>
                        </li>
                        <li className="flex items-center">
                          <Icon icon="mdi:cake-variant" className="text-gray-500 mr-3" />
                          <span className="text-gray-700">
                            <span className="font-semibold">Âge:</span> {record.metrics.age} ans
                          </span>
                        </li>
                        <li className="flex items-center">
                          <Icon 
                            icon={record.metrics.gender === 'male' ? "mdi:gender-male" : "mdi:gender-female"} 
                            className={`mr-3 ${
                              record.metrics.gender === 'male' ? 'text-blue-500' : 'text-pink-500'
                            }`} 
                          />
                          <span className="text-gray-700">
                            <span className="font-semibold">Genre:</span> {record.metrics.gender === 'male' ? 'Homme' : 'Femme'}
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Results Card */}
                    <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                          <Icon icon="mdi:medal" className="text-xl text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Résultats
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <Icon icon="mdi:human" className="text-gray-500 mr-3" />
                          <span className="text-gray-700">
                            <span className="font-semibold">IMC:</span> {record.results.bmi.toFixed(1)}
                          </span>
                        </li>
                        <li className="flex items-center">
                          <Icon icon="mdi:fire" className="text-gray-500 mr-3" />
                          <span className="text-gray-700">
                            <span className="font-semibold">Métabolisme:</span> {Math.round(record.results.bmr)} cal/jour
                          </span>
                        </li>
                        <li className="flex items-center">
                          <Icon icon="mdi:lightning-bolt" className="text-gray-500 mr-3" />
                          <span className="text-gray-700">
                            <span className="font-semibold">Besoins:</span> {Math.round(record.results.tdee)} cal/jour
                          </span>
                        </li>
                        <li className="flex items-center">
                          <Icon icon="mdi:target" className="text-gray-500 mr-3" />
                          <span className="text-gray-700">
                            <span className="font-semibold">Objectif:</span> {Math.round(record.results.targetCalories)} cal/jour
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Recommendations */}
                  {record.recommendations && (
                    <div className="px-6 pb-6">
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-center mb-6">
                          <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-full uppercase">
                            Recommandations
                          </span>
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Diet Card */}
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                              <Icon icon="mdi:nutrition" className="mr-2 text-blue-600" />
                              Alimentation
                            </h4>
                            <ul className="space-y-2">
                              {record.recommendations.diet.map((rec, index) => (
                                <li key={index} className="flex items-start text-sm text-gray-700">
                                  <span className="text-blue-500 mr-2 mt-1">•</span> 
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Exercise Card */}
                          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                              <Icon icon="mdi:run-fast" className="mr-2 text-green-600" />
                              Exercices
                            </h4>
                            <ul className="space-y-2">
                              {record.recommendations.exercise.map((rec, index) => (
                                <li key={index} className="flex items-start text-sm text-gray-700">
                                  <span className="text-green-500 mr-2 mt-1">•</span> 
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Lifestyle Card */}
                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                              <Icon icon="mdi:bed" className="mr-2 text-purple-600" />
                              Mode de vie
                            </h4>
                            <ul className="space-y-2">
                              {record.recommendations.lifestyle.map((rec, index) => (
                                <li key={index} className="flex items-start text-sm text-gray-700">
                                  <span className="text-purple-500 mr-2 mt-1">•</span> 
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}