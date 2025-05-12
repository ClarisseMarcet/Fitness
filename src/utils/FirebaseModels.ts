import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, getDoc, query, where, Timestamp, updateDoc, deleteDoc } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app); // Obtenez l'instance Firestore

// Types pour la sécurité des types
interface CategorieAttributes {
  id: string;
  nom: string;
  slug: string;
  image_url: string | null;
  video_url: string | null;
}

interface EntrainementAttributes {
  id: string;
  titre: string;
  description: string;
  niveau: string;
  categorie_id: string;
  duree_minutes: number;
  date_creation: Timestamp;
  image_url: string | null;
  video_url: string | null;
}

class FirebaseService {

  // ============================
  // Gestion des catégories
  // ============================

  static async createCategorie(data: Omit<CategorieAttributes, 'id'>): Promise<string> {
    if (!firestore) throw new Error('Firestore non initialisé');
    const categoriesRef = collection(firestore, 'categories');
    const docRef = doc(categoriesRef); // Crée une référence sans ID pour ajouter les données
    await setDoc(docRef, data); // Envoi des données à Firestore
    return docRef.id; // Retourne l'ID du document ajouté
  }

  static async getCategories(): Promise<CategorieAttributes[]> {
    if (!firestore) throw new Error('Firestore non initialisé');
    const querySnapshot = await getDocs(collection(firestore, 'categories'));
    const categories: CategorieAttributes[] = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() } as CategorieAttributes);
    });
    return categories;
  }

  static async getCategorieById(id: string): Promise<CategorieAttributes | null> {
    if (!firestore) throw new Error('Firestore non initialisé');
    const docRef = doc(firestore, 'categories', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as CategorieAttributes;
    }
    return null;
  }

  // ============================
  // Gestion des entraînements
  // ============================

  static async createEntrainement(data: Omit<EntrainementAttributes, 'id' | 'date_creation'>): Promise<string> {
    if (!firestore) throw new Error('Firestore non initialisé');
    const entrainementsRef = collection(firestore, 'entrainements');
    const docRef = doc(entrainementsRef); // Crée une référence sans ID pour ajouter les données
    await setDoc(docRef, { ...data, date_creation: Timestamp.now() }); // Envoi des données à Firestore
    return docRef.id; // Retourne l'ID du document ajouté
  }

  static async getEntrainements(): Promise<EntrainementAttributes[]> {
    if (!firestore) throw new Error('Firestore non initialisé');
    const querySnapshot = await getDocs(collection(firestore, 'entrainements'));
    const entrainements: EntrainementAttributes[] = [];
    querySnapshot.forEach((doc) => {
      entrainements.push({ id: doc.id, ...doc.data() } as EntrainementAttributes);
    });
    return entrainements;
  }

  static async getEntrainementById(id: string): Promise<EntrainementAttributes | null> {
    if (!firestore) throw new Error('Firestore non initialisé');
    const docRef = doc(firestore, 'entrainements', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as EntrainementAttributes;
    }
    return null;
  }

  static async getEntrainementsByCategorie(categorieId: string): Promise<EntrainementAttributes[]> {
    if (!firestore) throw new Error('Firestore non initialisé');
    const querySnapshot = await getDocs(
      query(collection(firestore, 'entrainements'), where('categorie_id', '==', categorieId))
    );
    const entrainements: EntrainementAttributes[] = [];
    querySnapshot.forEach((doc) => {
      entrainements.push({ id: doc.id, ...doc.data() } as EntrainementAttributes);
    });
    return entrainements;
  }

  // ============================
  // Fonction pour mettre à jour un entraînement
  // ============================
  static async updateEntrainement(id: string, data: Partial<EntrainementAttributes>): Promise<void> {
    if (!firestore) throw new Error('Firestore non initialisé');
    const docRef = doc(firestore, 'entrainements', id);
    await updateDoc(docRef, data);
  }

  // ============================
  // Fonction pour supprimer un entraînement
  // ============================
  static async deleteEntrainement(id: string): Promise<void> {
    if (!firestore) throw new Error('Firestore non initialisé');
    const docRef = doc(firestore, 'entrainements', id);
    await deleteDoc(docRef);
  }

  // ============================
  // Fonction pour supprimer une catégorie
  // ============================
  static async deleteCategorie(id: string): Promise<void> {
    if (!firestore) throw new Error('Firestore non initialisé');
    const docRef = doc(firestore, 'categories', id);
    await deleteDoc(docRef);
  }
}

// Exporter pour utilisation dans l'application
export default FirebaseService;
