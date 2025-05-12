import { db } from '../../lib/firebase'; // Assurez-vous que db est bien importé et initialisé
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  Timestamp 
} from 'firebase/firestore';

// Type pour le plan d'entraînement
interface JourEntrainement {
  jour: string;
  exercices: string[];
  complet: boolean;
  date?: Date;
}

interface PlanEntrainement {
  sport: string;
  jours: JourEntrainement[];
}

// Type pour les performances
interface Performance {
  date: Date;
  jour: string;
  sport: string;
  exercices: string[];
  calories: number;
  duree: number;
  intensite: string;
  equipements: string[];
}

// Type pour les paramètres utilisateur
interface UserSettings {
  niveau: string;
  sportsSelectionnes: string[];
  sportPersonnalise: string;
  frequence: number;
  abonnement: string;
  objectifs?: string;
  blessures?: string;
  disponibilites?: string[];
  profileImage?: string;
  stravaConnected?: boolean;
}

// Type principal pour les données
interface TrainingData {
  planEntrainement?: PlanEntrainement[];
  performances?: Performance[];
  userSettings?: UserSettings;
}

// Sauvegarder toutes les données d'entraînement
export const saveAllTrainingData = async (
  userId: string, 
  data: TrainingData
) => {
  try {
    if (!db) {
      throw new Error("Firestore n'est pas initialisé correctement");
    }

    // Convertir les dates en Timestamp Firebase
    const dataToSave = {
      ...data,
      planEntrainement: data.planEntrainement?.map(plan => ({
        ...plan,
        jours: plan.jours.map(jour => ({
          ...jour,
          date: jour.date ? Timestamp.fromDate(jour.date) : undefined
        }))
      })),
      performances: data.performances?.map(perf => ({
        ...perf,
        date: Timestamp.fromDate(perf.date)
      }))
    };

    const userRef = doc(db, 'trainingData', userId);
    await setDoc(userRef, dataToSave, { merge: true });
    console.log("Données sauvegardées avec succès");
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
    throw error;
  }
};

// Récupérer toutes les données d'entraînement
export const getTrainingData = async (
  userId: string
): Promise<TrainingData | null> => {
  try {
    if (!db) {
      throw new Error("Firestore n'est pas initialisé correctement");
    }

    const userRef = doc(db, 'trainingData', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Convertir les Timestamp en Date
      return {
        ...data,
        planEntrainement: data.planEntrainement?.map((plan: any) => ({
          ...plan,
          jours: plan.jours.map((jour: any) => ({
            ...jour,
            date: jour.date?.toDate() // Convertir les Timestamp en Date
          }))
        })),
        performances: data.performances?.map((perf: any) => ({
          ...perf,
          date: perf.date.toDate() // Convertir les Timestamp en Date
        }))
      } as TrainingData;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération:", error);
    throw error;
  }
};

// Mettre à jour uniquement les paramètres utilisateur
export const updateUserSettings = async (
  userId: string,
  settings: UserSettings
) => {
  try {
    if (!db) {
      throw new Error("Firestore n'est pas initialisé correctement");
    }

    const userRef = doc(db, 'trainingData', userId);
    await updateDoc(userRef, {
      userSettings: settings
    });
    console.log("Paramètres utilisateur mis à jour avec succès");
  } catch (error) {
    console.error("Erreur mise à jour paramètres:", error);
    throw error;
  }
};

// Ajouter une nouvelle performance
export const addPerformance = async (
  userId: string,
  performance: Performance
) => {
  try {
    if (!db) {
      throw new Error("Firestore n'est pas initialisé correctement");
    }

    const userRef = doc(db, 'trainingData', userId);

    // Récupérer les données existantes
    const docSnap = await getDoc(userRef);
    let performances = docSnap.exists() ? docSnap.data().performances || [] : [];

    // Ajouter la nouvelle performance
    performances.push({
      ...performance,
      date: Timestamp.fromDate(performance.date) // Convertir la date en Timestamp
    });

    await updateDoc(userRef, {
      performances: performances
    });

    console.log("Performance ajoutée avec succès");
  } catch (error) {
    console.error("Erreur ajout performance:", error);
    throw error;
  }
};
