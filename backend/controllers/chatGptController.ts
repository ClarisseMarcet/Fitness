import { Request, Response } from 'express';
import { useCreditAndChat, getUserCredits, createUserWithCredits } from '../services/chatGptService';

export const chatController = async (req: Request, res: Response): Promise<void> => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    res.status(400).json({ error: 'ID utilisateur et message requis' });
    return;
  }

  try {
    let userCredits: number;

    try {
      userCredits = await getUserCredits(userId);
    } catch {
      await createUserWithCredits(userId);
      userCredits = 10;
    }

    const aiResponse = await useCreditAndChat(userId, message);
    res.status(200).json({ response: aiResponse, remainingCredits: userCredits - 1 });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
};

export const getCreditsController = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
  
    try {
      const credits = await getUserCredits(userId);
      res.status(200).json({ credits });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erreur lors de la récupération des crédits.' });
    }
  };
  