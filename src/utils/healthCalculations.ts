export interface HealthMetrics {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  goal: 'gain' | 'loss' | 'maintain';
}

export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

export const calculateBMR = (metrics: HealthMetrics): number => {
  // Formule de Mifflin-St Jeor
  const { weight, height, age, gender } = metrics;
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
};

export const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const activityMultipliers = {
    sedentary: 1.2,    // Peu ou pas d'exercice
    light: 1.375,      // Exercice léger 1-3 jours/semaine
    moderate: 1.55,    // Exercice modéré 3-5 jours/semaine
    very: 1.725,       // Exercice intense 6-7 jours/semaine
    extra: 1.9         // Exercice très intense + travail physique
  };

  return bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers];
};

export const getCalorieTarget = (tdee: number, goal: string): number => {
  const adjustments = {
    gain: 500,    // Surplus de 500 calories pour la prise de poids
    loss: -500,   // Déficit de 500 calories pour la perte de poids
    maintain: 0    // Maintien du poids actuel
  };

  return tdee + adjustments[goal as keyof typeof adjustments];
};

export const getBMIStatus = (bmi: number): string => {
  if (bmi < 18.5) return 'Insuffisance pondérale';
  if (bmi < 25) return 'Poids normal';
  if (bmi < 30) return 'Surpoids';
  return 'Obésité';
}; 