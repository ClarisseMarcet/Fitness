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
    
    const userProfile: UserProfile = {
      uid: user.uid,
      displayName,
      email: user.email!,
      photoURL: user.photoURL || undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    return userProfile;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<UserProfile> => {
  try {
    // Essayer d'abord avec la persistance locale (plus compatible)
    try {
      await setPersistence(auth, browserLocalPersistence);
    } catch (persistenceError) {
      console.warn('Could not set local persistence, trying session persistence:', persistenceError);
      // Si la persistance locale échoue, essayer la persistance de session (moins de problèmes avec les restrictions de cookies)
      try {
        await setPersistence(auth, browserSessionPersistence);
      } catch (sessionError) {
        console.warn('Could not set session persistence either, continuing with default:', sessionError);
        // Continuer avec la persistance par défaut si les deux échouent
      }
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    } else {
      // Si le profil n'existe pas encore, on le crée ici
      const userProfile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || 'User',
        email: user.email!,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      return userProfile;
    }
  } catch (initialError: any) {
    // Si l'erreur est liée aux cookies tiers ou à un problème de connexion
    if (initialError.code === 'auth/invalid-login-credentials' ||
        initialError.message?.includes('cookies') ||
        initialError.message?.includes('third-party')) {
      
      console.warn('Initial sign-in failed, trying with different approach:', initialError);
      
      try {
        // Essayer avec la persistance de session uniquement
        await setPersistence(auth, browserSessionPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          return userDoc.data() as UserProfile;
        } else {
          const userProfile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName || 'User',
            email: user.email!,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          await setDoc(doc(db, 'users', user.uid), userProfile);
          return userProfile;
        }
      } catch (retryError) {
        console.error('Both sign-in attempts failed:', retryError);
        throw initialError; // Renvoyer l'erreur initiale pour la cohérence
      }
    }
    
    console.error('Error signing in:', initialError);
    throw initialError;
  }
};


export const signInWithGoogle = async (): Promise<UserProfile> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    } else {
      const userProfile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || 'User',
        email: user.email!,
        photoURL: user.photoURL || undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      return userProfile;
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const handleRedirectResult = async (): Promise<UserProfile | null> => {
  try {
    const result = await getRedirectResult(auth);
    
    if (!result) return null;
    
    const user = result.user;
    
    // Check if user profile exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    } else {
      // Create new user profile
      const userProfile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || 'User',
        email: user.email!,
        photoURL: user.photoURL || undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      return userProfile;
    }
  } catch (error) {
    console.error('Error handling redirect result:', error);
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