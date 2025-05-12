// src/pages/admin/ajouter-entrainement.tsx
import React from 'react';
import ActionButtons from '../../components/ActionButtons';  // Assure-toi que le chemin est correct

const AjouterEntrainementPage = () => {
  return (
    <div>
      <h1>Ajouter un nouvel entraînement</h1>
      <p>Utilisez le bouton ci-dessous pour ajouter un nouvel entraînement à la base de données.</p>
      <ActionButtons /> {/* Le composant avec les boutons */}
    </div>
  );
};

export default AjouterEntrainementPage;
