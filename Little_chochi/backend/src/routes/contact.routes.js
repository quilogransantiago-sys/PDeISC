import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errors.js';
import { createMessage, listMessages } from '../controllers/contact.controller.js';
import { contactSchema } from '../utilidades/validators.js';

const router = Router();

router.post('/', validate(contactSchema), asyncHandler(createMessage));
router.get('/', requireAuth, requireRole('admin', 'editor'), asyncHandler(listMessages));

export default router;
