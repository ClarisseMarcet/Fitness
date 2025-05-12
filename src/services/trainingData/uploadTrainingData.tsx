// src/services/trainingData/uploadTrainingData.ts




import { db } from '../../lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export interface TrainingData {
  title: string;
  description: string;
  level: string;
  duration_minutes: number;
  date_creation: Date;
  image_url: string;
  video_url: string;
  categorie_id: number;
}

export const uploadTrainingData = async (trainingData: TrainingData) => {
  try {
    if (!db) {
      console.error('Firestore non initialisé');
      return;
    }

    // Vérifier les doublons par titre
    const trainingsRef = collection(db, 'entrainements');
    const q = query(trainingsRef, where('title', '==', trainingData.title));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.warn(`⚠️ L'entraînement "${trainingData.title}" existe déjà.`);
      return null;
    }

    // Ajouter l'entraînement s'il n'existe pas
    const docRef = await addDoc(trainingsRef, trainingData);
    console.log('✅ Entraînement ajouté avec ID :', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('❌ Erreur lors de l\'ajout :', e);
    throw e;
  }
};
