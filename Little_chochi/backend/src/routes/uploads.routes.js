import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { asyncHandler } from '../middleware/errors.js';
import { upload } from '../middleware/upload.js';

const router = Router();

/**
 * Subida de imágenes de productos (admin/editor).
 * Devuelve la URL relativa servida estáticamente en `/uploads`.
 */
router.post(
  '/',
  requireAuth,
  requireRole('admin', 'editor'),
  upload.single('archivo'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No se recibió ningún archivo' });
    }
    res.status(201).json({
      ok: true,
      data: { url: `/uploads/${req.file.filename}` },
    });
  }),
);

export default router;
