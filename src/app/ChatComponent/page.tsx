'use client';

import { useEffect, useState } from 'react';
import { saveHealthRecord } from '../services/firebaseService';


const Dashboard = () => {
  const [credits, setCredits] = useState<number | null>(null);
  const userId = 'USER_ID_DYNAMIQUE'; // Remplace ceci par l’ID actuel via Firebase ou autre

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/credits/${userId}`);
        const data = await res.json();
        setCredits(data.credits);
      } catch (error) {
        console.error('Erreur de récupération des crédits :', error);
      }
    };

    fetchCredits();
  }, [userId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
      <div className="bg-white rounded shadow p-6">
        <p className="text-lg">Crédits restants : {credits !== null ? credits : 'Chargement...'}</p>
      </div>
    </div>
  );
};

export default Dashboard;
