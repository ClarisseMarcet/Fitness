'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import PoseTracker from '@/components/PoseTracker';
import RepsCounter from '@/components/RepsCounter';
import { Icon } from '@iconify/react';

type ExerciseType = 'squat' | 'pushup';

export default function TrainPage() {
  const router = useRouter();
  const [exerciseType, setExerciseType] = useState<ExerciseType>('squat');
  const [currentPose, setCurrentPose] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const maxRetries = 3;

  // Vérifier l'état de la connexion Internet
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Si nous étions hors ligne et qu'il y avait une erreur, réessayons
      if (error && errorCode === 'unavailable') {
        handleRetry();
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      setError('Vous êtes actuellement hors ligne. Veuillez vérifier votre connexion Internet.');
      setErrorCode('unavailable');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérifier l'état initial
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error, errorCode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.uid);
    });

    return () => unsubscribe();
  }, [router]);

  const handlePoseDetected = (pose: any) => {
    setCurrentPose(pose);
  };

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setError(null);
    setErrorCode(null);
  };

  const updateUserStats = async () => {
    if (!userId) return;

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'stats.totalWorkouts': increment(1),
        'stats.lastWorkout': new Date().toISOString()
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour des statistiques:', error);
      
      // Déterminer le type d'erreur
      if (error.code === 'failed-precondition') {
        setError('Erreur de configuration de la base de données. Veuillez contacter le support.');
        setErrorCode('failed-precondition');
      } else if (error.code === 'unavailable' || error.code === 'resource-exhausted') {
        setError('Erreur de connexion à la base de données. Vos statistiques seront enregistrées lorsque vous serez à nouveau connecté.');
        setErrorCode('unavailable');
      } else if (error.code === 'permission-denied') {
        setError('Vous n\'avez pas les permissions nécessaires pour mettre à jour vos statistiques.');
        setErrorCode('permission-denied');
      } else if (error.code === 'not-found') {
        setError('Document non trouvé. Veuillez réessayer.');
        setErrorCode('not-found');
      } else {
        setError('Une erreur est survenue lors de l\'enregistrement de vos statistiques.');
        setErrorCode('unknown');
      }
      
      // Si nous n'avons pas atteint le nombre maximum de tentatives, réessayons
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
      }
    }
  };

  const endWorkout = async () => {
    if (!isOnline) {
      setError('Vous êtes actuellement hors ligne. Vos statistiques seront enregistrées lorsque vous serez à nouveau connecté.');
      setErrorCode('unavailable');
      return;
    }
    
    await updateUserStats();
  };

  const handleRetry = () => {
    if (!isOnline) {
      setError('Vous êtes toujours hors ligne. Veuillez vérifier votre connexion Internet.');
      return;
    }
    
    setError(null);
    setErrorCode(null);
    setRetryCount(prev => prev + 1);
    updateUserStats();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Icon icon="mdi:dumbbell" className="text-blue-600 text-4xl mr-3" />
              <h1 className="text-4xl font-bold text-blue-600">
                Entraînement en cours
              </h1>
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={exerciseType}
                  onChange={(e) => setExerciseType(e.target.value as ExerciseType)}
                  className="appearance-none bg-white px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="squat">Squats</option>
                  <option value="pushup">Pompes</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <Icon icon="mdi:chevron-down" className="text-xl" />
                </div>
              </div>

              {!isWorkoutActive ? (
                <button
                  onClick={startWorkout}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Icon icon="mdi:play" className="mr-2" />
                  Commencer
                </button>
              ) : (
                <button
                  onClick={endWorkout}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center"
                >
                  <Icon icon="mdi:stop" className="mr-2" />
                  Terminer
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              <div className="flex items-center mb-2">
                <Icon icon="mdi:alert-circle" className="text-red-600 text-xl mr-2" />
                <span className="font-semibold">Erreur</span>
              </div>
              
              <p className="mb-3">{error}</p>
              
              {!isOnline && (
                <div className="bg-yellow-50 p-3 rounded-lg flex items-center mb-3">
                  <Icon icon="mdi:wifi-off" className="text-yellow-600 text-xl mr-2" />
                  <span className="text-yellow-700">Vous êtes actuellement hors ligne</span>
                </div>
              )}
              
              {errorCode === 'permission-denied' && (
                <div className="bg-yellow-50 p-3 rounded-lg flex items-center mb-3">
                  <Icon icon="mdi:shield-lock" className="text-yellow-600 text-xl mr-2" />
                  <span className="text-yellow-700">Problème d'autorisation - Essayez de vous reconnecter</span>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleRetry}
                  disabled={!isOnline || retryCount >= maxRetries}
                  className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md ${
                    !isOnline || retryCount >= maxRetries 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  <Icon icon="mdi:refresh" className="mr-2" />
                  Réessayer
                </button>
                
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 flex items-center justify-center px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white"
                >
                  <Icon icon="mdi:arrow-left" className="mr-2" />
                  Retour au tableau de bord
                </button>
              </div>
              
              {retryCount >= maxRetries && (
                <div className="mt-3 text-sm text-gray-600">
                  <p>Vous avez atteint le nombre maximum de tentatives.</p>
                  <p>Veuillez vérifier votre connexion Internet et réessayer plus tard.</p>
                </div>
              )}
              
              {errorCode === 'permission-denied' && (
                <div className="mt-3">
                  <button 
                    onClick={() => auth.signOut().then(() => router.push('/login'))}
                    className="w-full flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Icon icon="mdi:logout" className="mr-2" />
                    Se reconnecter
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <PoseTracker onPoseDetected={handlePoseDetected} />
            </div>

            <div className="space-y-6">
              <RepsCounter
                pose={currentPose}
                exerciseType={exerciseType}
              />

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <Icon icon="mdi:information" className="text-blue-500 text-2xl mr-2" />
                  <h3 className="text-xl font-semibold">Instructions</h3>
                </div>
                {exerciseType === 'squat' ? (
                  <ul className="list-none space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <Icon icon="mdi:numeric-1-circle" className="text-blue-500 mr-2 mt-1" />
                      <span>Placez-vous debout, pieds écartés</span>
                    </li>
                    <li className="flex items-start">
                      <Icon icon="mdi:numeric-2-circle" className="text-blue-500 mr-2 mt-1" />
                      <span>Descendez comme si vous vouliez vous asseoir</span>
                    </li>
                    <li className="flex items-start">
                      <Icon icon="mdi:numeric-3-circle" className="text-blue-500 mr-2 mt-1" />
                      <span>Gardez le dos droit</span>
                    </li>
                    <li className="flex items-start">
                      <Icon icon="mdi:numeric-4-circle" className="text-blue-500 mr-2 mt-1" />
                      <span>Remontez doucement</span>
                    </li>
                  </ul>
                ) : (
                  <ul className="list-none space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <Icon icon="mdi:numeric-1-circle" className="text-blue-500 mr-2 mt-1" />
                      <span>Placez-vous en position de planche</span>
                    </li>
                    <li className="flex items-start">
                      <Icon icon="mdi:numeric-2-circle" className="text-blue-500 mr-2 mt-1" />
                      <span>Mains légèrement plus larges que les épaules</span>
                    </li>
                    <li className="flex items-start">
                      <Icon icon="mdi:numeric-3-circle" className="text-blue-500 mr-2 mt-1" />
                      <span>Descendez jusqu'à ce que votre poitrine touche presque le sol</span>
                    </li>
                    <li className="flex items-start">
                      <Icon icon="mdi:numeric-4-circle" className="text-blue-500 mr-2 mt-1" />
                      <span>Remontez en poussant sur vos bras</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 