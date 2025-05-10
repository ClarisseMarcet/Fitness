import React, { useState } from 'react';
import { updateHealthRecord } from '@/lib/healthRecord';

import { HealthRecord } from '@/types/healthRecord'; // adapte ce chemin

interface Props {
  record: HealthRecord;
  onUpdated?: () => void;
}

const UpdateHealthRecordForm: React.FC<Props> = ({ record, onUpdated }) => {
  const [weight, setWeight] = useState(record.weight.toString());
  const [height, setHeight] = useState(record.height.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateHealthRecord(record.id, {
        weight: parseFloat(weight),
        height: parseFloat(height),
      });

      if (onUpdated) onUpdated();
    } catch (err) {
      setError('Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block mb-1">Poids (kg)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block mb-1">Taille (cm)</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {loading ? 'Mise à jour...' : 'Mettre à jour'}
      </button>
    </form>
  );
};

export default UpdateHealthRecordForm;
