import express from 'express';
import { getFilteredExercises } from '../controllers/exerciseController';

const router = express.Router();

// Route pour récupérer les exercices filtrés
router.get('/exercises', getFilteredExercises);

export default router;
