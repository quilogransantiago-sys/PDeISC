/**
 * Archivo: server.js
 * Propósito: Servidor Express para servir páginas estáticas y archivos JS/CSS.
 */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));

// Rutas a páginas individuales (todas en /pages)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'index.html')));
app.get('/mouse', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'mouse.html')));
app.get('/keyboard', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'keyboard.html')));
app.get('/form', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'form.html')));
app.get('/window', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'window.html')));
app.get('/dragdrop', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'dragdrop.html')));

app.listen(PORT, () => console.log(`✅ Servidor en http://localhost:${PORT}`));