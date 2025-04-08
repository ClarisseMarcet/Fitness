import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  browserSessionPersistence,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp
} from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Types
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthMetrics {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  goal?: 'loss' | 'maintain' | 'gain';
}

export interface HealthResults {
  bmi: number;
  bmr: number;
  tdee: number;
  targetCalories: number;
  bmiStatus?: string;
}

export interface HealthRecommendations {
  diet: string[];
  exercise: string[];
  lifestyle: string[];
}

export interface HealthRecord {
  id: string;
  userId: string;
  metrics: HealthMetrics;
  results: HealthResults;
  recommendations: HealthRecommendations;
  createdAt: Date;
}

// Fonctions d'authentification
export const signUp = async (email: string, password: string, displayName: string): Promise<UserProfile> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Créer un profil utilisateur sans le champ photoURL s'il n'existe pas
    const userProfile: UserProfile = {
      uid: user.uid,
      displayName,
      email: user.email!,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Ne pas inclure photoURL s'il n'existe pas
    if (user.photoURL) {
      userProfile.photoURL = user.photoURL;
    }
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    return userProfile;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<UserProfile> => {
  try {
    console.log('Tentative de connexion avec email:', email);
    
    // Essayer d'abord avec la persistance locale (plus compatible)
    try {
      console.log('Configuration de la persistance locale...');
      await setPersistence(auth, browserLocalPersistence);
      console.log('Persistance locale configurée avec succès');
    } catch (persistenceError) {
      console.warn('Impossible de configurer la persistance locale:', persistenceError);
      // Si la persistance locale échoue, essayer la persistance de session (moins de problèmes avec les restrictions de cookies)
      try {
        console.log('Tentative avec la persistance de session...');
        await setPersistence(auth, browserSessionPersistence);
        console.log('Persistance de session configurée avec succès');
      } catch (sessionError) {
        console.warn('Impossible de configurer la persistance de session:', sessionError);
        console.log('Continuation avec la persistance par défaut');
        // Continuer avec la persistance par défaut si les deux échouent
      }
    }
    
    console.log('Tentative de connexion avec Firebase Auth...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Connexion Firebase Auth réussie, uid:', userCredential.user.uid);
    
    const user = userCredential.user;
    
    console.log('Récupération du profil utilisateur depuis Firestore...');
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      console.log('Profil utilisateur trouvé dans Firestore');
      return userDoc.data() as UserProfile;
    } else {
      console.log('Profil utilisateur non trouvé, création d\'un nouveau profil');
      // Si le profil n'existe pas encore, on le crée ici
      const userProfile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || 'User',
        email: user.email!,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Ne pas inclure photoURL s'il n'existe pas
      if (user.photoURL) {
        userProfile.photoURL = user.photoURL;
      }
      
      console.log('Sauvegarde du nouveau profil utilisateur...');
      await setDoc(doc(db, 'users', user.uid), userProfile);
      console.log('Profil utilisateur sauvegardé avec succès');
      return userProfile;
    }
  } catch (initialError: any) {
    console.error('Erreur détaillée lors de la connexion:', {
      code: initialError.code,
      message: initialError.message,
      stack: initialError.stack,
      fullError: initialError
    });
    
    // Si l'erreur est liée aux cookies tiers ou à un problème de connexion
    if (initialError.code === 'auth/invalid-login-credentials' ||
        initialError.message?.includes('cookies') ||
        initialError.message?.includes('third-party')) {
      
      console.warn('Échec de la connexion initiale, tentative avec une approche différente:', initialError);
      
      try {
        // Essayer avec la persistance de session uniquement
        console.log('Tentative avec persistance de session uniquement...');
        await setPersistence(auth, browserSessionPersistence);
        
        console.log('Nouvelle tentative de connexion...');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Connexion réussie avec la deuxième tentative');
        
        const user = userCredential.user;
        
        console.log('Récupération du profil utilisateur depuis Firestore...');
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          console.log('Profil utilisateur trouvé dans Firestore');
          return userDoc.data() as UserProfile;
        } else {
          console.log('Profil utilisateur non trouvé, création d\'un nouveau profil');
          const userProfile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName || 'User',
            email: user.email!,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          // Ne pas inclure photoURL s'il n'existe pas
          if (user.photoURL) {
            userProfile.photoURL = user.photoURL;
          }
          
          console.log('Sauvegarde du nouveau profil utilisateur...');
          await setDoc(doc(db, 'users', user.uid), userProfile);
          console.log('Profil utilisateur sauvegardé avec succès');
          return userProfile;
        }
      } catch (retryError) {
        console.error('Les deux tentatives de connexion ont échoué:', retryError);
        throw initialError; // Renvoyer l'erreur initiale pour la cohérence
      }
    }
    
    console.error('Erreur lors de la connexion:', initialError);
    throw initialError;
  }
};

export const signInWithGoogle = async (): Promise<UserProfile> => {
  try {
    console.log('Tentative de connexion avec Google...');
    
    const provider = new GoogleAuthProvider();
    // Ajouter des paramètres personnalisés pour améliorer la compatibilité
    provider.setCustomParameters({
      prompt: 'select_account',
      // Forcer l'utilisation du mode popup pour éviter les problèmes de redirection
      auth_type: 'popup'
    });
    
    // Essayer d'abord avec signInWithRedirect
    try {
      console.log('Tentative de connexion avec redirection...');
      await signInWithRedirect(auth, provider);
      console.log('Redirection initiée avec succès');
      // Note: Le résultat sera géré par handleRedirectResult
      return {} as UserProfile; // Retour temporaire, le vrai profil sera géré par handleRedirectResult
    } catch (redirectError) {
      console.warn('Échec de la connexion par redirection, tentative avec popup:', redirectError);
      
      // Si la redirection échoue, essayer avec popup
      console.log('Tentative de connexion avec popup...');
      const result = await signInWithPopup(auth, provider);
      console.log('Connexion popup réussie, uid:', result.user.uid);
      
      const user = result.user;
      
      console.log('Récupération du profil utilisateur depuis Firestore...');
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        console.log('Profil utilisateur trouvé dans Firestore');
        return userDoc.data() as UserProfile;
      } else {
        console.log('Profil utilisateur non trouvé, création d\'un nouveau profil');
        const userProfile: UserProfile = {
          uid: user.uid,
          displayName: user.displayName || 'User',
          email: user.email!,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Ne pas inclure photoURL s'il n'existe pas
        if (user.photoURL) {
          userProfile.photoURL = user.photoURL;
        }
        
        console.log('Sauvegarde du nouveau profil utilisateur...');
        await setDoc(doc(db, 'users', user.uid), userProfile);
        console.log('Profil utilisateur sauvegardé avec succès');
        return userProfile;
      }
    }
  } catch (error: any) {
    console.error('Erreur détaillée lors de la connexion avec Google:', {
      code: error.code,
      message: error.message,
      stack: error.stack,
      fullError: error
    });
    throw error;
  }
};

export const handleRedirectResult = async (): Promise<UserProfile | null> => {
  try {
    console.log('Vérification du résultat de redirection...');
    const result = await getRedirectResult(auth);
    
    if (!result) {
      console.log('Aucun résultat de redirection trouvé');
      return null;
    }
    
    console.log('Résultat de redirection trouvé, uid:', result.user.uid);
    const user = result.user;
    
    // Check if user profile exists
    console.log('Récupération du profil utilisateur depuis Firestore...');
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      console.log('Profil utilisateur trouvé dans Firestore');
      return userDoc.data() as UserProfile;
    } else {
      console.log('Profil utilisateur non trouvé, création d\'un nouveau profil');
      // Create new user profile
      const userProfile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || 'User',
        email: user.email!,
        photoURL: user.photoURL || undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('Sauvegarde du nouveau profil utilisateur...');
      await setDoc(doc(db, 'users', user.uid), userProfile);
      console.log('Profil utilisateur sauvegardé avec succès');
      return userProfile;
    }
  } catch (error: any) {
    console.error('Erreur détaillée lors du traitement du résultat de redirection:', {
      code: error.code,
      message: error.message,
      stack: error.stack,
      fullError: error
    });
    throw error;
  }
};

export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = (): Promise<UserProfile | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            resolve(userDoc.data() as UserProfile);
          } else {
            resolve(null);
          }
        } catch (error) {
          console.error('Error getting current user:', error);
          reject(error);
        }
      } else {
        resolve(null);
      }
    });
  });
};

// Fonctions pour les données de santé
export const saveHealthRecord = async (userId: string, record: Omit<HealthRecord, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
  try {
    const healthRecord: HealthRecord = {
      ...record,
      id: crypto.randomUUID(),
      userId,
      createdAt: new Date()
    };
    
    await setDoc(doc(db, 'healthRecords', healthRecord.id), healthRecord);
    return healthRecord.id;
  } catch (error) {
    console.error('Error saving health record:', error);
    throw error;
  }
};

export const getUserHealthRecords = async (userId?: string) => {
  try {
    const currentUser = auth.currentUser;
    const targetUserId = userId || currentUser?.uid;
    
    if (!targetUserId) {
      throw new Error('Utilisateur non authentifié');
    }

    const healthRecordsRef = collection(db, 'healthRecords');
    const q = query(
      healthRecordsRef, 
      where('userId', '==', targetUserId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HealthRecord[];
  } catch (error) {
    console.error('Error getting user health records:', error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}; 