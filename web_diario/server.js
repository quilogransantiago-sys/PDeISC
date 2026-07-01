// servidor Express que sirve archivos estáticos y la página principal
// Propósito: punto de entrada del backend, configura rutas y entrega el frontend

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

// Obtener directorio actual en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde sus respectivas carpetas
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));

// Ruta raíz: entrega el index.html desde /pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Ruta para obtener las IPs del servidor (útil para el frontend)
app.get('/api/red', (req, res) => {
    const ips = obtenerIPsLocales();
    res.json({ ips, puerto: PORT });
});

/**
 * Obtiene todas las direcciones IPv4 locales de la máquina,
 * filtrando solo las de red interna (Wi-Fi, Ethernet).
 * Ignora localhost (127.0.0.1) y las de loopback.
 */
function obtenerIPsLocales() {
    const interfaces = os.networkInterfaces();
    const ips = [];

    for (const nombre in interfaces) {
        for (const info of interfaces[nombre]) {
            // Solo IPv4 internas (ignorar loopback)
            if (info.family === 'IPv4' && !info.internal) {
                ips.push({
                    interfaz: nombre,
                    ip: info.address
                });
            }
        }
    }

    return ips;
}

// Iniciar servidor escuchando en todas las interfaces (0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
    const ips = obtenerIPsLocales();
    
    console.log('═══════════════════════════════════════════');
    console.log('  Servidor iniciado en:');
    console.log(`  ➜ Local:   http://localhost:${PORT}`);
    
    ips.forEach(({ interfaz, ip }) => {
        console.log(`  ➜ Red (${interfaz}): http://${ip}:${PORT}`);
    });
    
    console.log('═══════════════════════════════════════════');
    console.log('  Comparte la IP de "Wi-Fi" o "Ethernet"');
    console.log('  para que otros dispositivos se conecten.');
    console.log('═══════════════════════════════════════════');
});
