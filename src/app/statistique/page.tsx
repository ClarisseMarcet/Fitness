"use client";

import React, { useState, useMemo, useCallback } from 'react';

// ==================== TYPES ET INTERFACES ====================
type Sport = {
  id: string;
  label: string;
  icon: string;
};

type Exercice = string;

interface JourEntrainement {
  jour: string;
  exercices: Exercice[];
  complet: boolean;
  date?: Date;
}

interface PlanEntrainement {
  sport: string;
  jours: JourEntrainement[];
}

interface Performance {
  date: string;
  jour: string;
  sport: string;
  exercices: Exercice[];
  calories: number;
  duree: number;
  intensite: string;
  equipements: string[];
}

interface User {
  niveau: string;
  sportsSelectionnes: string[];
  sportPersonnalise: string;
  frequence: number;
  abonnement: string;
}

interface AppState {
  user: User;
  planEntrainement: PlanEntrainement[];
  performances: Performance[];
  activeTab: string;
}

interface SportConfig {
  baseCalories: number;
  baseDuration: number;
  intensity: string;
}

type SportType = keyof typeof SPORT_CONFIG;

interface Stats {
  seancesCompletees: number;
  tauxReussite: number;
  emoji: string;
  progres: number;
  dernieresActivites: {
    dateStr: string;
    jour: string;
    sport: string;
    calories: number;
    duree: number;
  }[];
}

// ==================== DONNÉES CONSTANTES ====================
const sportsDisponibles: Sport[] = [
  { id: 'musculation', label: 'Musculation', icon: '💪' },
  { id: 'cardio', label: 'Cardio', icon: '🏃' },
  { id: 'yoga', label: 'Yoga', icon: '🧘' },
  { id: 'natation', label: 'Natation', icon: '🏊' },
  { id: 'boxe', label: 'Boxe', icon: '🥊' },
  { id: 'crossfit', label: 'Crossfit', icon: '🏋️' },
  { id: 'escalade', label: 'Escalade', icon: '🧗' },
  { id: 'football', label: 'Football', icon: '⚽' },
  { id: 'basket', label: 'Basketball', icon: '🏀' },
  { id: 'tennis', label: 'Tennis', icon: '🎾' }
];

const joursSemaine = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const SPORT_CONFIG: Record<string, SportConfig> = {
  'Musculation': { baseCalories: 400, baseDuration: 60, intensity: '7/10' },
  'Cardio': { baseCalories: 350, baseDuration: 45, intensity: '8/10' },
  'Yoga': { baseCalories: 180, baseDuration: 55, intensity: '5/10' },
  'default': { baseCalories: 250, baseDuration: 40, intensity: '6/10' }
};

// ==================== COMPOSANT EDITABLEJOUR ====================
interface EditableJourProps {
  jour: JourEntrainement;
  onUpdate: (updatedJour: JourEntrainement) => void;
  onDelete: () => void;
  onComplete: () => void;
  sportType: string;
}

const EditableJour: React.FC<EditableJourProps> = ({ 
  jour, 
  onUpdate, 
  onDelete, 
  onComplete, 
  sportType 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedJour, setEditedJour] = useState<JourEntrainement>(jour);

  const peutValiderJour = (): boolean => {
    if (!jour.date) return true;
    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);
    const dateDuJour = new Date(jour.date);
    dateDuJour.setHours(0, 0, 0, 0);
    return dateDuJour <= aujourdHui;
  };

  const handleSave = (): void => {
    onUpdate(editedJour);
    setIsEditing(false);
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      borderLeft: jour.complet ? '5px solid #4CAF50' : '5px solid #2196F3',
      opacity: peutValiderJour() ? 1 : 0.7
    }}>
      {isEditing ? (
        <div style={{ marginBottom: '15px' }}>
          <select
            value={editedJour.jour}
            onChange={(e) => setEditedJour({...editedJour, jour: e.target.value})}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd'
            }}
          >
            {joursSemaine.map(j => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
          
          <textarea
            value={editedJour.exercices.join('\n')}
            onChange={(e) => setEditedJour({
              ...editedJour, 
              exercices: e.target.value.split('\n')
            })}
            placeholder="Un exercice par ligne"
            rows={5}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              marginBottom: '10px'
            }}
          />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleSave}
              style={{
                padding: '8px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Enregistrer
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              style={{
                padding: '8px 15px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '15px'
          }}>
            <h4 style={{ margin: 0 }}>{jour.jour} - {jour.date?.toLocaleDateString() || ''}</h4>
            {peutValiderJour() ? (
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="checkbox"
                  checked={jour.complet}
                  onChange={() => {
                    onUpdate({...jour, complet: !jour.complet});
                    if (!jour.complet) onComplete();
                  }}
                />
                {jour.complet ? 'Validé ✓' : 'Valider'}
              </label>
            ) : (
              <span style={{ 
                backgroundColor: '#ffeb3b',
                padding: '5px 10px',
                borderRadius: '20px',
                fontSize: '0.8em'
              }}>
                À venir
              </span>
            )}
          </div>
          
          {!peutValiderJour() && (
            <div style={{ 
              backgroundColor: '#e3f2fd',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '10px',
              fontSize: '0.9em'
            }}>
              Disponible à partir du {jour.date?.toLocaleDateString()}
            </div>
          )}
          
          <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '15px' }}>
            {jour.exercices.map((exo, i) => (
              <li key={i} style={{ 
                padding: '8px 0',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#2196F3',
                  borderRadius: '50%',
                  marginRight: '10px'
                }}></span>
                {exo}
              </li>
            ))}
          </ul>

          <div style={{ 
            display: 'flex',
            gap: '10px',
            marginBottom: '15px',
            flexWrap: 'wrap'
          }}>
            <button 
              style={{
                padding: '8px 15px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(sportType + ' ' + jour.exercices.join(' '))}`, '_blank')}
            >
              📝 Fiches exercices
            </button>
            <button 
              style={{
                padding: '8px 15px',
                backgroundColor: '#673AB7',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent('Séance guidée ' + sportType)}`, '_blank')}
            >
              🎬 Séance guidée
            </button>
            <button 
              style={{
                padding: '8px 15px',
                backgroundColor: '#009688',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent('Tutoriel ' + sportType)}`, '_blank')}
            >
              ▶️ Tutoriels vidéo
            </button>
          </div>

          <button 
            style={{
              padding: '8px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            onClick={() => {
              const nouvelExercice = prompt("Ajouter un exercice:");
              if (nouvelExercice) {
                onUpdate({
                  ...jour,
                  exercices: [...jour.exercices, nouvelExercice]
                });
              }
            }}
          >
            ＋ Ajouter exercice
          </button>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setIsEditing(true)}
              style={{
                padding: '8px 15px',
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              ✏️ Modifier
            </button>
            <button 
              onClick={onDelete}
              style={{
                padding: '8px 15px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              🗑️ Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ==================== COMPOSANT PRINCIPAL ====================
const StatistiquePage: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: {
      niveau: 'débutant',
      sportsSelectionnes: [],
      sportPersonnalise: '',
      frequence: 3,
      abonnement: 'gratuit'
    },
    planEntrainement: [],
    performances: [],
    activeTab: 'form'
  });

  const generateWorkoutData = useCallback((jour: string, sportType: string): Performance => {
    const config = SPORT_CONFIG[sportType] || SPORT_CONFIG.default;
    const plan = state.planEntrainement.find(p => p.sport === sportType);
    const exercices = plan?.jours.find(j => j.jour === jour)?.exercices || ['Exercice personnalisé'];

    return {
      date: new Date().toISOString(),
      jour,
      sport: sportType,
      exercices,
      calories: Math.floor(config.baseCalories * (0.9 + Math.random() * 0.2)),
      duree: Math.floor(config.baseDuration * (0.8 + Math.random() * 0.4)),
      intensite: config.intensity,
      equipements: []
    };
  }, [state.planEntrainement]);

  const handleWorkoutComplete = useCallback((jour: string, sportType: string): void => {
    const nouvellePerformance = generateWorkoutData(jour, sportType);
    
    setState(prev => ({
      ...prev,
      performances: [...prev.performances, nouvellePerformance],
      planEntrainement: prev.planEntrainement.map(plan => ({
        ...plan,
        jours: plan.jours.map(j => 
          j.jour === jour ? { ...j, complet: true } : j
        )
      }))
    }));
  }, [generateWorkoutData]);

  const stats: Stats = useMemo(() => {
    const totalSeances = state.planEntrainement.reduce(
      (acc, plan) => acc + plan.jours.length, 0
    );
    const seancesCompletees = state.performances.length;
    const tauxReussite = totalSeances > 0 
      ? Math.round((seancesCompletees / totalSeances) * 100)
      : 0;

    let emoji = '😐';
    if (tauxReussite >= 80) emoji = '😊';
    else if (tauxReussite >= 50) emoji = '🙂';
    else if (tauxReussite > 0) emoji = '😕';

    return {
      seancesCompletees,
      tauxReussite,
      emoji,
      progres: Math.min(seancesCompletees * 10, 100),
      dernieresActivites: state.performances.slice(-5).reverse().map(act => ({
        ...act,
        dateStr: new Date(act.date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        })
      }))
    };
  }, [state.planEntrainement, state.performances]);

  const toggleSport = useCallback((sportId: string): void => {
    setState(prev => {
      const { sportsSelectionnes } = prev.user;
      const newSports = sportsSelectionnes.includes(sportId)
        ? sportsSelectionnes.filter(id => id !== sportId)
        : sportsSelectionnes.length < 3
          ? [...sportsSelectionnes, sportId]
          : sportsSelectionnes;

      return {
        ...prev,
        user: {
          ...prev.user,
          sportsSelectionnes: newSports
        }
      };
    });
  }, []);

  const handleSportPersonnalise = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && e.currentTarget.value.trim() && state.user.sportsSelectionnes.length < 3) {
      setState(prev => ({
        ...prev,
        user: {
          ...prev.user,
          sportsSelectionnes: [...prev.user.sportsSelectionnes, e.currentTarget.value.trim()],
          sportPersonnalise: ''
        }
      }));
      e.currentTarget.value = '';
    }
  }, [state.user.sportsSelectionnes]);

  const genererPlan = useCallback((): void => {
    setState(prev => {
      const nouveauxPlans: PlanEntrainement[] = prev.user.sportsSelectionnes.map(sportId => {
        const sport = sportsDisponibles.find(s => s.id === sportId) || { label: sportId };
        const jours: JourEntrainement[] = [];
        const dateDebut = new Date();
        const jourActuelIndex = dateDebut.getDay();
        const indexActuel = jourActuelIndex === 0 ? 6 : jourActuelIndex - 1;
        
        for (let i = 0; i < prev.user.frequence; i++) {
          const jourIndex = (indexActuel + i) % 7;
          const dateJour = new Date(dateDebut);
          dateJour.setDate(dateDebut.getDate() + i);
          
          jours.push({
            jour: joursSemaine[jourIndex],
            exercices: [
              `Échauffement ${sport.label}`,
              `Exercice principal ${i + 1}`,
              `Travail complémentaire`
            ],
            complet: false,
            date: dateJour
          });
        }
        
        return {
          sport: sport.label,
          jours: jours
        };
      });
      
      return {
        ...prev,
        planEntrainement: nouveauxPlans,
        activeTab: 'plan'
      };
    });
  }, []);

  const ajouterNouveauJour = useCallback((): void => {
    setState(prev => {
      if (prev.planEntrainement.length === 0) {
        alert("Ajoutez d'abord un sport dans l'onglet Profil");
        return { ...prev, activeTab: 'form' };
      }

      const nouveauxPlans = [...prev.planEntrainement];
      const dernierJour = nouveauxPlans[0].jours[nouveauxPlans[0].jours.length - 1];
      const nouvelleDate = new Date(dernierJour.date as Date);
      nouvelleDate.setDate(nouvelleDate.getDate() + 1);
      
      nouveauxPlans[0].jours.push({
        jour: joursSemaine[nouvelleDate.getDay() === 0 ? 6 : nouvelleDate.getDay() - 1],
        exercices: ["Nouvel exercice"],
        complet: false,
        date: nouvelleDate
      });

      return { ...prev, planEntrainement: nouveauxPlans };
    });
  }, []);

  const mettreAJourJour = useCallback((
    planIndex: number,
    jourIndex: number,
    updatedJour: JourEntrainement
  ): void => {
    setState(prev => {
      const nouveauxPlans = [...prev.planEntrainement];
      nouveauxPlans[planIndex].jours[jourIndex] = updatedJour;
      return { ...prev, planEntrainement: nouveauxPlans };
    });
  }, []);

  const supprimerJour = useCallback((planIndex: number, jourIndex: number): void => {
    setState(prev => {
      const nouveauxPlans = [...prev.planEntrainement];
      nouveauxPlans[planIndex].jours.splice(jourIndex, 1);
      return { ...prev, planEntrainement: nouveauxPlans };
    });
  }, []);

  const supprimerPlan = useCallback((planIndex: number): void => {
    setState(prev => {
      const nouveauxPlans = [...prev.planEntrainement];
      nouveauxPlans.splice(planIndex, 1);
      return { ...prev, planEntrainement: nouveauxPlans };
    });
  }, []);

  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      color: '#333'
    }}>
      <header style={{
        background: 'linear-gradient(135deg, #0033a0, #d52b1e)',
        color: 'white',
        padding: '30px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.2))',
          zIndex: 1
        }}></div>
        <h1 style={{
          position: 'relative',
          zIndex: 2,
          fontSize: '2.5rem',
          marginBottom: '10px'
        }}>
          <span style={{ fontWeight: 'bold' }}>FITCOACH</span>
          <span style={{ color: '#ffeb3b' }}>AI</span>
        </h1>
        <p style={{
          position: 'relative',
          zIndex: 2,
          fontSize: '1.2rem',
          opacity: 0.9
        }}>Votre programme sportif intelligent</p>
      </header>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px',
          gap: '10px'
        }}>
          <button 
            style={{
              padding: '12px 20px',
              backgroundColor: state.activeTab === 'form' ? '#0033a0' : '#e0e0e0',
              color: state.activeTab === 'form' ? 'white' : '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }} 
            onClick={() => setState(prev => ({ ...prev, activeTab: 'form' }))}
          >
            👤 Mon Profil
          </button>
          <button 
            style={{
              padding: '12px 20px',
              backgroundColor: state.activeTab === 'plan' ? '#0033a0' : '#e0e0e0',
              color: state.activeTab === 'plan' ? 'white' : '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }} 
            onClick={() => setState(prev => ({ ...prev, activeTab: 'plan' }))}
          >
            📅 Mon Plan
          </button>
          <button 
            style={{
              padding: '12px 20px',
              backgroundColor: state.activeTab === 'stats' ? '#0033a0' : '#e0e0e0',
              color: state.activeTab === 'stats' ? 'white' : '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }} 
            onClick={() => setState(prev => ({ ...prev, activeTab: 'stats' }))}
          >
            📊 Mes Stats {stats.emoji}
          </button>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '25px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {state.activeTab === 'form' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px'
            }}>
              <div>
                <div style={{ marginBottom: '25px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: 'bold',
                    color: '#0033a0'
                  }}>Niveau</label>
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap'
                  }}>
                    {['Débutant', 'Intermédiaire', 'Avancé'].map(niveau => (
                      <button
                        key={niveau}
                        style={{
                          padding: '8px 15px',
                          backgroundColor: state.user.niveau === niveau.toLowerCase() ? '#0033a0' : '#e0e0e0',
                          color: state.user.niveau === niveau.toLowerCase() ? 'white' : '#333',
                          border: 'none',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onClick={() => setState(prev => ({
                          ...prev,
                          user: {
                            ...prev.user,
                            niveau: niveau.toLowerCase()
                          }
                        }))}
                      >
                        {niveau}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: 'bold',
                    color: '#0033a0'
                  }}>
                    Choisis tes 3 sports principaux 
                    <span style={{
                      marginLeft: '10px',
                      fontWeight: 'normal',
                      color: '#666'
                    }}>
                      ({state.user.sportsSelectionnes.length}/3 sélectionnés)
                    </span>
                  </label>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '15px',
                    marginBottom: '15px'
                  }}>
                    {sportsDisponibles.map(sport => (
                      <div
                        key={sport.id}
                        style={{
                          backgroundColor: state.user.sportsSelectionnes.includes(sport.id) ? '#0033a0' : '#f5f5f5',
                          color: state.user.sportsSelectionnes.includes(sport.id) ? 'white' : '#333',
                          padding: '15px 10px',
                          borderRadius: '8px',
                          textAlign: 'center',
                          cursor: state.user.sportsSelectionnes.length >= 3 && !state.user.sportsSelectionnes.includes(sport.id) ? 'not-allowed' : 'pointer',
                          opacity: state.user.sportsSelectionnes.length >= 3 && !state.user.sportsSelectionnes.includes(sport.id) ? 0.5 : 1,
                          transition: 'all 0.3s',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        onClick={() => toggleSport(sport.id)}
                      >
                        <span style={{ fontSize: '1.5rem' }}>{sport.icon}</span>
                        <span>{sport.label}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="text"
                      placeholder="Ton sport n'est pas listé ? Écris-le ici (ex: Danse, Golf...) et appuie sur Entrée"
                      onKeyDown={handleSportPersonnalise}
                      disabled={state.user.sportsSelectionnes.length >= 3}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '1rem'
                      }}
                    />
                    {state.user.sportsSelectionnes.length >= 3 && (
                      <div style={{
                        marginTop: '10px',
                        padding: '10px',
                        backgroundColor: '#fff8e1',
                        borderRadius: '5px',
                        color: '#ff6d00',
                        fontSize: '0.9rem'
                      }}>
                        Maximum 3 sports atteint. Supprime une sélection pour en ajouter un nouveau.
                      </div>
                    )}
                  </div>

                  {state.user.sportsSelectionnes.length > 0 && (
                    <div>
                      <h4 style={{
                        marginBottom: '10px',
                        color: '#0033a0'
                      }}>Tes sélections :</h4>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}>
                        {state.user.sportsSelectionnes.map(sportId => {
                          const sport = sportsDisponibles.find(s => s.id === sportId) || { 
                            label: sportId, 
                            icon: '⭐' 
                          };
                          return (
                            <div key={sportId} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              backgroundColor: '#e3f2fd',
                              padding: '8px 12px',
                              borderRadius: '20px'
                            }}>
                              <span>{sport.icon}</span>
                              {sport.label}
                              <button 
                                style={{
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  color: '#d52b1e',
                                  cursor: 'pointer',
                                  fontSize: '1.2rem',
                                  marginLeft: '5px'
                                }}
                                onClick={() => toggleSport(sportId)}
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div style={{ marginBottom: '25px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: 'bold',
                    color: '#0033a0'
                  }}>Disponibilité</label>
                  <div>
                    <input 
                      type="range" 
                      min="1" 
                      max="7" 
                      value={state.user.frequence}
                      onChange={(e) => setState(prev => ({
                        ...prev,
                        user: {
                          ...prev.user,
                          frequence: parseInt(e.target.value)
                        }
                      }))}
                      style={{
                        width: '100%',
                        height: '8px',
                        borderRadius: '4px',
                        background: '#e0e0e0',
                        outline: 'none',
                        marginBottom: '10px'
                      }}
                    />
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: '#666'
                    }}>
                      <span>1 jour/sem</span>
                      <span style={{ fontWeight: 'bold', color: '#0033a0' }}>{state.user.frequence} jours/sem</span>
                      <span>7 jours/sem</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: 'bold',
                    color: '#0033a0'
                  }}>Abonnement</label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '15px'
                  }}>
                    {[
                      {icon: '🎯', value: 'gratuit', label: 'Gratuit - Essai'},
                      {icon: '🔥', value: 'premium', label: 'Premium - 9.99€/mois'},
                      {icon: '🏆', value: 'pro', label: 'Pro - 19.99€/mois'}
                    ].map(choice => (
                      <div 
                        key={choice.value}
                        style={{
                          backgroundColor: state.user.abonnement === choice.value ? '#0033a0' : '#f5f5f5',
                          color: state.user.abonnement === choice.value ? 'white' : '#333',
                          padding: '15px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        onClick={() => setState(prev => ({
                          ...prev,
                          user: {
                            ...prev.user,
                            abonnement: choice.value
                          }
                        }))}
                      >
                        <span style={{ fontSize: '1.5rem' }}>{choice.icon}</span>
                        <span>{choice.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: state.user.sportsSelectionnes.length === 0 ? '#9e9e9e' : '#d52b1e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: state.user.sportsSelectionnes.length === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    opacity: state.user.sportsSelectionnes.length === 0 ? 0.7 : 1
                  }}
                  onClick={genererPlan}
                  disabled={state.user.sportsSelectionnes.length === 0}
                >
                  GENERER MON PLAN
                </button>
              </div>
            </div>
          )}

          {state.activeTab === 'plan' && (
            <div>
              {state.planEntrainement.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px'
                }}>
                  <p style={{ marginBottom: '20px' }}>Aucun plan généré pour le moment.</p>
                  <button 
                    style={{
                      padding: '12px 25px',
                      backgroundColor: '#0033a0',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                    onClick={() => setState(prev => ({ ...prev, activeTab: 'form' }))}
                  >
                    Créer mon plan
                  </button>
                </div>
              ) : (
                <>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    <button 
                      style={{
                        padding: '10px 15px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                      onClick={() => window.open('https://www.youtube.com/results?search_query=Programme+entrainement+complet', '_blank')}
                    >
                      📅 Programme complet
                    </button>
                    
                    <button 
                      style={{
                        padding: '10px 15px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                      onClick={() => window.open('https://www.youtube.com/results?search_query=Exercices+par+muscle', '_blank')}
                    >
                      💪 Exercices par muscle
                    </button>
                    
                    <button 
                      style={{
                        padding: '10px 15px',
                        backgroundColor: '#FF9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                      onClick={() => {
                        if (state.planEntrainement.length > 0) {
                          const nouvelExercice = prompt("Ajouter un exercice à tous les jours:");
                          if (nouvelExercice) {
                            setState(prev => ({
                              ...prev,
                              planEntrainement: prev.planEntrainement.map(plan => ({
                                ...plan,
                                jours: plan.jours.map(jour => ({
                                  ...jour,
                                  exercices: [...jour.exercices, nouvelExercice]
                                }))
                              }))
                            }));
                          }
                        } else {
                          alert("Créez d'abord un plan dans l'onglet Profil");
                        }
                      }}
                    >
                      ＋ Ajouter exercice
                    </button>
                    
                    <button 
                      style={{
                        padding: '10px 15px',
                        backgroundColor: '#9C27B0',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                      onClick={ajouterNouveauJour}
                    >
                      ＋ Ajouter jour d'entrainement
                    </button>
                  </div>

                  {state.planEntrainement.map((plan, planIndex) => (
                    <div key={planIndex} style={{ marginBottom: '30px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px',
                        paddingBottom: '10px',
                        borderBottom: '2px solid #0033a0'
                      }}>
                        <h3 style={{
                          margin: 0,
                          fontSize: '1.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          {sportsDisponibles.find(s => s.label === plan.sport)?.icon || '🏅'} 
                          {plan.sport}
                        </h3>
                        <button 
                          style={{
                            padding: '5px 10px',
                            backgroundColor: 'transparent',
                            color: '#d52b1e',
                            border: '1px solid #d52b1e',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                          onClick={() => supprimerPlan(planIndex)}
                        >
                          Supprimer ce sport
                        </button>
                      </div>
                      
                      <div>
                        {plan.jours.map((jour, jourIndex) => (
                          <EditableJour
                            key={jourIndex}
                            jour={jour}
                            sportType={plan.sport}
                            onUpdate={(updatedJour) => mettreAJourJour(planIndex, jourIndex, updatedJour)}
                            onDelete={() => supprimerJour(planIndex, jourIndex)}
                            onComplete={() => handleWorkoutComplete(jour.jour, plan.sport)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {state.activeTab === 'stats' && (
            <div>
              <h2 style={{
                color: '#0033a0',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                Vos Statistiques {stats.emoji}
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                <div style={{
                  backgroundColor: '#e3f2fd',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#0033a0',
                    marginBottom: '5px'
                  }}>{stats.seancesCompletees}</div>
                  <div style={{
                    color: '#666'
                  }}>Séances complétées</div>
                </div>
                <div style={{
                  backgroundColor: '#e8f5e9',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#2e7d32',
                    marginBottom: '5px'
                  }}>{stats.tauxReussite}%</div>
                  <div style={{
                    color: '#666'
                  }}>Taux de réussite</div>
                </div>
                <div style={{
                  backgroundColor: '#fff8e1',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#ff8f00',
                    marginBottom: '5px'
                  }}>{stats.progres}%</div>
                  <div style={{
                    color: '#666'
                  }}>Progrès global</div>
                </div>
              </div>

              <div style={{
                height: '20px',
                backgroundColor: '#e0e0e0',
                borderRadius: '10px',
                marginBottom: '30px',
                overflow: 'hidden'
              }}>
                <div 
                  style={{ 
                    height: '100%',
                    width: `${stats.progres}%`,
                    backgroundColor: '#0033a0',
                    transition: 'width 0.5s ease'
                  }}
                ></div>
              </div>

              <div>
                <h3 style={{
                  color: '#0033a0',
                  marginBottom: '15px'
                }}>Dernières activités</h3>
                {stats.dernieresActivites.length > 0 ? (
                  <ul style={{
                    listStyleType: 'none',
                    padding: 0
                  }}>
                    {stats.dernieresActivites.map((activite, index) => (
                      <li key={index} style={{
                        padding: '15px',
                        marginBottom: '10px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '10px'
                      }}>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#0033a0' }}>{activite.jour}</div>
                          <div style={{ color: '#666', fontSize: '0.9rem' }}>{activite.dateStr}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: 'bold' }}>{activite.sport}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div>{activite.calories} kcal</div>
                          <div>{activite.duree} min</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{
                    textAlign: 'center',
                    color: '#666',
                    padding: '20px'
                  }}>Aucune activité récente</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StatistiquePage;