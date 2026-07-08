// ejercicio2.js
// Servidor HTTP que muestra resultados de operaciones aritméticas

const http = require('http');

const suma = 4 + 5;
const resta = 3 - 6;
const multiplicacion = 2 * 7;
const division = 20 / 4;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`4 + 5 = ${suma}\n3 - 6 = ${resta}\n2 * 7 = ${multiplicacion}\n20 / 4 = ${division}`);
});

const PORT = 3001;

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Error: el puerto ${PORT} ya está en uso.`);
        process.exit(1);
    } else {
        console.error('Error del servidor:', err.message);
        process.exit(1);
    }
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});