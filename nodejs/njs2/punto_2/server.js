/**
 * server.js
 * Servidor HTTP usando módulos nativos 'http' y 'fs'.
 * Sirve archivos estáticos desde /pages, /styles, /scripts.
 * Punto de entrada: node server.js
 * Módulos usados: http, fs, path.
 * Funciones principales: manejar solicitudes, servir archivos con MIME correcto.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapeo de extensiones a tipos MIME
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

/**
 * Sirve un archivo solicitado.
 * @param {string} filePath - Ruta absoluta al archivo.
 * @param {object} res - Respuesta HTTP.
 */
function servirArchivo(filePath, res) {
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Archivo no encontrado: devolver 404
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>404 - Archivo no encontrado</h1>');
            } else {
                // Error interno del servidor
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>500 - Error interno del servidor</h1>');
            }
            return;
        }
        res.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
        res.end(data);
    });
}

// Crear servidor HTTP
const servidor = http.createServer((req, res) => {
    console.log(`Solicitud recibida: ${req.url}`);

    // Normalizar la URL (evitar ataques de path traversal)
    let url = req.url;
    if (url === '/') {
        url = '/pages/index.html';
    }

    // Construir ruta absoluta segura
    const filePath = path.join(__dirname, url);
    // Verificar que la ruta esté dentro del directorio del proyecto (seguridad básica)
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>403 - Acceso denegado</h1>');
        return;
    }

    servirArchivo(filePath, res);
});

// Puerto fijo (común para desarrollo)
const PUERTO = 3000;
servidor.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
    console.log('Presiona Ctrl+C para detener.');
});