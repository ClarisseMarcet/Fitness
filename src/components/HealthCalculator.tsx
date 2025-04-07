"use client";

import React, { useState } from 'react';
import { HealthMetrics, calculateBMI, calculateBMR, calculateTDEE, getCalorieTarget, getBMIStatus } from '../utils/healthCalculations';
import { getHealthRecommendations, HealthRecommendation } from '../services/geminiService';
import { saveHealthRecord } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export const HealthCalculator: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<HealthMetrics>({
    weight: 70,
    height: 170,
    age: 30,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain'
  });

  const [results, setResults] = useState<{
    bmi: number;
    bmr: number;
    tdee: number;
    targetCalories: number;
    bmiStatus: string;
    recommendations?: HealthRecommendation;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const bmi = calculateBMI(metrics.weight, metrics.height);
      const bmr = calculateBMR(metrics);
      const tdee = calculateTDEE(bmr, metrics.activityLevel);
      const targetCalories = getCalorieTarget(tdee, metrics.goal);
      const bmiStatus = getBMIStatus(bmi);

      const recommendations = await getHealthRecommendations({
        bmi,
        bmr,
        tdee,
        goal: metrics.goal,
        activityLevel: metrics.activityLevel
      });

      const resultsData = {
        bmi,
        bmr,
        tdee,
        targetCalories,
        bmiStatus,
        recommendations
      };

      setResults(resultsData);

      // Sauvegarder les résultats si l'utilisateur est connecté
      if (user) {
        try {
          await saveHealthRecord({
            date: new Date(),
            metrics: {
              weight: metrics.weight,
              height: metrics.height,
              age: metrics.age,
              gender: metrics.gender,
              activityLevel: metrics.activityLevel,
              goal: metrics.goal
            },
            results: {
              bmi,
              bmr,
              tdee,
              targetCalories,
              bmiStatus
            },
            recommendations
          });
          setSaveSuccess(true);
        } catch (error) {
          console.error('Erreur lors de la sauvegarde:', error);
          setSaveError('Impossible de sauvegarder les résultats. Veuillez réessayer.');
        }
      }
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      alert('Une erreur est survenue lors du calcul');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Calculateur de Santé et Nutrition</h1>
      
      {!user && (
        <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg">
          <p className="mb-2">
            <strong>Conseil :</strong> Connectez-vous pour sauvegarder vos résultats et suivre votre progression.
          </p>
          <button
            onClick={handleLoginRedirect}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Se connecter
          </button>
        </div>
      )}
      
      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
          Vos résultats ont été sauvegardés avec succès !
        </div>
      )}
      
      {saveError && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {saveError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Poids (kg)</label>
            <input
              type="number"
              value={metrics.weight}
              onChange={(e) => setMetrics({ ...metrics, weight: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-2">Taille (cm)</label>
            <input
              type="number"
              value={metrics.height}
              onChange={(e) => setMetrics({ ...metrics, height: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Âge</label>
            <input
              type="number"
              value={metrics.age}
              onChange={(e) => setMetrics({ ...metrics, age: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Genre</label>
            <select
              value={metrics.gender}
              onChange={(e) => setMetrics({ ...metrics, gender: e.target.value as 'male' | 'female' })}
              className="w-full p-2 border rounded"
            >
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Niveau d'activité</label>
            <select
              value={metrics.activityLevel}
              onChange={(e) => setMetrics({ ...metrics, activityLevel: e.target.value as HealthMetrics['activityLevel'] })}
              className="w-full p-2 border rounded"
            >
              <option value="sedentary">Sédentaire</option>
              <option value="light">Léger (1-3 jours/semaine)</option>
              <option value="moderate">Modéré (3-5 jours/semaine)</option>
              <option value="very">Intense (6-7 jours/semaine)</option>
              <option value="extra">Très intense</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Objectif</label>
            <select
              value={metrics.goal}
              onChange={(e) => setMetrics({ ...metrics, goal: e.target.value as HealthMetrics['goal'] })}
              className="w-full p-2 border rounded"
            >
              <option value="loss">Perte de poids</option>
              <option value="maintain">Maintien</option>
              <option value="gain">Prise de poids</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Calcul en cours...' : 'Calculer'}
        </button>
      </form>

      {results && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Résultats</h2>
              <div className="space-y-2">
                <p>IMC: {results.bmi.toFixed(1)} ({results.bmiStatus})</p>
                <p>Métabolisme de base: {Math.round(results.bmr)} calories/jour</p>
                <p>Besoins caloriques quotidiens: {Math.round(results.tdee)} calories/jour</p>
                <p>Objectif calorique: {Math.round(results.targetCalories)} calories/jour</p>
              </div>
            </div>
          </div>

          {results.recommendations && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Recommandations alimentaires</h2>
                <p className="whitespace-pre-line">{results.recommendations.diet}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Recommandations d'exercice</h2>
                <p className="whitespace-pre-line">{results.recommendations.exercise}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Recommandations de mode de vie</h2>
                <p className="whitespace-pre-line">{results.recommendations.lifestyle}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 