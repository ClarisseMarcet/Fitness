'use client'; 

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import styled from "styled-components";

// Définition du type pour un exercice
interface Exercice {
  id: number;
  nom: string;
  thumbnailUrl?: string; // thumbnailUrl peut être optionnel
}

const PageContainer = styled.div`
  padding: 20px;
`;

const AddExerciseButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContainer = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const ExerciseList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

const ExerciseCard = styled.div`
  background-color: #f4f4f4;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ExerciseThumbnail = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const ExerciseName = styled.h3`
  margin-top: 10px;
  text-align: center;
  font-size: 16px;
`;

const ButtonClose = styled.button`
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 10px;
  margin-top: 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ff4500;
  }
`;

const ExercicePage = () => {
  const [exercises, setExercises] = useState<Exercice[]>([]); // Liste des exercices disponibles
  const [addedExercises, setAddedExercises] = useState<Exercice[]>([]); // Liste des exercices ajoutés
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/exercices');
        setExercises(response.data.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des exercices:', error);
      }
    };
    fetchExercises();
  }, []);

  const addExercise = async (exerciseId: number) => {
    const userId = 'USER_ID_EXEMPLE'; // Remplacer par un user dynamique
    await axios.post('http://localhost:5000/api/exercices-ajouter', {
      userId,
      exerciceId: exerciseId,
    });

    // Ajout de l'exercice à la liste des exercices ajoutés
    const selectedExercise = exercises.find((exercise) => exercise.id === exerciseId);
    if (selectedExercise) {
      setAddedExercises((prevAdded) => [...prevAdded, selectedExercise]);
    }
    
    router.push('/mes-exercices'); // Redirection vers la page "Mes exercices"
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <PageContainer>
      <h1>Page des Exercices</h1>
      <AddExerciseButton onClick={openModal}>Ajouter un exercice</AddExerciseButton>

      {showModal && (
        <ModalBackground>
          <ModalContainer>
            <h2>Choisissez un exercice</h2>
            <ExerciseList>
              {exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} onClick={() => addExercise(exercise.id)}>
                  {exercise.thumbnailUrl ? (
                    <ExerciseThumbnail src={exercise.thumbnailUrl} alt={exercise.nom} />
                  ) : (
                    <div style={{ height: '150px', background: '#ccc', borderRadius: '8px' }} />
                  )}
                  <ExerciseName>{exercise.nom}</ExerciseName>
                </ExerciseCard>
              ))}
            </ExerciseList>
            <ButtonClose onClick={closeModal}>Fermer</ButtonClose>
          </ModalContainer>
        </ModalBackground>
      )}

      {/* Affichage des exercices ajoutés */}
      <h2>Mes Exercices</h2>
      <ExerciseList>
        {addedExercises.map((exercise) => (
          <ExerciseCard key={exercise.id}>
            {exercise.thumbnailUrl ? (
              <ExerciseThumbnail src={exercise.thumbnailUrl} alt={exercise.nom} />
            ) : (
              <div style={{ height: '150px', background: '#ccc', borderRadius: '8px' }} />
            )}
            <ExerciseName>{exercise.nom}</ExerciseName>
          </ExerciseCard>
        ))}
      </ExerciseList>
    </PageContainer>
  );
};

export default ExercicePage;
