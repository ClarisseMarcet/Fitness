"use client";

import React, { useState, useEffect } from 'react';
import { FaStrava, FaSignOutAlt, FaLink, FaUnlink } from 'react-icons/fa';

interface Athlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  profile: string;
}

interface Activity {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  start_date: string;
  average_speed: number;
  total_elevation_gain: number;
}

const FitConnectElite: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    checkStravaConnection();
  }, []);

  const checkStravaConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/strava/check', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`
        }
      });

      if (!response.ok) throw new Error('Erreur de vérification');

      const data = await response.json();
      setIsConnected(data.connected);

      if (data.connected) {
        await fetchAthleteData();
        await fetchActivities();
      }
    } catch (error) {
      console.error("Erreur:", error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAthleteData = async () => {
    try {
      const response = await fetch('/api/strava/athlete', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`
        }
      });

      if (!response.ok) throw new Error('Erreur de chargement');

      setAthlete(await response.json());
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/strava/activities', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`
        }
      });

      if (!response.ok) throw new Error('Erreur de chargement');

      setActivities(await response.json());
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/strava/disconnect', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`
        }
      });

      if (!response.ok) throw new Error('Erreur de déconnexion');

      setIsConnected(false);
      setAthlete(null);
      setActivities([]);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = () => {
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=154587&response_type=code&redirect_uri=http://localhost:3000/analyse-fitness&scope=read,activity:read&approval_prompt=force`;
    window.location.href = authUrl;
  };

  const handleStravaAction = async () => {
    if (isConnected) {
      await handleDisconnect();
    } else {
      handleConnect();
    }
  };

  useEffect(() => {
    const checkUrlForStravaCode = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/strava/callback?code=${code}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('firebaseToken')}`
            }
          });

          if (response.ok) {
            // Redirection vers le Dashboard
            window.location.href = '/dashboard';
          }
        } catch (error) {
          console.error("Erreur:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkUrlForStravaCode();
  }, []);

  return (
    <div className="strava-sync-container">
      <style>{`
        :root {
          --strava-orange: #fc4c02;
          --strava-orange-dark: #e03e00;
          --premium-dark: #0f172a;
          --premium-light: #f8fafc;
          --premium-accent: #3b82f6;
          --premium-success: #10b981;
        }
        .strava-sync-container {
          background: linear-gradient(135deg, var(--premium-dark), #1e293b);
          color: var(--premium-light);
          min-height: 100vh;
          overflow-x: hidden;
          padding: 2rem;
          max-width: 1500px;
          margin: 0 auto;
          position: relative;
        }
        .strava-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 3rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
        }
        .connection-status {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-weight: 600;
          margin-bottom: 1.5rem;
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          transition: all 0.3s ease;
        }
        .connection-status.connected {
          background: rgba(16, 185, 129, 0.2);
          color: var(--premium-success);
        }
        .connection-status i {
          margin-right: 0.5rem;
        }
        .strava-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1rem;
          color: white;
          background: linear-gradient(135deg, var(--strava-orange), var(--strava-orange-dark));
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(252, 76, 2, 0.4);
          width: 100%;
          max-width: 300px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }
        .strava-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(252, 76, 2, 0.6);
        }
        .strava-btn:active {
          transform: translateY(0);
        }
        .strava-btn::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0)
          );
          transform: rotate(30deg);
          transition: all 0.5s ease;
        }
        .strava-btn:hover::before {
          animation: shine 1.5s infinite;
        }
        @keyframes shine {
          0% { left: -50%; }
          100% { left: 150%; }
        }
      `}</style>

      <div className="strava-card">
        <div className={`connection-status ${isConnected ? 'connected' : ''}`}>
          {isConnected ? <FaLink /> : <FaUnlink />} &nbsp;
          {isConnected ? 'Connecté à Strava' : 'Non connecté à Strava'}
        </div>

        <button className="strava-btn" onClick={handleStravaAction} disabled={isLoading}>
          {isLoading ? (
            'Chargement...'
          ) : (
            <>
              {isConnected ? <FaSignOutAlt /> : <FaStrava />}
              {isConnected ? 'Déconnecter' : 'Connecter avec Strava'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FitConnectElite;
