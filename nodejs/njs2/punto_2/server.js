// Servidor HTTP nativo con File System. Sirve HTML, CSS y JS desde carpetas separadas.
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUERTO = 3001;

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
};

const servidor = http.createServer((peticion, respuesta) => {
    let ruta = peticion.url;
    if (ruta === '/') ruta = '/pages/index.html';
    const rutaCompleta = path.join(__dirname, ruta);

    console.log(`SIRVIENDO: ${ruta}`); // <-- LOG para demostrar FS

    fs.readFile(rutaCompleta, (error, datos) => {
        if (error) {
            console.error(`ERROR: ${ruta} no encontrado`);
            respuesta.writeHead(404);
            respuesta.end('Archivo no encontrado');
            return;
        }
        const extension = path.extname(rutaCompleta);
        const tipo = mimeTypes[extension] || 'application/octet-stream';
        respuesta.writeHead(200, { 'Content-Type': tipo });
        respuesta.end(datos);
    });
});

servidor.listen(PUERTO, () => {
    console.log(`Servidor HTTP+FS corriendo en http://localhost:${PUERTO}`);
});