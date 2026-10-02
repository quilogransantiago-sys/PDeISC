// authRoutes: rutas públicas de autenticación.
// Dependencias: express, authController.
import { Router } from "express";
import { registrar, iniciarSesion, iniciarSesionSocial } from "../controllers/authController.js";

const router = Router();

// POST /api/auth/registro -> crea un usuario.
router.post("/registro", registrar);

// POST /api/auth/login -> inicia sesión y devuelve token.
router.post("/login", iniciarSesion);

// POST /api/auth/social -> login social (OAuth 2.0 / Auth0).
router.post("/social", iniciarSesionSocial);

export default router;

