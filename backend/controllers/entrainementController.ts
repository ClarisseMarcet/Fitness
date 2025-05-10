import { Request, Response } from 'express';
import { Entrainement, Categorie } from '../models/entrainementModel';

// Récupérer tous les entraînements
export const getAllEntrainements = async (req: Request, res: Response) => {
  try {
    const entrainements = await Entrainement.findAll({
      attributes: ['id', 'titre', 'description', 'niveau', 'duree_minutes', 'date_creation', 'video_url'],
      include: {
        model: Categorie,
        as: 'categorie',
        attributes: ['id', 'nom', 'slug', 'video_url'], // image_url supprimé
      },
      order: [['date_creation', 'DESC']],
    });

    res.status(200).json(entrainements);
  } catch (error) {
    const err = error as Error;
    console.error('Erreur récupération entraînements :', err.message);
    res.status(500).json({ message: "Erreur lors de la récupération des entraînements.", error: err.message });
  }
};

// Récupérer les entraînements par slug de catégorie
export const getEntrainementsByCategorieSlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  try {
    const categorie = await Categorie.findOne({ where: { slug } });

    if (!categorie) {
      res.status(404).json({ message: `Catégorie introuvable pour le slug : ${slug}` });
      return;
    }

    const entrainements = await Entrainement.findAll({
      where: { categorie_id: categorie.id },
      attributes: ['id', 'titre', 'description', 'niveau', 'duree_minutes', 'date_creation', 'video_url'],
      include: {
        model: Categorie,
        as: 'categorie',
        attributes: ['id', 'nom', 'slug', 'video_url'], // image_url supprimé
      },
    });

    res.json(entrainements);
  } catch (error) {
    const err = error as Error;
    console.error("Erreur lors de la récupération des entraînements par catégorie :", err.message);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Récupérer un entraînement par ID
export const getEntrainementById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ message: 'ID invalide fourni.' });
    return;
  }

  try {
    const entrainement = await Entrainement.findOne({
      where: { id: Number(id) },
      attributes: ['id', 'titre', 'description', 'niveau', 'duree_minutes', 'date_creation', 'video_url'],
      include: {
        model: Categorie,
        as: 'categorie',
        attributes: ['id', 'nom', 'slug', 'video_url'], // image_url supprimé
      },
    });

    if (!entrainement) {
      res.status(404).json({ message: `Entraînement introuvable pour l'ID : ${id}` });
      return;
    }

    res.json(entrainement);
  } catch (error) {
    const err = error as Error;
    console.error("Erreur lors de la récupération de l'entraînement par ID :", err.message);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
