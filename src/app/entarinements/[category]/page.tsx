'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';

interface Training {
  id: string;
  title: string;
  description: string;
  level: string;
  duration_minutes: number;
  date_creation: string;
  image_url: string;
  video_url: string;
  categorie_id: number;
}

function extractYoutubeID(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}

export default function TrainingsByCategory() {
  const params = useParams();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [numericCategoryId, setNumericCategoryId] = useState<number | null>(null);

  // Récupération de l'ID depuis l'URL
  const firestoreCategoryId = params?.category as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!db || !firestoreCategoryId) {
          setLoading(false);
          return;
        }

        setLoading(true);

        // 1. Trouver l'ID numérique et le nom de la catégorie
        const categoryRef = doc(db, 'categories', firestoreCategoryId);
        const categorySnap = await getDoc(categoryRef);

        if (!categorySnap.exists()) {
          console.error('Catégorie non trouvée');
          setLoading(false);
          return;
        }

        const categoryData = categorySnap.data();
        setCategoryName(categoryData.nom || '');
        const numericId = categoryData.id; // L'ID numérique (1-8)
        setNumericCategoryId(numericId);

        // 2. Récupérer les entraînements avec l'ID numérique
        const trainingsRef = collection(db, 'entrainements');
        const trainingQuery = query(
          trainingsRef, 
          where('categorie_id', '==', numericId)
        );
        
        const trainingSnapshot = await getDocs(trainingQuery);
        console.log(`Trouvés ${trainingSnapshot.size} entraînements pour catégorie ${numericId}`);

        const trainingsData = trainingSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'Sans titre',
            description: data.description || '',
            level: data.level || 'Non spécifié',
            duration_minutes: Number(data.duration_minutes) || 0,
            date_creation: data.date_creation?.toDate?.()?.toISOString?.() || '',
            image_url: data.image_url || '',
            video_url: data.video_url || '',
            categorie_id: Number(data.categorie_id) || 0
          } as Training;
        });

        setTrainings(trainingsData);
      } catch (error) {
        console.error("Erreur lors de la récupération:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [firestoreCategoryId]);

  if (loading) {
    return <div className="p-4 text-center text-lg text-gray-700">Chargement en cours...</div>;
  }

  if (!numericCategoryId) {
    return (
      <div className="p-4 max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-red-800 mb-3">Erreur</h2>
        <p className="mb-4">Catégorie introuvable ou ID invalide.</p>
        <p className="mb-2">ID reçu: {firestoreCategoryId || 'Aucun'}</p>
        <Link 
          href="/entarinements" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
        >
          ← Retour aux catégories
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">{categoryName || `Catégorie #${numericCategoryId}`}</h1>
        <Link 
          href="/entarinements" 
          className="flex items-center text-white hover:underline transition-all"
        >
          <span className="mr-2">←</span> Toutes les catégories
        </Link>
      </div>

      {trainings.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">⚠️</div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Aucun entraînement trouvé
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Pour la catégorie <strong>{categoryName}</strong> (ID numérique: {numericCategoryId}).
                </p>
                <p className="mt-2">
                  Vérifiez dans Firestore qu'il existe des documents avec:
                </p>
                <code className="block mt-1 p-1 bg-gray-100 rounded">{`categorie_id = ${numericCategoryId}`}</code>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trainings.map(training => (
            <div key={training.id} className="bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div className="relative">
                {training.video_url ? (
                  <iframe
                    className="w-full h-64 rounded-lg"
                    src={`https://www.youtube.com/embed/${extractYoutubeID(training.video_url)}?autoplay=1&mute=1`}
                    title={training.title}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-400">
                    Vidéo non disponible
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-gray-800">{training.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{training.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Niveau: {training.level}</span>
                  <span>{training.duration_minutes} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
