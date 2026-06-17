// Servidor Express con rutas para 5 páginas y archivos estáticos.
// Utiliza los módulos nativos (http, fs, url) y el paquete upper-case.
import express from 'express';
import fs from 'fs';
import url from 'url';
import upperCase from 'upper-case';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3000;

// Servir archivos estáticos desde sus carpetas
app.use('/styles', express.static('styles'));
app.use('/scripts', express.static('scripts'));
app.use('/modules', express.static('modules'));

// Ruta raíz: sirve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Ruta para cada página (sin extensión .html)
const paginas = ['calculadora', 'clima', 'demo-modulos', 'contacto'];
paginas.forEach(pag => {
    app.get(`/${pag}`, (req, res) => {
        res.sendFile(path.join(__dirname, 'pages', `${pag}.html`));
    });
});

// Ruta de ejemplo para demostrar el módulo URL y FS (usado en demo-modulos)
app.get('/api/url-info', (req, res) => {
    // Construir una URL completa a partir de la petición
    const urlCompleta = req.protocol + '://' + req.get('host') + req.originalUrl;
    const parsed = new URL(urlCompleta);
    // Leer un archivo con FS para demostrar su uso
    const rutaArchivo = path.join(__dirname, 'pages', 'index.html');
    let existeArchivo = false;
    try {
        fs.accessSync(rutaArchivo, fs.constants.F_OK);
        existeArchivo = true;
    } catch (e) { /* no existe */ }
    // Usar upper-case para formatear el hostname
    const hostMayus = upperCase(parsed.hostname);

    res.json({
        protocolo: parsed.protocol,
        host: parsed.host,
        hostnameMayus: hostMayus,
        pathname: parsed.pathname,
        query: Object.fromEntries(parsed.searchParams),
        archivoIndexExiste: existeArchivo
    });
});

app.listen(PUERTO, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PUERTO}`);
});