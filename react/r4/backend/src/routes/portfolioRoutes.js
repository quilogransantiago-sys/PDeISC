// portfolioRoutes: rutas del CRUD del portfolio.
// Lectura pública; escritura protegida con JWT (solo admin).
import { Router } from "express";
import { autenticar } from "../middleware/autenticar.js";
import {
    listar,
    crear,
    actualizar,
    eliminar,
    subirImagen,
} from "../controllers/portfolioController.js";

const router = Router();

// Subida de imagen (protegida, solo admin).
router.post("/subir-imagen", autenticar, subirImagen);

// Lectura pública (el portfolio se muestra sin token).
router.get("/:tabla", listar);

// Escritura protegida (solo admin).
router.post("/:tabla", autenticar, crear);
router.put("/:tabla/:id", autenticar, actualizar);
router.delete("/:tabla/:id", autenticar, eliminar);

export default router;
