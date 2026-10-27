import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { errorHandler, notFoundHandler } from './middleware/errors.js';

import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import usersRoutes from './routes/users.routes.js';
import contactRoutes from './routes/contact.routes.js';
import uploadsRoutes from './routes/uploads.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        // Permite peticiones sin origin (Postman, curl) y los orígenes configurados.
        if (!origin || config.corsOrigin.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      credentials: true,
    }),
  );

  app.use(express.json({ limit: '1mb' }));

  // Imágenes subidas por el admin
  app.use('/uploads', express.static(path.resolve(__dirname, '../../uploads')));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ ok: true, servicio: 'little-chochi-api', hora: new Date().toISOString() });
  });

  // Rutas
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productsRoutes);
  app.use('/api/categories', categoriesRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/uploads', uploadsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
