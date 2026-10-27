import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errors.js';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller.js';
import { productSchema } from '../utilidades/validators.js';

const router = Router();

// Públicas
router.get('/', asyncHandler(listProducts));
router.get('/:id', asyncHandler(getProduct));

// Requieren autenticación y rol admin/editor
router.post('/', requireAuth, requireRole('admin', 'editor'), validate(productSchema), asyncHandler(createProduct));
router.put('/:id', requireAuth, requireRole('admin', 'editor'), validate(productSchema), asyncHandler(updateProduct));
router.delete('/:id', requireAuth, requireRole('admin', 'editor'), asyncHandler(deleteProduct));

export default router;
