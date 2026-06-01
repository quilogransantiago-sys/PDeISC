// server.js
// Propósito: Servidor Express que sirve archivos estáticos y la página principal
// Módulos usados: express, path
// Funciones principales: servir estáticos (styles, scripts, modules), raíz -> index.html

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Servir archivos estáticos desde carpetas específicas
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));

// Ruta raíz: devuelve index.html desde la carpeta pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});