import { Router } from 'express';
import { getAllEntrainements, getEntrainementsByCategorieSlug, getEntrainementById } from '../controllers/entrainementController';

const router = Router();

// Route pour récupérer tous les entraînements avec les catégories associées
router.get('/entrainements', getAllEntrainements);

// Route pour récupérer les entraînements par slug de catégorie
router.get('/entrainements/categorie/:slug', getEntrainementsByCategorieSlug);

// Route pour récupérer un entraînement par ID avec la catégorie associée
router.get('/entrainements/:id', getEntrainementById);

export default router;
