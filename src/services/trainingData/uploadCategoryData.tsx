// src/services/uploadData.tsx
import { db } from '../../lib/firebase'; // Importation de la référence Firestore
import { collection, doc, setDoc } from 'firebase/firestore';

export const uploadCategories = async () => {
  // Vérifier si Firestore est bien initialisé
  if (!db) {
    console.error("Firestore n'est pas initialisé correctement");
    return;  // On arrête l'exécution si db est undefined
  }

 // Exemple de catégories avec leurs ID dans Firestore

const categories = [
  { id: 1, nom: 'Femme', imageUrl: 'image-url-femme.png' },
  { id: 2, nom: 'Gymnase', imageUrl: 'image-url-gymnase.png' },
  { id: 3, nom: 'Domicile', imageUrl: 'image-url-domicile.png' },
  { id: 4, nom: 'Débutant', imageUrl: 'image-url-debutant.png' },
  { id: 5, nom: 'Renforcement musculaire', imageUrl: 'image-url-renforcement.png' },
  { id: 6, nom: 'Combustion des graisses', imageUrl: 'image-url-combustion.png' },
  { id: 7, nom: 'Jambe', imageUrl: 'image-url-jambe.png' },
  { id: 8, nom: 'Homme', imageUrl: 'image-url-homme.png' }
];


  const categoriesRef = collection(db, 'categories'); // Accès à la collection "categories" dans Firestore

  for (const category of categories) {
    const docRef = doc(categoriesRef);  // Crée une nouvelle référence de document
    await setDoc(docRef, category);  // Envoie la catégorie à Firestore
  }
};
