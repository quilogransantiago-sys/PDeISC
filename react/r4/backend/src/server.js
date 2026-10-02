// server: punto de entrada de la API del portfolio.
// Propósito: configurar middlewares, servir las imágenes subidas y montar rutas.
// Dependencias: express, cors, dotenv, fs, path, url, las rutas.
import express from "express";
import cors from "cors";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";

const app = express();

// Carpeta donde se guardan las imágenes subidas por el admin.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "uploads");

// Crea la carpeta uploads si no existe.
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middlewares globales.
app.use(cors());
app.use(express.json());

// Sirve las imágenes subidas (ej. http://localhost:5000/uploads/foto.jpg).
app.use("/uploads", express.static(uploadsDir));

// Rutas.
app.use("/api/auth", authRoutes);
app.use("/api", portfolioRoutes);

// Ruta de prueba.
app.get("/", (req, res) => {
    res.json({ mensaje: "API del portfolio (R4)." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
