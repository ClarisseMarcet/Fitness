const GEMINI_API_URL = process.env.NEXT_PUBLIC_GEMINI_API_URL;
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export interface HealthRecommendation {
  diet: string;
  exercise: string;
  lifestyle: string;
}

export const getHealthRecommendations = async (
  metrics: {
    bmi: number;
    bmr: number;
    tdee: number;
    goal: string;
    activityLevel: string;
  }
): Promise<HealthRecommendation> => {
  const prompt = `En tant que coach de santé et nutrition, donne des recommandations personnalisées pour :
  - IMC: ${metrics.bmi.toFixed(1)}
  - Métabolisme de base: ${Math.round(metrics.bmr)} calories
  - Besoins caloriques quotidiens: ${Math.round(metrics.tdee)} calories
  - Objectif: ${metrics.goal === 'gain' ? 'Prise de poids' : metrics.goal === 'loss' ? 'Perte de poids' : 'Maintien du poids'}
  - Niveau d'activité: ${metrics.activityLevel}
  
  Fournis des recommandations détaillées sur:
  1. L'alimentation (types d'aliments, portions, timing)
  2. L'exercice physique (types d'exercices, fréquence, intensité)
  3. Le mode de vie (habitudes à adopter, erreurs à éviter)`;

  try {
    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const recommendation = data.candidates[0].content.parts[0].text;
    
    // Parse the recommendation into structured data
    const sections = recommendation.split('\n\n');
    return {
      diet: sections.find((s: string) => s.toLowerCase().includes('alimentation')) || '',
      exercise: sections.find((s: string) => s.toLowerCase().includes('exercice')) || '',
      lifestyle: sections.find((s: string) => s.toLowerCase().includes('mode de vie')) || ''
    };
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API Gemini:', error);
    throw new Error('Impossible d\'obtenir les recommandations pour le moment');
  }
}; 