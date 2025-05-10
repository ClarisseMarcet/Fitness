import Subscription from '../models/subscriptionModel';
import axios from 'axios';

export const getUserCredits = async (userId: string): Promise<number> => {
  const subscription = await Subscription.findOne({ where: { user_id: userId } });
  if (!subscription) throw new Error('Utilisateur introuvable');
  return subscription.credits;
};

export const createUserWithCredits = async (userId: string): Promise<void> => {
  await Subscription.create({
    user_id: userId,
    credits: 10,
    status: 'active',
  });
};

export const useCreditAndChat = async (userId: string, message: string): Promise<string> => {
  const subscription = await Subscription.findOne({ where: { user_id: userId, status: 'active' } });
  if (!subscription || subscription.credits <= 0) {
    throw new Error("Pas assez de crédits");
  }

  await subscription.decrement('credits', { by: 1 });

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content;
};
