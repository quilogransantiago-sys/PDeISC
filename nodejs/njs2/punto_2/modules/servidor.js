// Componente que utiliza los módulos nativos 'http' y 'fs' para servir un archivo HTML.
// Exporta una función que crea y arranca el servidor.

import http from 'http';
import fs from 'fs';

/**
 * Inicia un servidor HTTP que lee y sirve un archivo HTML desde el sistema de archivos.
 * @param {string} rutaHtml - Ruta absoluta al archivo HTML.
 * @param {number} puerto - Puerto de escucha.
 */
export function iniciarServidor(rutaHtml, puerto) {
    const server = http.createServer((req, res) => {
        if (req.url === '/') {
            fs.readFile(rutaHtml, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error interno del servidor');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Recurso no encontrado');
        }
    });

    server.listen(puerto, () => {
        console.log(`Servidor nativo activo en http://localhost:${puerto}`);
    });

    return server;
}