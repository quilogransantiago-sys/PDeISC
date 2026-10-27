import mysql from 'mysql2/promise';
import { config } from './config.js';

/**
 * Pool de conexiones a MySQL.
 * Se usa `mysql2/promise` para poder escribir async/await en los controllers.
 */
export const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: 'Z',
});

/**
 * Verifica que la base de datos responde (usada al arrancar el servidor).
 */
export async function checkDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.query('SELECT 1');
  } finally {
    connection.release();
  }
}
