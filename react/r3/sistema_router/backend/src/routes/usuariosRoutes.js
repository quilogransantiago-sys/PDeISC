// usuariosRoutes: rutas de CRUD de usuarios (protegidas con JWT).
// Dependencias: express, autenticar (middleware), usuariosController.
import { Router } from "express";
import { autenticar } from "../middleware/autenticar.js";
import {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
} from "../controllers/usuariosController.js";

const router = Router();

// Todas las rutas de usuarios requieren token válido.
router.use(autenticar);

// GET /api/usuarios -> lista todos.
router.get("/", listar);

// GET /api/usuarios/:id -> obtiene uno.
router.get("/:id", obtenerPorId);

// POST /api/usuarios -> crea.
router.post("/", crear);

// PUT /api/usuarios/:id -> actualiza.
router.put("/:id", actualizar);

// DELETE /api/usuarios/:id -> elimina.
router.delete("/:id", eliminar);

export default router;
