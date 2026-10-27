import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errors.js';
import {
  register,
  login,
  refresh,
  logout,
  me,
  socialLogin,
} from '../controllers/auth.controller.js';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  socialLoginSchema,
} from '../utilidades/validators.js';

const router = Router();

router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/login', validate(loginSchema), asyncHandler(login));
router.post('/refresh', validate(refreshSchema), asyncHandler(refresh));
router.post('/logout', asyncHandler(logout));
router.post('/social', validate(socialLoginSchema), asyncHandler(socialLogin));

router.get('/me', requireAuth, asyncHandler(me));

export default router;
