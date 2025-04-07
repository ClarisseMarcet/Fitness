import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
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
  apiKey: "AIzaSyAObgaDJ5qBSWd5t40Rx4GHOYPZD2C4sNY",
  authDomain: "coach-ia-app.firebaseapp.com",
  projectId: "coach-ia-app",
  storageBucket: "coach-ia-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Types
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
}

export interface HealthMetrics {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: string;
  goal: 'loss' | 'gain' | 'maintain';
}

export interface HealthResults {
  bmi: number;
  bmiStatus: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
}

export interface HealthRecommendations {
  diet: string;
  exercise: string;
  lifestyle: string;
}

export interface HealthRecord {
  id: string;
  userId: string;
  date: Date;
  metrics: HealthMetrics;
  results: HealthResults;
  recommendations?: HealthRecommendations;
}

// Fonctions d'authentification
export const signUp = async (email: string, password: string, displayName: string): Promise<UserProfile> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      createdAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    return userProfile;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
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

export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

// Fonctions pour les données de santé
export const saveHealthRecord = async (record: Omit<HealthRecord, 'id'>): Promise<string> => {
  try {
    const healthRecordsRef = collection(db, 'healthRecords');
    const newRecord = {
      ...record,
      date: Timestamp.fromDate(record.date)
    };
    
    const docRef = await setDoc(doc(healthRecordsRef), newRecord);
    return docRef.id;
  } catch (error) {
    console.error('Error saving health record:', error);
    throw error;
  }
};

export const getUserHealthRecords = async (userId?: string): Promise<HealthRecord[]> => {
  try {
    const currentUser = userId || auth.currentUser?.uid;
    if (!currentUser) {
      throw new Error('No user ID provided');
    }

    const healthRecordsRef = collection(db, 'healthRecords');
    const q = query(
      healthRecordsRef,
      where('userId', '==', currentUser),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    })) as HealthRecord[];
  } catch (error) {
    console.error('Error getting health records:', error);
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