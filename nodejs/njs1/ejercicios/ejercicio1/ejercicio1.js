// ejercicio1.js
// Servidor HTTP básico con Node.js

const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Hola mundo desde Node.js\nFin.');
});

const PORT = 3000;

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Error: el puerto ${PORT} ya está en uso. Cerrá la terminal anterior o cambiá el puerto.`);
        process.exit(1);
    } else {
        console.error('Error del servidor:', err.message);
        process.exit(1);
    }
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

