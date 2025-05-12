'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '@/lib/firebase'; // import db depuis le fichier de configuration Firebase
import { doc, getDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

interface Training {
  id: string;
  title: string;
  description: string;
  level: string;
  duration_minutes: number;
  date_creation: string;
  image_url: string;
  video_url: string;
}

export default function TrainingDetailsPage() {
  const router = useRouter();
  const { id } = router.query; // Récupère l'ID de l'URL dynamique
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !db) return; // Assure-toi que l'ID et db sont disponibles avant de récupérer les données

    const fetchTraining = async () => {
      setLoading(true);
      try {
        // Vérifie si db est bien défini
        if (!db) {
          setError('Erreur: Firestore n\'est pas initialisé');
          return;
        }

        const docRef = doc(db, 'entrainements', id as string); // Accès au document de la collection 'entrainements' par ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTraining({
            id: docSnap.id,
            title: data.title || 'Sans titre',
            description: data.description || '',
            level: data.level || 'Non spécifié',
            duration_minutes: data.duration_minutes || 0,
            date_creation: data.date_creation?.toDate()?.toISOString() || '',
            image_url: data.image_url || '',
            video_url: data.video_url || '',
          });
        } else {
          setError('Entraînement introuvable');
        }
      } catch (err) {
        setError('Erreur lors du chargement de l\'entraînement');
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, [id, db]); // db ajouté dans les dépendances pour être sûr que Firestore est correctement récupéré

  if (loading) {
    return <div className="p-4 text-center">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <FontAwesomeIcon icon={faTrophy} className="text-4xl mb-4" />
        <p>{error}</p>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>Aucun entraînement trouvé</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">{training.title}</h1>
      
      {training.image_url && (
        <div className="mb-4">
          <img src={training.image_url} alt={training.title} className="w-full h-auto rounded-lg" />
        </div>
      )}

      <div className="mb-4 text-gray-700">
        <h2 className="text-xl font-semibold">Description</h2>
        <p>{training.description}</p>
      </div>

      <div className="mb-4 text-gray-700">
        <h3 className="text-lg font-semibold">Détails de l'entraînement</h3>
        <ul>
          <li>Niveau: {training.level}</li>
          <li>Durée: {training.duration_minutes} minutes</li>
          <li>Date de création: {training.date_creation}</li>
        </ul>
      </div>

      {training.video_url && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Regarder la vidéo</h3>
          <video className="w-full h-auto" controls>
            <source src={training.video_url} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de cette vidéo.
          </video>
        </div>
      )}
    </div>
  );
}
