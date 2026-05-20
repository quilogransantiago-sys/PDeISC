import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Servir archivos estáticos
app.use('/styles', express.static(join(__dirname, 'styles')));
app.use('/scripts', express.static(join(__dirname, 'scripts')));
app.use('/modules', express.static(join(__dirname, 'modules')));

// Rutas para las páginas
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'pages', 'index.html'));
});
app.get('/pag_1', (req, res) => {
    res.sendFile(join(__dirname, 'pages', 'pag_1.html'));
});
app.get('/pag_2', (req, res) => {
    res.sendFile(join(__dirname, 'pages', 'pag_2.html'));
});
app.get('/pag_3', (req, res) => {
    res.sendFile(join(__dirname, 'pages', 'pag_3.html'));
});
app.get('/pag_4', (req, res) => {
    res.sendFile(join(__dirname, 'pages', 'pag_4.html'));
});
app.get('/pag_5', (req, res) => {
    res.sendFile(join(__dirname, 'pages', 'pag_5.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});