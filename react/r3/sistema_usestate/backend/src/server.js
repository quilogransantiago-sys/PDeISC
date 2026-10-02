// server: punto de entrada de la API (Express).
// Propósito: configurar middlewares, montar las rutas y levantar el servidor.
// Dependencias: express, cors, dotenv, las rutas.
import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";

const app = express();

// Middlewares globales.
app.use(cors());            // permite peticiones desde el frontend
app.use(express.json());    // parsea el cuerpo JSON de las peticiones

// Rutas.
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);

// Ruta de prueba.
app.get("/", (req, res) => {
    res.json({ mensaje: "API del sistema de usuarios (sistema_usestate)." });
});

// Levanta el servidor en el puerto indicado.
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
