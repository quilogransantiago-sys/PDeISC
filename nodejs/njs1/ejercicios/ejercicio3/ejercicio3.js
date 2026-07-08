// ejercicio3.js
// Servidor HTTP que muestra resultados de operaciones usando funciones

const http = require('http');

function sumar(a, b) {
    return a + b;
}

function restar(a, b) {
    return a - b;
}

function multiplicar(a, b) {
    return a * b;
}

function dividir(a, b) {
    return a / b;
}

const server = http.createServer((req, res) => {
    const resultadoSuma = sumar(4, 5);
    const resultadoResta = restar(3, 6);
    const resultadoMultiplicacion = multiplicar(2, 7);
    const resultadoDivision = dividir(20, 4);

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`4 + 5 = ${resultadoSuma}\n3 - 6 = ${resultadoResta}\n2 * 7 = ${resultadoMultiplicacion}\n20 / 4 = ${resultadoDivision}`);
});

const PORT = 3002;

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