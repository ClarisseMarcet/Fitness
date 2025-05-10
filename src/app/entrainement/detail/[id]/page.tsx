'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';

const DetailContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackButton = styled(Link)`
  display: inline-block;
  background-color: #0070f3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 2rem;
  text-decoration: none;

  &:hover {
    background-color: #005bb5;
  }
`;

const DetailContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const VideoContainer = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 400px;
  border: none;
`;

const InfoContainer = styled.div`
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #111;
  margin-bottom: 1.5rem;
`;

const DetailText = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const Tag = styled.span<{ couleur: string }>`
  display: inline-block;
  background-color: ${({ couleur }) => couleur};
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const getCouleurCategorie = (categorie: string | null): string => {
  if (!categorie) return '#607d8b';
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

export default function EntrainementDetailPage() {
  const searchParams = useSearchParams();
  
  // Récupération des données depuis l'URL
  const id = searchParams.get('id');
  const titre = searchParams.get('titre');
  const description = searchParams.get('description');
  const niveau = searchParams.get('niveau');
  const duree = searchParams.get('duree');
  const videoUrl = searchParams.get('video');
  const categorie = searchParams.get('categorie');

  if (!titre) {
    return (
      <DetailContainer>
        <BackButton href="/entrainements">← Retour</BackButton>
        <p>Données d'entraînement non disponibles</p>
      </DetailContainer>
    );
  }

  // Conversion de l'URL YouTube
  const embedUrl = videoUrl?.includes('embed/') 
    ? videoUrl 
    : videoUrl?.replace('watch?v=', 'embed/');

  const couleurCategorie = getCouleurCategorie(categorie);

  return (
    <DetailContainer>
      <BackButton href="/entrainements">← Retour</BackButton>

      <DetailContent>
        <VideoContainer>
          <StyledIframe
            src={embedUrl || ''}
            title={titre}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoContainer>

        <InfoContainer>
          <Title>{titre}</Title>
          
          <div>
            <Tag couleur={couleurCategorie}>{categorie}</Tag>
            <Tag couleur="#4CAF50">{niveau}</Tag>
          </div>

          <DetailText>
            <strong>Durée :</strong> {duree} minutes
          </DetailText>
          
          <DetailText>
            <strong>Description :</strong> {description}
          </DetailText>
        </InfoContainer>
      </DetailContent>
    </DetailContainer>
  );
}