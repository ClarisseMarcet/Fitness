// src/components/ActionButtons.tsx


'use client'; 

import React, { useState } from 'react';
import { uploadTrainingData, TrainingData } from '../services/trainingData/uploadTrainingData';
import { allTrainings } from '../services/trainingData/allTrainings';  // Assure-toi que le fichier est bien là

const ActionButtons = () => {
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleAction = async () => {
    for (let index = 0; index < allTrainings.length; index++) {
      const training = allTrainings[index];

      try {
        const docId = await uploadTrainingData(training);
        if (docId) {
          setUploadStatus(`Entraînement "${training.title}" ajouté avec succès.`);
        }
      } catch (error) {
        setUploadStatus(`Erreur lors de l'ajout de "${training.title}".`);
      }
    }
  };

  return (
    <div>
      <button onClick={handleAction}>Ajouter les entraînements</button>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default ActionButtons;
