// app/activites/[categorieId]/page.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FirebaseModels from '@/utils/FirebaseModels';

const VideosByCategoryPage = () => {
  const router = useRouter();
  const { categorieId } = router.query; // Récupérer l'ID de la catégorie depuis l'URL
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    // Vérifier si le paramètre categorieId est défini
    if (!categorieId) return;

    const fetchVideosByCategory = async () => {
      // Récupérer les vidéos de la catégorie spécifiée
      const allVideos = await FirebaseModels.getEntrainements();
      const filteredVideos = allVideos.filter(
        (video) => video.categorie_id === categorieId
      );
      setVideos(filteredVideos);
    };

    fetchVideosByCategory();
  }, [categorieId]);

  return (
    <div>
      <h1>Vidéos pour la catégorie</h1>
      <div>
        {videos.length === 0 ? (
          <p>Aucune vidéo disponible pour cette catégorie.</p>
        ) : (
          videos.map((video) => (
            <div key={video.id} style={{ marginBottom: '20px' }}>
              <h2>{video.titre}</h2>
              <p>{video.description}</p>
              <video width="320" height="240" controls>
                <source src={video.video_url} type="video/mp4" />
                Votre navigateur ne prend pas en charge la balise vidéo.
              </video>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideosByCategoryPage;
