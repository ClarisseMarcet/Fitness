"use client";

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { saveHealthRecord } from '../services/firebaseService';
import { Icon } from '@iconify/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Définir un type qui combine jsPDF avec les propriétés additionnelles
type jsPDFWithAutoTable = jsPDF & {
  lastAutoTable: {
    finalY: number;
  };
}

interface FormData {
  // Informations de base
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  
  // Objectifs et préférences
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'health';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  frequency: 'daily' | 'weekly' | 'biweekly';
  
  // Habitudes de vie
  sleepHours: number;
  stressLevel: 'low' | 'medium' | 'high';
  dietType: 'balanced' | 'vegetarian' | 'vegan' | 'keto' | 'other';
  
  // Conditions médicales
  hasMedicalConditions: boolean;
  medicalConditions: string[];
}

export default function HealthCalculator() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<{
    bmi: number;
    bmr: number;
    tdee: number;
    targetCalories: number;
    recommendations: {
      diet: string[];
      exercise: string[];
      lifestyle: string[];
    };
    metrics: {
      weight: number;
      height: number;
      age: number;
      gender: string;
      activityLevel: string;
    };
    results: {
      bmi: number;
      bmr: number;
      tdee: number;
      targetCalories: number;
    };
  } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    age: 25,
    gender: 'male',
    weight: 70,
    height: 170,
    goal: 'maintenance',
    activityLevel: 'moderate',
    frequency: 'weekly',
    sleepHours: 7,
    stressLevel: 'medium',
    dietType: 'balanced',
    hasMedicalConditions: false,
    medicalConditions: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Calcul des métriques de santé
      const bmi = formData.weight / Math.pow(formData.height / 100, 2);
      const bmr = formData.gender === 'male' 
        ? 88.362 + (13.397 * formData.weight) + (4.799 * formData.height) - (5.677 * formData.age)
        : 447.593 + (9.247 * formData.weight) + (3.098 * formData.height) - (4.330 * formData.age);

      // Facteurs d'activité
      const activityFactors = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        very: 1.725,
        extra: 1.9
      };

      const tdee = bmr * activityFactors[formData.activityLevel];
      
      // Calcul des calories cibles selon l'objectif
      let targetCalories = tdee;
      switch(formData.goal) {
        case 'weight_loss':
          targetCalories -= 500;
          break;
        case 'muscle_gain':
          targetCalories += 300;
          break;
        case 'maintenance':
          // Garder le même niveau
          break;
        case 'health':
          // Ajuster légèrement vers le bas pour une meilleure santé
          targetCalories -= 200;
          break;
      }

      // Génération des recommandations personnalisées
      const recommendations = generateRecommendations(formData, bmi, tdee);

      // Mettre à jour les résultats de l'analyse
      setAnalysisResults({
        bmi,
        bmr,
        tdee,
        targetCalories,
        recommendations,
        metrics: {
          weight: formData.weight,
          height: formData.height,
          age: formData.age,
          gender: formData.gender,
          activityLevel: formData.activityLevel
        },
        results: {
          bmi,
          bmr,
          tdee,
          targetCalories
        }
      });

      if (user) {
        await saveHealthRecord(user.uid, {
          metrics: {
            weight: formData.weight,
            height: formData.height,
            age: formData.age,
            gender: formData.gender,
            activityLevel: formData.activityLevel
          },
          results: {
            bmi,
            bmr,
            tdee,
            targetCalories
          },
          recommendations
        });
        setSaveSuccess(true);
      }
    } catch (error) {
      console.error('Error saving health record:', error);
      setSaveError('Une erreur est survenue lors de la sauvegarde des données.');
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (data: FormData, bmi: number, tdee: number) => {
    const recommendations = {
      diet: [] as string[],
      exercise: [] as string[],
      lifestyle: [] as string[]
    };

    // Recommandations diététiques
    if (data.goal === 'weight_loss') {
      recommendations.diet.push('Privilégiez les protéines maigres et les légumes');
      recommendations.diet.push('Limitez les glucides simples et les sucres ajoutés');
    } else if (data.goal === 'muscle_gain') {
      recommendations.diet.push('Augmentez votre apport en protéines');
      recommendations.diet.push('Consommez des glucides complexes pour l\'énergie');
    } else {
      recommendations.diet.push('Maintenez une alimentation équilibrée');
      recommendations.diet.push('Privilégiez les aliments non transformés');
    }

    // Recommandations d'exercice
    const frequencyText = {
      daily: 'quotidienne',
      weekly: 'hebdomadaire',
      biweekly: 'bi-hebdomadaire'
    }[data.frequency];

    recommendations.exercise.push(`Plan d'entraînement ${frequencyText} adapté à votre niveau`);
    recommendations.exercise.push('Combinez cardio et musculation pour de meilleurs résultats');
    
    if (data.activityLevel === 'sedentary') {
      recommendations.exercise.push('Commencez par des exercices légers et augmentez progressivement');
    }

    // Recommandations de style de vie
    if (data.sleepHours < 7) {
      recommendations.lifestyle.push('Essayez de dormir au moins 7-8 heures par nuit');
    }
    if (data.stressLevel === 'high') {
      recommendations.lifestyle.push('Pratiquez des techniques de gestion du stress');
    }
    
    // Recommandations générales de mode de vie
    recommendations.lifestyle.push('Maintenez une routine régulière pour vos repas');
    recommendations.lifestyle.push('Restez hydraté tout au long de la journée');
    recommendations.lifestyle.push('Prenez des pauses régulières si vous travaillez assis');
    
    if (data.hasMedicalConditions) {
      recommendations.lifestyle.push('Consultez régulièrement votre médecin pour un suivi');
    }

    return recommendations;
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleDownloadReport = () => {
    if (!analysisResults) return;
    
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    // En-tête
    doc.setFontSize(20);
    doc.text('Rapport de Santé Personnalisé', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
    
    // Métriques
    doc.setFontSize(16);
    doc.text('Métriques', 20, 45);
    
    doc.setFontSize(12);
    const metrics = [
      ['Poids', `${analysisResults.metrics.weight} kg`],
      ['Taille', `${analysisResults.metrics.height} cm`],
      ['Âge', `${analysisResults.metrics.age} ans`],
      ['Genre', analysisResults.metrics.gender === 'male' ? 'Homme' : 'Femme'],
      ['Niveau d\'activité', 
        analysisResults.metrics.activityLevel === 'sedentary' ? 'Sédentaire' :
        analysisResults.metrics.activityLevel === 'light' ? 'Légèrement actif' :
        analysisResults.metrics.activityLevel === 'moderate' ? 'Modérément actif' :
        analysisResults.metrics.activityLevel === 'very' ? 'Très actif' :
        'Extrêmement actif'
      ]
    ];
    
    autoTable(doc, {
      startY: 50,
      head: [['Métrique', 'Valeur']],
      body: metrics,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Résultats
    doc.setFontSize(16);
    doc.text('Résultats', 20, doc.lastAutoTable.finalY + 20);
    
    doc.setFontSize(12);
    const results = [
      ['IMC', analysisResults.results.bmi.toFixed(1)],
      ['Métabolisme de base', `${Math.round(analysisResults.results.bmr)} calories/jour`],
      ['Besoins caloriques', `${Math.round(analysisResults.results.tdee)} calories/jour`],
      ['Objectif calorique', `${Math.round(analysisResults.results.targetCalories)} calories/jour`]
    ];
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      head: [['Métrique', 'Valeur']],
      body: results,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Recommandations
    doc.setFontSize(16);
    doc.text('Recommandations', 20, doc.lastAutoTable.finalY + 20);
    
    doc.setFontSize(12);
    doc.text('Alimentation:', 20, doc.lastAutoTable.finalY + 30);
    analysisResults.recommendations.diet.forEach((rec, index) => {
      doc.text(`• ${rec}`, 30, doc.lastAutoTable.finalY + 40 + (index * 10));
    });
    
    doc.text('Exercice:', 20, doc.lastAutoTable.finalY + 40 + (analysisResults.recommendations.diet.length * 10) + 10);
    analysisResults.recommendations.exercise.forEach((rec, index) => {
      doc.text(`• ${rec}`, 30, doc.lastAutoTable.finalY + 50 + (analysisResults.recommendations.diet.length * 10) + (index * 10));
    });
    
    doc.text('Mode de vie:', 20, doc.lastAutoTable.finalY + 50 + (analysisResults.recommendations.diet.length * 10) + (analysisResults.recommendations.exercise.length * 10) + 10);
    analysisResults.recommendations.lifestyle.forEach((rec, index) => {
      doc.text(`• ${rec}`, 30, doc.lastAutoTable.finalY + 60 + (analysisResults.recommendations.diet.length * 10) + (analysisResults.recommendations.exercise.length * 10) + (index * 10));
    });
    
    // Pied de page
    const pageCount = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} sur ${pageCount}`,
        (doc.internal as any).pageSize.width / 2,
        (doc.internal as any).pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    // Sauvegarder le PDF
    doc.save(`rapport-sante-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Calculateur de Santé Personnalisé
          </h1>
          <p className="text-lg text-gray-600">
            Obtenez des recommandations personnalisées basées sur votre profil unique
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Barre de progression */}
          <div className="bg-gray-50 px-4 sm:px-6 py-4">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex items-center ${
                    step <= currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 ${
                    step <= currentStep ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                  }`}>
                    <span className="text-xs sm:text-sm">{step}</span>
                  </div>
                  {step < 4 && (
                    <div className={`h-1 w-6 sm:w-16 mx-1 sm:mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-500">
              <span>Infos de base</span>
              <span>Objectifs</span>
              <span>Habitudes</span>
              <span>Analyse</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            {/* Étape 1: Informations de base */}
            {currentStep === 1 && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  <Icon icon="mdi:account-details" className="inline-block mr-2" />
                  Informations de base
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Âge
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Genre
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poids (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taille (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Étape 2: Objectifs et préférences */}
            {currentStep === 2 && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  <Icon icon="mdi:target" className="inline-block mr-2" />
                  Objectifs et préférences
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Objectif principal
                    </label>
                    <select
                      name="goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="weight_loss">Perte de poids</option>
                      <option value="muscle_gain">Prise de muscle</option>
                      <option value="maintenance">Maintien</option>
                      <option value="health">Amélioration de la santé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Niveau d'activité
                    </label>
                    <select
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="sedentary">Sédentaire</option>
                      <option value="light">Légèrement actif</option>
                      <option value="moderate">Modérément actif</option>
                      <option value="very">Très actif</option>
                      <option value="extra">Extrêmement actif</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fréquence d'entraînement souhaitée
                    </label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="daily">Quotidienne</option>
                      <option value="weekly">Hebdomadaire</option>
                      <option value="biweekly">Bi-hebdomadaire</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Étape 3: Habitudes de vie */}
            {currentStep === 3 && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  <Icon icon="mdi:heart-pulse" className="inline-block mr-2" />
                  Habitudes de vie
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heures de sommeil par nuit
                    </label>
                    <input
                      type="number"
                      name="sleepHours"
                      value={formData.sleepHours}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="4"
                      max="12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Niveau de stress
                    </label>
                    <select
                      name="stressLevel"
                      value={formData.stressLevel}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="low">Faible</option>
                      <option value="medium">Moyen</option>
                      <option value="high">Élevé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de régime alimentaire
                    </label>
                    <select
                      name="dietType"
                      value={formData.dietType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="balanced">Équilibré</option>
                      <option value="vegetarian">Végétarien</option>
                      <option value="vegan">Végétalien</option>
                      <option value="keto">Céto</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Conditions médicales
                    </label>
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="hasMedicalConditions"
                          checked={formData.hasMedicalConditions}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            hasMedicalConditions: e.target.checked
                          }))}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          J'ai des conditions médicales à prendre en compte
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Étape 4: Analyse IA */}
            {currentStep === 4 && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  <Icon icon="mdi:robot" className="inline-block mr-2" />
                  Analyse IA
                </h2>

                {analysisResults ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                          <Icon icon="mdi:chart-box" className="mr-2" />
                          Vos métriques
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex justify-between items-center bg-blue-100/50 rounded-lg p-2 sm:p-3">
                            <span className="font-medium text-blue-800">IMC:</span>
                            <span className="text-blue-800">{analysisResults.bmi.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between items-center bg-blue-100/50 rounded-lg p-2 sm:p-3">
                            <span className="font-medium text-blue-800">Métabolisme de base:</span>
                            <span className="text-blue-800">{Math.round(analysisResults.bmr)} kcal/jour</span>
                          </div>
                          <div className="flex justify-between items-center bg-blue-100/50 rounded-lg p-2 sm:p-3">
                            <span className="font-medium text-blue-800">Dépense énergétique totale:</span>
                            <span className="text-blue-800">{Math.round(analysisResults.tdee)} kcal/jour</span>
                          </div>
                          <div className="flex justify-between items-center bg-blue-100/50 rounded-lg p-2 sm:p-3">
                            <span className="font-medium text-blue-800">Calories cibles:</span>
                            <span className="text-blue-800">{Math.round(analysisResults.targetCalories)} kcal/jour</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 sm:p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                          <Icon icon="mdi:star-check" className="mr-2" />
                          Recommandations
                        </h3>
                        <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-[300px] pr-2">
                          <div>
                            <h4 className="font-medium text-green-800 mb-2 flex items-center">
                              <Icon icon="mdi:food-apple" className="mr-2" />
                              Alimentation
                            </h4>
                            <ul className="list-none space-y-1">
                              {analysisResults.recommendations.diet.map((rec, index) => (
                                <li key={index} className="pl-4 border-l-2 border-green-200 text-green-700 text-sm py-1">
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-green-800 mb-2 flex items-center">
                              <Icon icon="mdi:dumbbell" className="mr-2" />
                              Exercice
                            </h4>
                            <ul className="list-none space-y-1">
                              {analysisResults.recommendations.exercise.map((rec, index) => (
                                <li key={index} className="pl-4 border-l-2 border-green-200 text-green-700 text-sm py-1">
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-green-800 mb-2 flex items-center">
                              <Icon icon="mdi:heart-pulse" className="mr-2" />
                              Mode de vie
                            </h4>
                            <ul className="list-none space-y-1">
                              {analysisResults.recommendations.lifestyle.map((rec, index) => (
                                <li key={index} className="pl-4 border-l-2 border-green-200 text-green-700 text-sm py-1">
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                    <p className="text-blue-800 mb-4">
                      Notre IA va analyser vos informations pour générer des recommandations personnalisées.
                      Cliquez sur "Analyser" pour obtenir votre plan personnalisé.
                    </p>
                  </div>
                )}

                {!user && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Icon icon="mdi:alert" className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Connectez-vous pour sauvegarder vos résultats et accéder à votre historique.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {saveSuccess && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Icon icon="mdi:check-circle" className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          Vos résultats ont été sauvegardés avec succès !
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {saveError && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Icon icon="mdi:alert-circle" className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          {saveError}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    onClick={handleDownloadReport}
                    disabled={!analysisResults}
                    className="inline-flex items-center bg-blue-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon icon="mdi:download" className="mr-2" />
                    Télécharger le rapport
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 sm:mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Icon icon="mdi:arrow-left" className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Précédent</span>
                  <span className="sm:hidden">Préc.</span>
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className={`ml-auto inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${currentStep === 1 && 'ml-0'}`}
                >
                  <span className="hidden sm:inline">Suivant</span>
                  <span className="sm:hidden">Suiv.</span>
                  <Icon icon="mdi:arrow-right" className="ml-1 sm:ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`ml-auto inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${currentStep === 1 && 'ml-0'}`}
                >
                  {loading ? (
                    <>
                      <Icon icon="mdi:loading" className="animate-spin mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Analyse en cours...</span>
                      <span className="sm:hidden">Analyse...</span>
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:robot" className="mr-1 sm:mr-2" />
                      <span>Analyser</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 