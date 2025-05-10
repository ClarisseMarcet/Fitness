import { Request, Response } from 'express';
import { Exercise } from '../models/exerciseModel';
import { Op } from 'sequelize';

// Récupérer tous les exercices avec des filtres (recherche par nom, catégorie, etc.)
export const getFilteredExercises = async (req: Request, res: Response) => {
  const { query, categorie, niveau } = req.query;

  try {
    const filters: any = {};

    // Application du filtre de recherche par nom si 'query' est fourni
    if (query) {
      filters.nom = { [Op.like]: `%${query}%` };
    }

    // Application du filtre de catégorie si 'categorie' est fourni
    if (categorie) {
      filters.categorie = { [Op.like]: `%${categorie}%` };
    }

    // Application du filtre de niveau si 'niveau' est fourni
    if (niveau) {
      filters.niveau = { [Op.like]: `%${niveau}%` };
    }

    // Récupérer les exercices filtrés
    const exercises = await Exercise.findAll({
      where: filters,
    });

    // Parcours des exercices récupérés pour générer le thumbnailUrl à partir de l'URL de la vidéo
    const exercisesWithThumbnails = exercises.map((exercise) => {
      if (!exercise.thumbnailUrl && exercise.videoUrl && exercise.videoUrl.includes('youtube.com/watch?v=')) {
        const videoId = exercise.videoUrl.split('v=')[1].split('&')[0];
        exercise.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
      return exercise;
    });

    res.status(200).json({ success: true, data: exercisesWithThumbnails });
  } catch (error) {
    console.error('Erreur lors de la récupération des exercices :', error);
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des exercices." });
  }
};
