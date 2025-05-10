import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Charge les variables d'environnement
dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', 
  database: process.env.DB_NAME || 'coach-virtuel', 
  dialect: process.env.DB_DIALECT as 'mysql', 
});

export default sequelize;
