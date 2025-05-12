//service/videoService

import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function fetchTrainingByCategory(category: string) {
  if (!db) {
    console.error('Firestore n\'est pas défini');
    return [];
  }

  try {
    const trainingCol = collection(db, 'entrainements');
    const q = query(trainingCol, where('categorie_id', '==', parseInt(category)));
    const trainingSnapshot = await getDocs(q);

    const trainingList = trainingSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return trainingList;
  } catch (error) {
    console.error('Erreur lors de la récupération des entraînements:', error);
    return [];
  }
}