import 'dotenv/config';

/**
 * Configuración central de la aplicación.
 * Lee las variables de entorno y expone valores con defaults seguros.
 */
const toList = (value, fallback = []) => {
  if (!value) return fallback;
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const config = {
  port: Number(process.env.PORT) || 4000,
  env: process.env.NODE_ENV || 'development',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'little_chochi',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-no-usar-en-produccion',
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
    refreshExpiresSeconds: 7 * 24 * 60 * 60,
  },

  corsOrigin: toList(process.env.CORS_ORIGIN, [
    'http://localhost:8081',
    'http://localhost:19006',
  ]),

  whatsapp: process.env.WHATSAPP_NUMBER || '',
};
