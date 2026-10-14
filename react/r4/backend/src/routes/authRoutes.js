// authRoutes: rutas de autenticación del admin.
import { Router } from "express";
import { iniciarSesionAdmin } from "../controllers/authController.js";

const router = Router();

// POST /api/auth/login -> inicia sesión y devuelve token.
router.post("/login", iniciarSesionAdmin);

export default router;
