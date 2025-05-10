// routes/chatgptRoutes.ts




import { Router } from 'express';
import { chatController, getCreditsController } from '../controllers/chatGptController';

const router = Router();

// Route POST pour la conversation avec ChatGPT
router.post('/chat', chatController);

// Route GET pour récupérer les crédits d'un utilisateur
router.get('/credits/:userId', getCreditsController);

export default router;
