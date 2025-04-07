'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface RepsCounterProps {
  pose: any;
  exerciseType: 'squat' | 'pushup';
}

export default function RepsCounter({ pose, exerciseType }: RepsCounterProps) {
  const [reps, setReps] = useState(0);
  const [phase, setPhase] = useState<'up' | 'down' | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackTimeout, setFeedbackTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!pose) return;

    // Déterminer la phase de l'exercice en fonction du type
    let currentPhase: 'up' | 'down' | null = null;
    
    if (exerciseType === 'squat') {
      // Pour les squats, on regarde la position des genoux par rapport aux hanches
      const leftHip = pose.keypoints.find((kp: any) => kp.name === 'left_hip');
      const rightHip = pose.keypoints.find((kp: any) => kp.name === 'left_hip');
      const leftKnee = pose.keypoints.find((kp: any) => kp.name === 'left_knee');
      const rightKnee = pose.keypoints.find((kp: any) => kp.name === 'right_knee');
      
      if (leftHip && rightHip && leftKnee && rightKnee) {
        const hipY = (leftHip.y + rightHip.y) / 2;
        const kneeY = (leftKnee.y + rightKnee.y) / 2;
        
        // Si les genoux sont plus bas que les hanches, on est en phase descendante
        if (kneeY > hipY) {
          currentPhase = 'down';
        } else {
          currentPhase = 'up';
        }
      }
    } else if (exerciseType === 'pushup') {
      // Pour les pompes, on regarde la position des coudes par rapport aux épaules
      const leftShoulder = pose.keypoints.find((kp: any) => kp.name === 'left_shoulder');
      const rightShoulder = pose.keypoints.find((kp: any) => kp.name === 'right_shoulder');
      const leftElbow = pose.keypoints.find((kp: any) => kp.name === 'left_elbow');
      const rightElbow = pose.keypoints.find((kp: any) => kp.name === 'right_elbow');
      
      if (leftShoulder && rightShoulder && leftElbow && rightElbow) {
        const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
        const elbowY = (leftElbow.y + rightElbow.y) / 2;
        
        // Si les coudes sont plus bas que les épaules, on est en phase descendante
        if (elbowY > shoulderY) {
          currentPhase = 'down';
        } else {
          currentPhase = 'up';
        }
      }
    }
    
    // Détecter une répétition complète
    if (currentPhase !== phase) {
      if (currentPhase === 'up' && phase === 'down') {
        // Une répétition complète a été effectuée
        setReps(prev => prev + 1);
        setFeedback('Bonne répétition !');
        
        // Effacer le feedback après 2 secondes
        if (feedbackTimeout) {
          clearTimeout(feedbackTimeout);
        }
        
        const timeout = setTimeout(() => {
          setFeedback(null);
        }, 2000);
        
        setFeedbackTimeout(timeout);
      }
      
      setPhase(currentPhase);
    }
    
    return () => {
      if (feedbackTimeout) {
        clearTimeout(feedbackTimeout);
      }
    };
  }, [pose, exerciseType, phase, feedbackTimeout]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Icon 
          icon={exerciseType === 'squat' ? 'mdi:human-handsdown' : 'mdi:human-handsdown'} 
          className="text-blue-600 text-2xl mr-2" 
        />
        <h3 className="text-xl font-semibold">Compteur de répétitions</h3>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-blue-600 mb-2">{reps}</div>
        <div className="text-gray-500">répétitions</div>
      </div>
      
      <div className="flex justify-center mb-4">
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full mr-2 ${phase === 'up' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600">Phase montante</span>
        </div>
        <div className="flex items-center ml-4">
          <div className={`w-4 h-4 rounded-full mr-2 ${phase === 'down' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600">Phase descendante</span>
        </div>
      </div>
      
      {feedback && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-center mb-4">
          {feedback}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium mb-2">Instructions pour {exerciseType === 'squat' ? 'les squats' : 'les pompes'}</h4>
        {exerciseType === 'squat' ? (
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Placez-vous debout, pieds écartés</li>
            <li>• Descendez comme si vous vouliez vous asseoir</li>
            <li>• Gardez le dos droit</li>
            <li>• Remontez doucement</li>
          </ul>
        ) : (
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Placez-vous en position de planche</li>
            <li>• Mains légèrement plus larges que les épaules</li>
            <li>• Descendez jusqu'à ce que votre poitrine touche presque le sol</li>
            <li>• Remontez en poussant sur vos bras</li>
          </ul>
        )}
      </div>
    </div>
  );
} 