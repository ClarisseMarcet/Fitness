import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST, // localhost
  user: process.env.DB_USER, // root
  password: process.env.DB_PASSWORD, // vide
  database: process.env.DB_NAME, // coach-virtuel
  waitForConnections: true,
  connectionLimit: 10
});

// Vérification de la connexion au démarrage
export async function testConnection() {
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
  console.log('✅ MySQL connecté avec succès');
}

// Exécution sécurisée des requêtes
export async function safeQuery(sql: string, params: any[] = []) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(sql, params);
    return rows;
  } catch (error) {
    console.error('Erreur SQL:', sql, params);
    throw error;
  } finally {
    conn.release();
  }
}