// authRoutes: rutas de autenticación del admin.
// Dependencias: express, authController.
import { Router } from "express";
import { iniciarSesionAdmin } from "../controllers/authController.js";

const router = Router();

// POST /api/auth/login -> inicia sesión del admin.
router.post("/login", iniciarSesionAdmin);

export default router;
