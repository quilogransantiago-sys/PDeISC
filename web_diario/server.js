// servidor Express que sirve archivos estáticos y la página principal
// Propósito: punto de entrada del backend, configura rutas y entrega el frontend

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener directorio actual en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde sus respectivas carpetas
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));

// Ruta raíz: entrega el index.html desde /pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});