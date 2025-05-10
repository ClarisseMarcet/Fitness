import { safeQuery } from '../lib/db';
import { User } from 'firebase/auth';

// Types TypeScript
interface TrainingPlan {
  id?: number;
  sport: string;
  jours: Record<string, string[]>;
}

interface UserStats {
  caloriesTotal: number;
  workoutsCompleted: number;
}

export const UserDataService = {
  // Synchronisation Firebase -> MySQL
  async syncUser(user: User) {
    await safeQuery(
      `INSERT INTO utilisateurs (firebase_uid, email) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE email = ?`,
      [user.uid, user.email, user.email]
    );
  },

  // Gestion des plans
  async saveTrainingPlan(user: User, plan: TrainingPlan) {
    await this.syncUser(user);
    
    if (plan.id) {
      await safeQuery(
        `UPDATE plans_entrainement 
         SET sport = ?, jours = ? 
         WHERE id = ? AND firebase_uid = ?`,
        [plan.sport, JSON.stringify(plan.jours), plan.id, user.uid]
      );
    } else {
      const result: any = await safeQuery(
        `INSERT INTO plans_entrainement (firebase_uid, sport, jours)
         VALUES (?, ?, ?)`,
        [user.uid, plan.sport, JSON.stringify(plan.jours)]
      );
      return result.insertId;
    }
  },

  async getTrainingPlans(user: User): Promise<TrainingPlan[]> {
    const plans: any = await safeQuery(
      `SELECT id, sport, jours FROM plans_entrainement 
       WHERE firebase_uid = ?`,
      [user.uid]
    );
    
    return plans.map((p: any) => ({
      id: p.id,
      sport: p.sport,
      jours: JSON.parse(p.jours)
    }));
  },

  // Statistiques
  async updateStats(user: User, stats: Partial<UserStats>) {
    await safeQuery(
      `INSERT INTO statistiques (firebase_uid, calories_total, workouts_count)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         calories_total = calories_total + VALUES(calories_total),
         workouts_count = workouts_count + VALUES(workouts_count)`,
      [user.uid, stats.caloriesTotal || 0, stats.workoutsCompleted || 0]
    );
  }
};