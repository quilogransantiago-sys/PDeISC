// configMulter: configura la subida de imágenes.
// Propósito: guardar los archivos subidos en la carpeta "uploads" con un nombre único.
// Dependencias: multer, path, url.
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configura dónde y con qué nombre se guarda cada imagen.
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        // Nombre único: marca de tiempo + nombre original sin espacios.
        const nombreUnico =
            Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
        cb(null, nombreUnico);
    },
});

// Exporta el middleware de subida (solo imágenes, máximo 5 MB).
export const subir = multer({
    storage: almacenamiento,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten imágenes."));
        }
    },
});
