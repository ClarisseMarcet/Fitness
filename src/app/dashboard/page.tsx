"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { getUserHealthRecords, HealthRecord } from '../../services/firebaseService';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

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
  objectifs?: string;
  blessures?: string;
  disponibilites?: string[];
}

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

interface SportConfig {
  baseCalories: number;
  baseDuration: number;
  intensity: string;
  exercicesTypes: string[];
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
  'Musculation': { 
    baseCalories: 400, 
    baseDuration: 60, 
    intensity: '7/10',
    exercicesTypes: [
      "Squat",
      "Développé couché",
      "Traction",
      "Soulevé de terre",
      "Fentes",
      "Curl biceps",
      "Extension triceps"
    ]
  },
  'Cardio': { 
    baseCalories: 350, 
    baseDuration: 45, 
    intensity: '8/10',
    exercicesTypes: [
      "Course à pied",
      "Vélo",
      "Corde à sauter",
      "Burpees",
      "Mountain climbers",
      "Sauts sur box"
    ]
  },
  'Yoga': { 
    baseCalories: 180, 
    baseDuration: 55, 
    intensity: '5/10',
    exercicesTypes: [
      "Salutation au soleil",
      "Posture de l'arbre",
      "Posture du guerrier",
      "Posture du chien tête en bas",
      "Posture du cobra",
      "Méditation"
    ]
  },
  'default': { 
    baseCalories: 250, 
    baseDuration: 40, 
    intensity: '6/10',
    exercicesTypes: [
      "Échauffement",
      "Exercice principal",
      "Récupération active"
    ]
  }
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

export default function DashboardPage() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('sante');
  const [planEntrainement, setPlanEntrainement] = useState<PlanEntrainement[]>([]);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [userData, setUserData] = useState<User>({
    niveau: 'débutant',
    sportsSelectionnes: [],
    sportPersonnalise: '',
    frequence: 3,
    abonnement: 'gratuit',
    objectifs: '',
    blessures: '',
    disponibilites: []
  });
  const [profileImage, setProfileImage] = useState<string>(
    typeof window !== 'undefined' ? localStorage.getItem('profileImage') || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&h=200' : 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&h=200'
  );
  const [stravaConnected, setStravaConnected] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('stravaConnected') === 'true' : false
  );

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) {
        router.push('/analyse-fitness');
        return;
      }

      try {
        setLoading(true);
        const userRecords = await getUserHealthRecords();
        setRecords(userRecords.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError('Impossible de charger les données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();

    if (typeof window !== 'undefined') {
      const savedPlan = localStorage.getItem('planEntrainement');
      const savedPerformances = localStorage.getItem('performances');
      const savedUserData = localStorage.getItem('userData');

      if (savedPlan) setPlanEntrainement(JSON.parse(savedPlan));
      if (savedPerformances) setPerformances(JSON.parse(savedPerformances));
      if (savedUserData) setUserData(JSON.parse(savedUserData));
    }
  }, [user, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('planEntrainement', JSON.stringify(planEntrainement));
      localStorage.setItem('performances', JSON.stringify(performances));
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('profileImage', profileImage);
      localStorage.setItem('stravaConnected', String(stravaConnected));
    }
  }, [planEntrainement, performances, userData, profileImage, stravaConnected]);

  const getLatestRecord = () => {
    return records[0];
  };

  const calculateProgress = () => {
    if (records.length < 2) return null;

    const latest = records[0];
    const previous = records[1];
    
    return {
      weight: latest.metrics.weight - previous.metrics.weight,
      bmi: latest.results.bmi - previous.results.bmi,
      tdee: latest.results.tdee - previous.results.tdee
    };
  };

  const getGoalStatus = () => {
    if (!records.length) return null;
    
    const latest = records[0];
    const progress = calculateProgress();
    
    if (!progress) return null;

    switch (latest.metrics.goal) {
      case 'loss':
        return progress.weight < 0 ? 'positive' : 'negative';
      case 'gain':
        return progress.weight > 0 ? 'positive' : 'negative';
      default:
        return 'neutral';
    }
  };

  const generateWorkoutData = useCallback((jour: string, sportType: string): Performance => {
    const config = SPORT_CONFIG[sportType] || SPORT_CONFIG.default;
    const plan = planEntrainement.find(p => p.sport === sportType);
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
  }, [planEntrainement]);

  const handleWorkoutComplete = useCallback((jour: string, sportType: string): void => {
    const nouvellePerformance = generateWorkoutData(jour, sportType);
    
    setPerformances(prev => [...prev, nouvellePerformance]);
    setPlanEntrainement(prev => prev.map(plan => ({
      ...plan,
      jours: plan.jours.map(j => 
        j.jour === jour ? { ...j, complet: true } : j
      )
    })));
  }, [generateWorkoutData]);

  const stats: Stats = useMemo(() => {
    const totalSeances = planEntrainement.reduce(
      (acc, plan) => acc + plan.jours.length, 0
    );
    const seancesCompletees = performances.length;
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
      dernieresActivites: performances.slice(-5).reverse().map(act => ({
        ...act,
        dateStr: new Date(act.date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        })
      }))
    };
  }, [planEntrainement, performances]);

  const toggleSport = useCallback((sportId: string): void => {
    setUserData(prev => {
      const { sportsSelectionnes } = prev;
      const newSports = sportsSelectionnes.includes(sportId)
        ? sportsSelectionnes.filter(id => id !== sportId)
        : sportsSelectionnes.length < 3
          ? [...sportsSelectionnes, sportId]
          : sportsSelectionnes;

      return {
        ...prev,
        sportsSelectionnes: newSports
      };
    });
  }, []);

  const handleSportPersonnalise = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && e.currentTarget.value.trim() && userData.sportsSelectionnes.length < 3) {
      setUserData(prev => ({
        ...prev,
        sportsSelectionnes: [...prev.sportsSelectionnes, e.currentTarget.value.trim()],
        sportPersonnalise: ''
      }));
      e.currentTarget.value = '';
    }
  }, [userData.sportsSelectionnes]);

  const genererPlan = useCallback((): void => {
    const nouveauxPlans: PlanEntrainement[] = userData.sportsSelectionnes.map(sportId => {
      const sport = sportsDisponibles.find(s => s.id === sportId) || { label: sportId };
      const config = SPORT_CONFIG[sport.label] || SPORT_CONFIG.default;
      const jours: JourEntrainement[] = [];
      const dateDebut = new Date();
      const jourActuelIndex = dateDebut.getDay();
      const indexActuel = jourActuelIndex === 0 ? 6 : jourActuelIndex - 1;
      
      for (let i = 0; i < userData.frequence; i++) {
        const jourIndex = (indexActuel + i) % 7;
        const dateJour = new Date(dateDebut);
        dateJour.setDate(dateDebut.getDate() + i);
        
        const exercices = [];
        const exercicesDisponibles = [...config.exercicesTypes];
        
        for (let j = 0; j < 3 && exercicesDisponibles.length > 0; j++) {
          const randomIndex = Math.floor(Math.random() * exercicesDisponibles.length);
          exercices.push(exercicesDisponibles.splice(randomIndex, 1)[0]);
        }
        
        jours.push({
          jour: joursSemaine[jourIndex],
          exercices,
          complet: false,
          date: dateJour
        });
      }
      
      return {
        sport: sport.label,
        jours: jours
      };
    });
    
    setPlanEntrainement(nouveauxPlans);
    setActiveTab('entrainement');
  }, [userData.sportsSelectionnes, userData.frequence]);

  const ajouterNouveauJour = useCallback((): void => {
    if (planEntrainement.length === 0) {
      alert("Ajoutez d'abord un sport dans l'onglet Profil");
      setActiveTab('profil');
      return;
    }

    const nouveauxPlans = [...planEntrainement];
    const dernierJour = nouveauxPlans[0].jours[nouveauxPlans[0].jours.length - 1];
    const nouvelleDate = new Date(dernierJour.date as Date);
    nouvelleDate.setDate(nouvelleDate.getDate() + 1);
    
    const config = SPORT_CONFIG[nouveauxPlans[0].sport] || SPORT_CONFIG.default;
    const exercicesDisponibles = [...config.exercicesTypes];
    const exercices = [];
    
    for (let j = 0; j < 3 && exercicesDisponibles.length > 0; j++) {
      const randomIndex = Math.floor(Math.random() * exercicesDisponibles.length);
      exercices.push(exercicesDisponibles.splice(randomIndex, 1)[0]);
    }
    
    nouveauxPlans[0].jours.push({
      jour: joursSemaine[nouvelleDate.getDay() === 0 ? 6 : nouvelleDate.getDay() - 1],
      exercices: exercices.length > 0 ? exercices : ["Nouvel exercice"],
      complet: false,
      date: nouvelleDate
    });

    setPlanEntrainement(nouveauxPlans);
  }, [planEntrainement]);

  const mettreAJourJour = useCallback((
    planIndex: number,
    jourIndex: number,
    updatedJour: JourEntrainement
  ): void => {
    setPlanEntrainement(prev => {
      const nouveauxPlans = [...prev];
      nouveauxPlans[planIndex].jours[jourIndex] = updatedJour;
      return nouveauxPlans;
    });
  }, []);

  const supprimerJour = useCallback((planIndex: number, jourIndex: number): void => {
    setPlanEntrainement(prev => {
      const nouveauxPlans = [...prev];
      nouveauxPlans[planIndex].jours.splice(jourIndex, 1);
      return nouveauxPlans;
    });
  }, []);

  const supprimerPlan = useCallback((planIndex: number): void => {
    setPlanEntrainement(prev => {
      const nouveauxPlans = [...prev];
      nouveauxPlans.splice(planIndex, 1);
      return nouveauxPlans;
    });
  }, []);

  const toggleStravaConnection = () => {
    setStravaConnected(!stravaConnected);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUserDataChange = (field: keyof User, value: string | string[] | number) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white opacity-10"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24 relative">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 relative overflow-hidden p-8 rounded-2xl bg-gray-800 bg-opacity-70 backdrop-blur-md border border-gray-700 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-blue-500/10 opacity-30 animate-gradient-rotate"></div>
            
            <div className="flex items-center mb-6 md:mb-0">
              <div className="relative group">
                <img 
                  src={profileImage} 
                  alt="Profil" 
                  className="w-24 h-24 rounded-full border-4 border-orange-500 shadow-lg"
                />
                <label className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <i className="fas fa-camera text-white text-xl"></i>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-blue-400">
                  {user?.displayName || 'Mon Tableau de Bord'}
                </h1>
                <p className="text-gray-300">Bienvenue sur votre espace personnel</p>
              </div>
            </div>
            
            <div className="bg-gray-800/70 p-4 rounded-xl backdrop-blur border border-gray-700 hover:border-orange-500/30 transition-all shadow-lg">
              <div className={`flex items-center px-4 py-2 rounded-full mb-3 ${
                stravaConnected ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
              }`}>
                <i className={`fas ${stravaConnected ? 'fa-link' : 'fa-unlink'} mr-2`}></i>
                {stravaConnected ? 'Connecté à Strava' : 'Non connecté à Strava'}
              </div>
              
              <button 
                onClick={toggleStravaConnection}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-orange-500/20 w-full"
              >
                <i className="fab fa-strava"></i>
                {stravaConnected ? 'Déconnecter' : 'Connecter avec Strava'}
              </button>
            </div>
          </div>

          <div className="flex justify-center mb-8 gap-2 flex-wrap">
            <button 
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'sante' 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('sante')}
            >
              <i className="fas fa-heartbeat mr-2"></i> Santé
            </button>
            <button 
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'entrainement' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('entrainement')}
            >
              <i className="fas fa-dumbbell mr-2"></i> Entraînement
            </button>
            <button 
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'statistiques' 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('statistiques')}
            >
              <i className="fas fa-chart-line mr-2"></i> Statistiques
            </button>
            <button 
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'profil' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('profil')}
            >
              <i className="fas fa-user mr-2"></i> Profil
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-900/50 text-red-100 rounded-lg backdrop-blur border border-red-800">
              {error}
            </div>
          ) : activeTab === 'sante' ? (
            <div className="space-y-8">
              {records.length === 0 ? (
                <div className="p-8 bg-gray-800/70 rounded-2xl text-center backdrop-blur border border-gray-700 max-w-2xl mx-auto">
                  <p className="text-gray-300 mb-6">Bienvenue ! Commencez par faire votre premier calcul.</p>
                  <a 
                    href="/calculator" 
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-orange-500/20"
                  >
                    <i className="fas fa-calculator"></i>
                    Faire un calcul
                  </a>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-800/70 p-6 rounded-xl backdrop-blur border border-gray-700 hover:border-orange-500/30 transition-all shadow-lg hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-orange-500/10 text-orange-400">
                          <i className="fas fa-weight-scale text-xl"></i>
                        </div>
                        <h3 className="text-lg font-semibold">Poids</h3>
                      </div>
                      <p className="text-3xl font-bold mb-2">{getLatestRecord().metrics.weight} kg</p>
                      {calculateProgress() && (
                        <p className={`text-sm ${
                          getGoalStatus() === 'positive' ? 'text-green-400' : 
                          getGoalStatus() === 'negative' ? 'text-red-400' : 
                          'text-gray-400'
                        }`}>
                          {(() => {
                            const progress = calculateProgress();
                            if (!progress) return null;
                            return (
                              <>
                                <i className={`fas ${
                                  progress.weight > 0 ? 'fa-arrow-up text-red-400' : 
                                  progress.weight < 0 ? 'fa-arrow-down text-green-400' : 
                                  'fa-equals text-gray-400'
                                } mr-1`}></i>
                                {Math.abs(progress.weight).toFixed(1)} kg depuis le dernier calcul
                              </>
                            );
                          })()}
                        </p>
                      )}
                    </div>
                    
                    <div className="bg-gray-800/70 p-6 rounded-xl backdrop-blur border border-gray-700 hover:border-blue-500/30 transition-all shadow-lg hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                          <i className="fas fa-chart-line text-xl"></i>
                        </div>
                        <h3 className="text-lg font-semibold">IMC</h3>
                      </div>
                      <p className="text-3xl font-bold mb-2">{getLatestRecord().results.bmi.toFixed(1)}</p>
                      <p className="text-sm text-blue-300 capitalize">{getLatestRecord().results.bmiStatus}</p>
                    </div>
                    
                    <div className="bg-gray-800/70 p-6 rounded-xl backdrop-blur border border-gray-700 hover:border-purple-500/30 transition-all shadow-lg hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
                          <i className="fas fa-fire text-xl"></i>
                        </div>
                        <h3 className="text-lg font-semibold">Besoins caloriques</h3>
                      </div>
                      <p className="text-3xl font-bold mb-2">{Math.round(getLatestRecord().results.tdee)}</p>
                      <p className="text-sm text-purple-300">calories/jour</p>
                    </div>
                  </div>

                  <div className="bg-gray-800/70 p-6 rounded-xl backdrop-blur border border-gray-700 transition-all shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                          <i className="fas fa-bullseye text-orange-400"></i>
                          Objectif actuel
                        </h3>
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 rounded-full bg-gray-700 text-sm capitalize">
                            {getLatestRecord().metrics.goal === 'loss' 
                              ? 'Perte de poids' 
                              : getLatestRecord().metrics.goal === 'gain' 
                                ? 'Prise de poids' 
                                : 'Maintien du poids'}
                          </span>
                          <span className="text-sm text-gray-300">
                            <i className="fas fa-bolt text-yellow-400 mr-1"></i>
                            Objectif: {Math.round(getLatestRecord().results.targetCalories)} kcal/jour
                          </span>
                        </div>
                      </div>
                      <a 
                        href="/calculator" 
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 text-sm sm:text-base"
                      >
                        <i className="fas fa-plus"></i>
                        Nouveau calcul
                      </a>
                    </div>
                  </div>

                  {getLatestRecord().recommendations && (
                    <div className="bg-gray-800/70 p-6 rounded-xl backdrop-blur border border-gray-700 transition-all shadow-lg">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <i className="fas fa-lightbulb text-yellow-400"></i>
                        Dernières recommandations
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-700/50 rounded-lg border-l-4 border-green-500">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <i className="fas fa-utensils text-green-400"></i>
                            Alimentation
                          </h4>
                          <div className="text-sm text-gray-300 space-y-2">
                            {Array.isArray(getLatestRecord().recommendations.diet) ? 
                              getLatestRecord().recommendations.diet.map((item, idx) => (
                                <p key={idx} className="pl-3 border-l border-green-500/30">• {item}</p>
                              )) : 
                              <p>{getLatestRecord().recommendations.diet}</p>
                            }
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gray-700/50 rounded-lg border-l-4 border-blue-500">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <i className="fas fa-dumbbell text-blue-400"></i>
                            Exercice
                          </h4>
                          <div className="text-sm text-gray-300 space-y-2">
                            {Array.isArray(getLatestRecord().recommendations.exercise) ? 
                              getLatestRecord().recommendations.exercise.map((item, idx) => (
                                <p key={idx} className="pl-3 border-l border-blue-500/30">• {item}</p>
                              )) : 
                              <p>{getLatestRecord().recommendations.exercise}</p>
                            }
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gray-700/50 rounded-lg border-l-4 border-purple-500">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <i className="fas fa-heartbeat text-purple-400"></i>
                            Mode de vie
                          </h4>
                          <div className="text-sm text-gray-300 space-y-2">
                            {Array.isArray(getLatestRecord().recommendations.lifestyle) ? 
                              getLatestRecord().recommendations.lifestyle.map((item, idx) => (
                                <p key={idx} className="pl-3 border-l border-purple-500/30">• {item}</p>
                              )) : 
                              <p>{getLatestRecord().recommendations.lifestyle}</p>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-center pt-4">
                    <a 
                      href="/history" 
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium group"
                    >
                      Voir l'historique complet
                      <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                  </div>
                </>
              )}
            </div>
          ) : activeTab === 'entrainement' ? (
            <div className="space-y-8">
              {stravaConnected && (
                <div className="bg-gray-800/70 p-6 rounded-xl backdrop-blur border border-gray-700 transition-all shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <i className="fab fa-strava text-orange-500"></i>
                    Vos activités Strava récentes
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-700/50 rounded-lg overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                      <div className="h-40 bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                        <i className="fas fa-running text-white text-4xl"></i>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold flex justify-between items-center">
                          <span>Course matinale</span>
                          <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full">Course</span>
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">Aujourd'hui, 06:30</p>
                        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                          <div>
                            <p className="text-xl font-bold">5.2</p>
                            <p className="text-xs text-gray-400">km</p>
                          </div>
                          <div>
                            <p className="text-xl font-bold">25:12</p>
                            <p className="text-xs text-gray-400">durée</p>
                          </div>
                          <div>
                            <p className="text-xl font-bold">420</p>
                            <p className="text-xs text-gray-400">kcal</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700/50 rounded-lg overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                      <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <i className="fas fa-biking text-white text-4xl"></i>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold flex justify-between items-center">
                          <span>Sortie vélo</span>
                          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">Vélo</span>
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">Hier, 17:45</p>
                        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                          <div>
                            <p className="text-xl font-bold">42.5</p>
                            <p className="text-xs text-gray-400">km</p>
                          </div>
                          <div>
                            <p className="text-xl font-bold">1:45:22</p>
                            <p className="text-xs text-gray-400">durée</p>
                          </div>
                          <div>
                            <p className="text-xl font-bold">1250</p>
                            <p className="text-xs text-gray-400">kcal</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700/50 rounded-lg overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                      <div className="h-40 bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                        <i className="fas fa-swimming-pool text-white text-4xl"></i>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold flex justify-between items-center">
                          <span>Natation intensive</span>
                          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">Natation</span>
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">13 mai 2024, 07:15</p>
                        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                          <div>
                            <p className="text-xl font-bold">1.5</p>
                            <p className="text-xs text-gray-400">km</p>
                          </div>
                          <div>
                            <p className="text-xl font-bold">45:18</p>
                            <p className="text-xs text-gray-400">durée</p>
                          </div>
                          <div>
                            <p className="text-xl font-bold">380</p>
                            <p className="text-xs text-gray-400">kcal</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-800/70 p-6 rounded-xl backdrop-blur border border-gray-700 transition-all shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <i className="fas fa-dumbbell text-blue-400"></i>
                    Votre plan d'entraînement
                  </h3>
                  <button 
                    onClick={ajouterNouveauJour}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 text-sm"
                  >
                    <i className="fas fa-plus"></i> Ajouter jour
                  </button>
                </div>

                {planEntrainement.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-400 mb-6">Aucun plan d'entraînement généré pour le moment.</p>
                    <button 
                      onClick={() => setActiveTab('profil')}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-orange-500/20"
                    >
                      Créer mon plan
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {planEntrainement.map((plan, planIndex) => (
                      <div key={planIndex} className="space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                          <h4 className="text-lg font-medium flex items-center gap-2">
                            {sportsDisponibles.find(s => s.label === plan.sport)?.icon || '🏅'}
                            {plan.sport}
                          </h4>
                          <button 
                            onClick={() => supprimerPlan(planIndex)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            <i className="fas fa-trash mr-1"></i> Supprimer
                          </button>
                        </div>
                        
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
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'statistiques' ? (
            <div className="bg-gray-800/70 p-6 rounded-xl backdrop-blur border border-gray-700 transition-all shadow-lg">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <i className="fas fa-chart-pie text-purple-400"></i>
                Vos Statistiques {stats.emoji}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-700/50 p-6 rounded-xl text-center border border-blue-500/20">
                  <div className="text-4xl font-bold text-blue-400 mb-2">{stats.seancesCompletees}</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Séances complétées</div>
                </div>
                <div className="bg-gray-700/50 p-6 rounded-xl text-center border border-green-500/20">
                  <div className="text-4xl font-bold text-green-400 mb-2">{stats.tauxReussite}%</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Taux de réussite</div>
                </div>
                <div className="bg-gray-700/50 p-6 rounded-xl text-center border border-orange-500/20">
                  <div className="text-4xl font-bold text-orange-400 mb-2">{stats.progres}%</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">Progrès global</div>
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <i className="fas fa-trophy text-yellow-400"></i>
                  Votre progression
                </h4>
                <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500" 
                    style={{ width: `${stats.progres}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <i className="fas fa-history text-gray-400"></i>
                  Dernières activités
                </h4>
                
                {stats.dernieresActivites.length > 0 ? (
                  <div className="space-y-3">
                    {stats.dernieresActivites.map((activite, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-purple-500/30 transition-colors"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="font-medium text-blue-400">{activite.jour}</div>
                            <div className="text-sm text-gray-400">{activite.dateStr}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{activite.sport}</div>
                          </div>
                          <div className="text-right">
                            <div className="flex justify-end gap-4">
                              <div>
                                <div className="font-medium">{activite.calories}</div>
                                <div className="text-xs text-gray-400">kcal</div>
                              </div>
                              <div>
                                <div className="font-medium">{activite.duree}</div>
                                <div className="text-xs text-gray-400">min</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-700/30 rounded-lg">
                    <i className="fas fa-chart-line text-4xl text-gray-500 mb-3"></i>
                    <p className="text-gray-400">Aucune donnée statistique disponible</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-gray-800/70 p-6 rounded-xl backdrop-blur border border-gray-700 transition-all shadow-lg">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <i className="fas fa-user-cog text-green-400"></i>
                  Configuration de votre profil sportif
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Niveau</label>
                    <div className="flex gap-2 flex-wrap">
                      {['Débutant', 'Intermédiaire', 'Avancé'].map(niveau => (
                        <button
                          key={niveau}
                          onClick={() => handleUserDataChange('niveau', niveau.toLowerCase())}
                          className={`px-4 py-2 rounded-full text-sm ${
                            userData.niveau === niveau.toLowerCase() 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {niveau}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Choisis tes 3 sports principaux
                      <span className="ml-2 text-gray-400">
                        ({userData.sportsSelectionnes.length}/3 sélectionnés)
                      </span>
                    </label>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      {sportsDisponibles.map(sport => (
                        <button
                          key={sport.id}
                          onClick={() => toggleSport(sport.id)}
                          disabled={userData.sportsSelectionnes.length >= 3 && !userData.sportsSelectionnes.includes(sport.id)}
                          className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                            userData.sportsSelectionnes.includes(sport.id)
                              ? 'bg-blue-500/20 border border-blue-500/50'
                              : 'bg-gray-700 hover:bg-gray-600'
                          } ${
                            userData.sportsSelectionnes.length >= 3 && !userData.sportsSelectionnes.includes(sport.id)
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                        >
                          <span className="text-2xl">{sport.icon}</span>
                          <span className="text-sm mt-1">{sport.label}</span>
                        </button>
                      ))}
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Ton sport n'est pas listé ? Écris-le ici et appuie sur Entrée"
                      onKeyDown={handleSportPersonnalise}
                      disabled={userData.sportsSelectionnes.length >= 3}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Disponibilité - {userData.frequence} jours/semaine
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="7" 
                      value={userData.frequence}
                      onChange={(e) => handleUserDataChange('frequence', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1 jour</span>
                      <span>7 jours</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Jours de disponibilité</label>
                    <div className="flex flex-wrap gap-2">
                      {joursSemaine.map(jour => (
                        <button
                          key={jour}
                          onClick={() => {
                            const newDispo = userData.disponibilites?.includes(jour)
                              ? userData.disponibilites.filter(d => d !== jour)
                              : [...(userData.disponibilites || []), jour];
                            handleUserDataChange('disponibilites', newDispo);
                          }}
                          className={`px-3 py-1 rounded-full text-sm ${
                            userData.disponibilites?.includes(jour)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {jour}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Objectifs personnels</label>
                    <textarea
                      value={userData.objectifs || ''}
                      onChange={(e) => handleUserDataChange('objectifs', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                      rows={3}
                      placeholder="Décrivez vos objectifs sportifs..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Blessures/limitations</label>
                    <textarea
                      value={userData.blessures || ''}
                      onChange={(e) => handleUserDataChange('blessures', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                      rows={2}
                      placeholder="Décrivez vos blessures ou limitations..."
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Abonnement</label>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        {icon: '🎯', value: 'gratuit', label: 'Gratuit - Essai'},
                        {icon: '🔥', value: 'premium', label: 'Premium - 9.99€/mois'},
                        {icon: '🏆', value: 'pro', label: 'Pro - 19.99€/mois'}
                      ].map(choice => (
                        <button
                          key={choice.value}
                          onClick={() => handleUserDataChange('abonnement', choice.value)}
                          className={`p-4 rounded-lg flex items-center gap-3 transition-all ${
                            userData.abonnement === choice.value
                              ? 'bg-purple-500/20 border border-purple-500/50'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          <span className="text-2xl">{choice.icon}</span>
                          <span className="text-left">
                            <span className="block font-medium text-gray-100">{choice.label.split(' - ')[0]}</span>
                            <span className="block text-xs text-gray-400">{choice.label.split(' - ')[1]}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={genererPlan}
                    disabled={userData.sportsSelectionnes.length === 0}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                      userData.sportsSelectionnes.length === 0
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg'
                    }`}
                  >
                    Générer mon plan d'entraînement
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        
        @keyframes gradient-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-gradient-rotate {
          animation: gradient-rotate 20s linear infinite;
        }
      `}</style>
    </MainLayout>
  );
}