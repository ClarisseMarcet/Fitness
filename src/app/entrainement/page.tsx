'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, faPlusCircle, faCheck, faSpinner, faTimes, 
  faLightbulb, faBook, faCalendarAlt, faRunning, faRefresh 
} from '@fortawesome/free-solid-svg-icons';

interface Category {
  id: number;
  nom: string;
  image: string;
  color: string;
}

interface Workout {
  id: number;
  titre: string;
  objectif: string;
  categorieId: number;
  jours?: string;
  niveau?: string;
}

interface Goal {
  id: number;
  text: string;
  completed: boolean;
}

interface AdviceCard {
  id: number;
  category: string;
  advice: string;
  loading: boolean;
}

const Entrainement: React.FC = () => {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newGoal, setNewGoal] = useState('');
  const [userGoals, setUserGoals] = useState<Goal[]>([]);
  const [adviceCards, setAdviceCards] = useState<AdviceCard[]>([
    { id: 1, category: "Nutrition", advice: "Chargez votre apport en protéines après l'entraînement pour une meilleure récupération.", loading: false },
    { id: 2, category: "Performance", advice: "Augmentez progressivement vos charges pour continuer à progresser.", loading: false },
    { id: 3, category: "Récupération", advice: "Dormez au moins 7 heures pour une récupération optimale.", loading: false }
  ]);
  const workoutsPerPage = 5;

  const [popularCategories] = useState<Category[]>([
    { id: 1, nom: 'Femme', image: '/images/femmes.png', color: '#FF6B6B' },
    { id: 2, nom: 'Gymnase', image: '/images/gymnase.png', color: '#4CC9F0' },
    { id: 3, nom: 'Domicile', image: '/images/domiciles.png', color: '#F9C74F' },
    { id: 4, nom: 'debutant', image: '/images/debutant.png', color: '#90BE6D' },
    { id: 5, nom: 'Renforcement-musculaire', image: '/images/musculation.png', color: '#577590' },
    { id: 6, nom: 'Combustion-des-graisses', image: '/images/combution.png', color: '#F94144' },
    { id: 7, nom: 'Jambe', image: '/images/jambe.png', color: '#43AA8B' },
    { id: 8, nom: 'Homme', image: '/images/homme.png', color: '#277DA1' },
  ]);

  useEffect(() => {
    const fetchAllWorkouts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/entrainements`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setWorkouts(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des entraînements globaux :', error);
      }
    };

    fetchAllWorkouts();
  }, []);

  const addGoal = () => {
    if (newGoal.trim()) {
      setUserGoals([...userGoals, { 
        id: Date.now(), 
        text: newGoal, 
        completed: false 
      }]);
      setNewGoal('');
    }
  };

  const toggleGoal = (id: number) => {
    setUserGoals(userGoals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const generateIAAdvice = async (category: string) => {
    // Simulation d'appel API
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const advices = {
          Nutrition: ["Mangez des protéines maigres après l'entraînement.", "Hydratez-vous régulièrement tout au long de la journée."],
          Performance: ["Augmentez vos poids progressivement chaque semaine.", "Variez vos exercices pour éviter les plateaux."],
          Récupération: ["Étirez-vous pendant 10 minutes après chaque séance.", "Prenez au moins un jour de repos par semaine."]
        };
        const randomAdvice = advices[category as keyof typeof advices][Math.floor(Math.random() * advices[category as keyof typeof advices].length)];
        resolve(randomAdvice);
      }, 1500);
    });
  };

  const filteredWorkouts = workouts.filter((workout) =>
    workout.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentWorkouts = filteredWorkouts.slice(
    (currentPage - 1) * workoutsPerPage,
    currentPage * workoutsPerPage
  );

  return (
    <PageContainer>
      {/* Hero Section avec vidéo */}
      <VideoHero>
        <VideoBackground autoPlay loop muted playsInline>
          <source src="/assets/banner-video-poster.mp4" type="video/mp4" />
        </VideoBackground>
        <HeroContent>
          <h1>Votre Programme d'Entraînement Personnalisé</h1>
          <p>Découvrez des centaines d'exercices adaptés à vos objectifs</p>
          <ScrollIndicator>
            <div className="chevron"></div>
            <div className="chevron"></div>
            <div className="chevron"></div>
          </ScrollIndicator>
        </HeroContent>
      </VideoHero>

      <MainContent>
        {/* Section Catégories */}
        <Section>
          <SectionTitle>
            <span>Catégories Populaires</span>
          </SectionTitle>
          <CategoryGrid>
            {popularCategories.map((cat) => (
              <CategoryCard 
                key={cat.id} 
                bg={cat.color}
                onClick={() => router.push(`/entrainement/categorie/${cat.nom.toLowerCase()}`)}
              >
                <CategoryImage src={cat.image} alt={cat.nom} />
                <CategoryName>{cat.nom}</CategoryName>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </Section>

        {/* Section Objectifs */}
        <Section>
          <SectionTitle>
            <FontAwesomeIcon icon={faTrophy} />
            <span>Mes Objectifs</span>
          </SectionTitle>
          <GoalsContainer>
            <AddGoal>
              <GoalInput
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Ajouter un nouvel objectif..."
                onKeyPress={(e) => e.key === 'Enter' && addGoal()}
              />
              <AddButton onClick={addGoal}>
                <FontAwesomeIcon icon={faPlusCircle} /> Ajouter
              </AddButton>
            </AddGoal>
            <GoalsList>
              {userGoals.map((goal) => (
                <GoalItem key={goal.id} completed={goal.completed}>
                  <GoalButton onClick={() => toggleGoal(goal.id)}>
                    <FontAwesomeIcon
                      icon={goal.completed ? faCheck : faSpinner}
                    />
                  </GoalButton>
                  <GoalText>{goal.text}</GoalText>
                  <DeleteButton onClick={() => setUserGoals(userGoals.filter(g => g.id !== goal.id))}>
                    <FontAwesomeIcon icon={faTimes} />
                  </DeleteButton>
                </GoalItem>
              ))}
            </GoalsList>
          </GoalsContainer>
        </Section>

        {/* Section Conseils */}
        <Section>
          <SectionTitle>
            <FontAwesomeIcon icon={faLightbulb} />
            <span>Conseils Intelligents</span>
          </SectionTitle>
          <AdviceSubtitle>Générés dynamiquement par OpenAI - Actualisation toutes les heures</AdviceSubtitle>
          <AdviceGrid>
            {adviceCards.map((card) => (
              <AdviceCard key={card.id}>
                <AdviceHeader>
                  <AdviceCategory>
                    <FontAwesomeIcon
                      icon={
                        card.category === "Nutrition" ? faBook :
                        card.category === "Performance" ? faTrophy :
                        card.category === "Récupération" ? faCalendarAlt :
                        faLightbulb
                      }
                    /> 
                    {card.category}
                  </AdviceCategory>
                  <RefreshButton
                    onClick={async () => {
                      setAdviceCards(prev => prev.map(c => c.id === card.id ? { ...c, loading: true } : c));
                      const newAdvice = await generateIAAdvice(card.category);
                      setAdviceCards(prev => prev.map(c => c.id === card.id ? { ...c, advice: newAdvice, loading: false } : c));
                    }}
                    disabled={card.loading}
                  >
                    <FontAwesomeIcon icon={card.loading ? faSpinner : faRefresh} spin={card.loading} />
                  </RefreshButton>
                </AdviceHeader>
                <AdviceContent>
                  {card.loading ? (
                    <LoadingSpinner>
                      <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                      <p>Génération en cours...</p>
                    </LoadingSpinner>
                  ) : (
                    <>
                      <AdviceText>{card.advice}</AdviceText>
                      <AdviceFooter>
                        Mis à jour: {new Date().toLocaleTimeString()}
                      </AdviceFooter>
                    </>
                  )}
                </AdviceContent>
              </AdviceCard>
            ))}
          </AdviceGrid>
        </Section>

        {/* Section Entraînements */}
        <Section>
          <SectionTitle>
            <FontAwesomeIcon icon={faRunning} />
            <span>Mes Entraînements</span>
          </SectionTitle>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Rechercher un entraînement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <WorkoutsTable>
            <TableHeader>
              <div>Nom</div>
              <div>Jours</div>
              <div>Objectif</div>
              <div>Niveau</div>
            </TableHeader>
            {currentWorkouts.length > 0 ? (
              currentWorkouts.map(workout => (
                <TableRow key={workout.id}>
                  <div>
                    <FontAwesomeIcon icon={faRunning} /> {workout.titre}
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faCalendarAlt} /> {workout.jours || '7'} jours
                  </div>
                  <div>{workout.objectif}</div>
                  <div>{workout.niveau || 'Intermédiaire'}</div>
                </TableRow>
              ))
            ) : (
              <NoResults>Aucun entraînement trouvé</NoResults>
            )}
          </WorkoutsTable>

          {filteredWorkouts.length > workoutsPerPage && (
            <Pagination>
              {Array.from({ length: Math.ceil(filteredWorkouts.length / workoutsPerPage) }, (_, i) => (
                <PageButton
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  active={currentPage === i + 1}
                >
                  {i + 1}
                </PageButton>
              ))}
            </Pagination>
          )}
        </Section>
      </MainContent>
    </PageContainer>
  );
};

export default Entrainement;

// 🔽 STYLED COMPONENTS

const PageContainer = styled.div`
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
`;

const VideoHero = styled.div`
  position: relative;
  height: 80vh;
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
  filter: brightness(0.5);
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 5px auto;

  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  p {
    font-size: 1.5rem;
    margin-bottom: 3rem;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }
`;

const ScrollIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 4rem;
    
  .chevron {
    width: 100px;
    height: 100px;
    border-right: 5px solid white;
    border-bottom: 5px solid white;
    transform: rotate(45deg);
    margin: 0 5px;
    animation: bounce 3s infinite;
    opacity: 0.7;

    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes bounce {
    0%, 100% { transform: rotate(45deg) translateY(0); }
    50% { transform: rotate(45deg) translateY(-10px); }
  }
`;

const MainContent = styled.div`
  max-width: 1450px;
  margin: 0 auto;
  padding: 2rem;
`;

const Section = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #333;
  position: relative;
  padding-bottom: 0.5rem;

  span {
    position: relative;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 4px;
    background: linear-gradient(to right, #4CC9F0, #4361EE);
    border-radius: 3px;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 4rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.div<{ bg: string }>`
  background-color: ${(props) => props.bg};
  border-radius: 6px;
  padding: 1.5rem;
  text-align: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
 

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3));
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const CategoryImage = styled.img`
  width: 290px;
  height: 290px;
  object-fit: cover;
  border-radius: 5%;
  margin-bottom: 1rem;
  border: 2px solid white;
  position: relative;
  z-index: 1;
`;

const CategoryName = styled.p`
  font-weight: 600;
  font-size: 1.2rem;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;

const GoalsContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const AddGoal = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const GoalInput = styled.input`
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;

  &:focus {
    border-color: #4CC9F0;
    outline: none;
    box-shadow: 0 0 0 3px rgba(76, 201, 240, 0.2);
  }
`;

const AddButton = styled.button`
  background: linear-gradient(to right, #4CC9F0, #4361EE);
  color: white;
  border: none;
  padding: 0 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(67, 97, 238, 0.3);
  }
`;

const GoalsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const GoalItem = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  background: ${props => props.completed ? '#f0fdf4' : '#fff7ed'};
  border-radius: 8px;
  transition: all 0.3s;
  border-left: 4px solid ${props => props.completed ? '#10b981' : '#f59e0b'};

  &:hover {
    transform: translateX(5px);
  }
`;

const GoalButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors?.primary || '#4CC9F0'};
  cursor: pointer;
  margin-right: 1rem;
  font-size: 1.1rem;
`;

const GoalText = styled.span<{ completed?: boolean }>`
  flex: 1;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.completed ? '#6b7280' : '#1f2937'};
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.7;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const AdviceSubtitle = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  font-style: italic;
`;

const AdviceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const AdviceCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  border-top: 4px solid #4CC9F0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

const AdviceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
`;

const AdviceCategory = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.1rem;
  color: #1e40af;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  color: #4CC9F0;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    color: #4361EE;
    transform: rotate(90deg);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AdviceContent = styled.div`
  padding: 1.5rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #4CC9F0;
  gap: 1rem;
`;

const AdviceText = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: #4b5563;
`;

const AdviceFooter = styled.div`
  font-size: 0.8rem;
  color: #9ca3af;
  text-align: right;
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:focus {
    border-color: #4CC9F0;
    outline: none;
    box-shadow: 0 0 0 3px rgba(76, 201, 240, 0.2);
  }
`;

const WorkoutsTable = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1fr;
  background: linear-gradient(to right, #4CC9F0, #4361EE);
  color: white;
  padding: 1rem 1.5rem;
  font-weight: 600;

  & > div {
    display: flex;
    align-items: center;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 1fr;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
  }

  & > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #4b5563;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NoResults = styled.div`
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.active ? '#4CC9F0' : '#e5e7eb'};
  color: ${props => props.active ? 'white' : '#4b5563'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#3aa8d8' : '#d1d5db'};
  }
`;