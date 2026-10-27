import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errors.js';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categories.controller.js';
import { categorySchema } from '../utilidades/validators.js';

const router = Router();

router.get('/', asyncHandler(listCategories));
router.post('/', requireAuth, requireRole('admin', 'editor'), validate(categorySchema), asyncHandler(createCategory));
router.put('/:id', requireAuth, requireRole('admin', 'editor'), validate(categorySchema), asyncHandler(updateCategory));
router.delete('/:id', requireAuth, requireRole('admin'), asyncHandler(deleteCategory));

export default router;
