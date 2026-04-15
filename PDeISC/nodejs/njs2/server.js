// server.js – Versión inicial (solo para probar HTTP + FS + URL)
const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const path = require('path');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    // Punto 3: mostrar información de la URL en consola
    const parsedUrl = url.parse(req.url, true);
    console.log(`\n📡 Request a: ${req.url}`);
    console.log(`   Host: ${req.headers.host}`);
    console.log(`   Pathname: ${parsedUrl.pathname}`);
    console.log(`   Query: ${JSON.stringify(parsedUrl.query)}`);

    // Servir un archivo HTML estático (por ahora solo index.html)
    if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
        try {
            const html = await fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } catch (err) {
            res.writeHead(500);
            res.end('Error al leer el archivo');
        }
    } else {
        res.writeHead(404);
        res.end('Página no encontrada');
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});