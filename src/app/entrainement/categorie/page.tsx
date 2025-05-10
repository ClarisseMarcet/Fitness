'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';

interface Entrainement {
  id: number;
  titre: string;
  description: string;
  niveau: string;
  duree_minutes: number;
  date_creation: string;
  video_url: string;
}

const getCouleurCategorie = (categorie: string): string => {
  switch (categorie.toLowerCase()) {
    case 'femme': return '#e91e63';
    case 'homme': return '#2196f3';
    case 'gymnase': return '#4caf50';
    case 'domicile': return '#ff9800';
    case 'renforcement musculaire': return '#9c27b0';
    case 'combustion des graisses': return '#f44336';
    case 'jambe': return '#795548';
    case 'cardio': return '#795548';
    default: return '#607d8b';
  }
};

const getImageCategorie = (categorie: string): string => {
  switch (categorie.toLowerCase()) {
    case 'femme': return '/images/femmes.png';
    case 'homme': return '/images/homme.png';
    case 'gymnase': return '/images/gymnase.png';
    case 'domicile': return '/images/domicile.png';
    case 'combustion musculaire': return '/images/musculation.png';
    case 'cardio': return '/images/cardio.png';
    case 'jambe': return '/images/jambe.png';
    default: return '/images/default.png';
  }
};

const convertToEmbedUrl = (url: string): string => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/') || url.includes('youtu.be/')) return url;

  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

// STYLED COMPONENTS...

const Container = styled.div`
  padding: 2rem;
  max-width: 1800px;
  margin: 0 auto;
`;

const TitleContainer = styled.div<{ couleur: string }>`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
`;

const TitleImage = styled.img`
  width: 100%;
  max-height: 450px;
  object-fit: cover;
  border-radius: 8px;
`;

const Title = styled.h1<{ couleur: string }>`
  font-size: 3rem;
  margin-top: 1rem;
  color: ${({ couleur }) => couleur};
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-bottom: 4px solid ${({ couleur }) => couleur};
  display: inline-block;
  padding-bottom: 0.5rem;
`;

const EntrainementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const EntrainementCard = styled.div`
  background-color: #fafafa;
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 14px rgba(0,0,0,0.1);
  }
`;

const EntrainementTitle = styled.h2`
  font-size: 1.5rem;
  color: #111;
  margin-bottom: 0.5rem;
`;

const EntrainementText = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
  flex-grow: 1;
`;

const VideoContainer = styled.div`
  position: relative;
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const StyledIframe = styled.iframe.attrs(() => ({
  width: '100%',
  height: '325',
  frameBorder: '0',
  allowFullScreen: true,
}))`
  display: block;
  width: 100%;
  height: 325px;
  border: none;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: #0070f3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background-color: #005bb5;
  }
`;

const Message = styled.p<{ couleur: string }>`
  text-align: center;
  color: ${({ couleur }) => couleur};
  font-size: 1.5rem;
  margin-top: 2rem;
  font-weight: 500;
`;

// COMPONENT PRINCIPAL
const CategoriePage = () => {
  const rawSlug = useParams()?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const [entrainements, setEntrainements] = useState<Entrainement[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Catégorie non spécifiée.");
      return;
    }

    fetch(`http://localhost:5000/api/entrainements/categorie/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement');
        return res.json();
      })
      .then(data => {
        const entrainementsAvecVideoFixe = data.map((ent: Entrainement) => ({
          ...ent,
          video_url: convertToEmbedUrl(ent.video_url),
        }));
        setEntrainements(entrainementsAvecVideoFixe);
      })
      .catch(err => {
        console.error(err);
        setError("Impossible de récupérer les entraînements pour cette catégorie.");
      });
  }, [slug]);

  const couleurCategorie = getCouleurCategorie(slug || 'default');
  const imageCategorie = getImageCategorie(slug || 'default');

  return (
    <Container>
      <BackButton onClick={() => window.history.back()}>Retour</BackButton>

      <TitleContainer couleur={couleurCategorie}>
        <TitleImage src={imageCategorie} alt={slug ?? 'Categorie'} />
        <Title couleur={couleurCategorie}>
          Entraînements pour la catégorie : {slug}
        </Title>
      </TitleContainer>

      {error && <Message couleur={couleurCategorie}>{error}</Message>}

      {entrainements.length === 0 && !error ? (
        <Message couleur={couleurCategorie}>Aucun entraînement trouvé pour cette catégorie.</Message>
      ) : (
        <EntrainementsGrid>
          {entrainements.map(ent => (
            <EntrainementCard key={ent.id}>
              <EntrainementTitle>{ent.titre}</EntrainementTitle>
              <EntrainementText>{ent.description}</EntrainementText>
              <EntrainementText><strong>Niveau :</strong> {ent.niveau}</EntrainementText>
              <EntrainementText><strong>Durée :</strong> {ent.duree_minutes} minutes</EntrainementText>
              {ent.video_url && (
                <VideoContainer>
                  <StyledIframe src={ent.video_url} title={ent.titre} />
                </VideoContainer>
              )}
              <Link href={`/entrainements/detail/${ent.id}`}>
                <button style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#0070f3',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}>
                  Voir la vidéo
                </button>
              </Link>
            </EntrainementCard>
          ))}
        </EntrainementsGrid>
      )}
    </Container>
  );
};

export default CategoriePage;
