'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faRunning } from '@fortawesome/free-solid-svg-icons';
import styled, { keyframes } from 'styled-components';


interface Category {
  id: string;
  nom: string;
  imageUrl: string;
  color?: string;
}

// Animation pour les lignes diagonales
const lineAnimation = keyframes`
  0% { transform: translateY(-100%) rotate(45deg); }
  100% { transform: translateY(100%) rotate(45deg); }
`;

const crossAnimation = keyframes`
  0% { transform: translateY(-100%) rotate(-45deg); }
  100% { transform: translateY(100%) rotate(-45deg); }
`;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!db) return;

      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesList: Category[] = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as Category[];

      const colors = ['#FF6B6B', '#4CC9F0', '#F9C74F', '#90BE6D', '#577590', '#F94144', '#43AA8B', '#277DA1'];
      const categoriesWithColors = categoriesList.map((cat, index) => ({
        ...cat,
        color: colors[index % colors.length]
      }));

      setCategories(categoriesWithColors);
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Section Vidéo avec lignes diagonales */}
      <VideoHero>
        <VideoBackground autoPlay loop muted playsInline>
          <source src="/assets/banner-video-poster.mp4" type="video/mp4" />
        </VideoBackground>
        
        {/* Lignes diagonales qui se croisent */}
        <DiagonalLines>
          <Line $angle="45deg" $delay="0s" $left="20%" />
          <Line $angle="-45deg" $delay="0.2s" $left="20%" />
          <Line $angle="45deg" $delay="0.4s" $left="40%" />
          <Line $angle="-45deg" $delay="0.6s" $left="40%" />
          <Line $angle="45deg" $delay="0.8s" $left="60%" />
          <Line $angle="-45deg" $delay="1s" $left="60%" />
          <Line $angle="45deg" $delay="1.2s" $left="80%" />
          <Line $angle="-45deg" $delay="1.4s" $left="80%" />
        </DiagonalLines>
        
        <HeroContent>
          <h1 className="text-4xl font-bold text-white mb-4">Nos Programmes d'Entraînement</h1>
          <p className="text-xl text-white">Découvrez nos catégories spécialisées</p>
        </HeroContent>
      </VideoHero>

      {/* Votre code existant inchangé */}
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
              <FontAwesomeIcon icon={faRunning} className="text-blue-500" />
              <span>Nos Catégories d'Entraînement</span>
            </h1>
            <p className="text-gray-600">
              Choisissez une catégorie pour découvrir nos programmes d'entraînement spécialisés
            </p>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mt-2 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/entarinements/${category.id}`}>
                <div 
                  className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                  style={{ backgroundColor: category.color || '#4CC9F0' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <img 
                    src={category.imageUrl} 
                    alt={category.nom} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex-grow flex flex-col justify-end relative z-10">
                    <h2 className="text-white text-xl font-bold">{category.nom}</h2>
                    <button className="mt-2 self-start bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm transition-colors duration-200">
                      Voir les programmes
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faTrophy} className="text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500">Aucune catégorie disponible pour le moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Styles pour la nouvelle section vidéo
const VideoHero = styled.div`
  position: relative;
  height: 70vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const VideoBackground = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  filter: brightness(0.7);
`;

const DiagonalLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`;

const Line = styled.div<{ $angle: string; $delay: string; $left: string }>`
  position: absolute;
  top: 0;
  left: ${props => props.$left};
  width: 2px;
  height: 200%;
  background: linear-gradient(to bottom, rgba(255,255,255,0.8), transparent);
  transform: rotate(${props => props.$angle});
  animation: ${props => props.$angle === '45deg' ? lineAnimation : crossAnimation} 8s linear infinite;
  animation-delay: ${props => props.$delay};
  opacity: 0.6;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;