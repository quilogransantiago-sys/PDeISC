import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler, httpError } from '../middleware/errors.js';
import {
  listUsers,
  getUser,
  updateUser,
  updateRole,
  deleteUser,
} from '../controllers/users.controller.js';
import { updateProfileSchema, updateRoleSchema } from '../utilidades/validators.js';

const router = Router();

// Autenticado: leer su propio perfil
router.get('/me', requireAuth, asyncHandler((req, res) => {
  res.json({ ok: true, data: req.usuario });
}));

// Admin: listar y gestionar usuarios
router.get('/', requireAuth, requireRole('admin'), asyncHandler(listUsers));
router.get('/:id', requireAuth, requireRole('admin'), asyncHandler(getUser));
router.put('/:id', requireAuth, requireRole('admin'), validate(updateProfileSchema), asyncHandler(updateUser));
router.patch('/:id/role', requireAuth, requireRole('admin'), validate(updateRoleSchema), asyncHandler(updateRole));
router.delete('/:id', requireAuth, requireRole('admin'), asyncHandler(deleteUser));

export default router;
