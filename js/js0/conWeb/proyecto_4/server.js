/**
 * Servidor Express para el proyecto de demostración del método shift().
 * 
 * shift() elimina el primer elemento de un array y lo retorna.
 * Este servidor sirve archivos estáticos desde styles, scripts y modules,
 * y envía la página principal desde pages/index.html.
 * 
 * @module server
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual en módulos ES (equivalente a __dirname en CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Configurar rutas para archivos estáticos.
// Cada carpeta se asigna a una URL base que coincida con su nombre.
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));

// Ruta principal: envía el archivo HTML que contiene la interfaz de usuario.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Iniciar el servidor en el puerto especificado.
app.listen(PORT, () => {
    console.log(`Servidor shift() corriendo en http://localhost:${PORT}`);
});