import { safeQuery } from '../lib/db';

export const DbHelpers = {
  // Formatage pour le frontend
  formatTrainingDays(plan: any) {
    return Object.entries(plan.jours).map(([day, exercises]) => ({
      day,
      exercises,
      completed: false
    }));
  },

  // Nettoyage des anciennes données
  async cleanupOldData() {
    await safeQuery(
      `DELETE FROM plans_entrainement 
       WHERE updated_at < DATE_SUB(NOW(), INTERVAL 1 YEAR)`
    );
  },

  // Backup des données
  async createBackup() {
    const backup = {
      plans: await safeQuery(`SELECT * FROM plans_entrainement`),
      stats: await safeQuery(`SELECT * FROM statistiques`)
    };
    return JSON.stringify(backup);
  }
};