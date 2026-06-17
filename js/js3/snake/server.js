/**
 * @file server.js
 * @description Servidor backend mínimo usando Express para servir los archivos estáticos
 * del juego Snake y proporcionar la dirección IP de la red local. Esto permite jugar desde
 * múltiples dispositivos (como teléfonos móviles) en la misma red local de forma sencilla.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

// Obtener la ruta del directorio actual compatible con módulos ES6 (__dirname no está definido por defecto)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000; // Puerto por defecto para levantar el servidor web

// Servir archivos estáticos para que el navegador pueda cargar CSS, scripts de lógica y módulos JS
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));

// Ruta raíz: Envía el archivo HTML principal que contiene la interfaz del juego
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

/**
 * Ruta: GET /ip
 * @description Escanea las interfaces de red del sistema operativo para encontrar la IP local activa (IPv4).
 * @why Se expone este endpoint para que el frontend pueda auto-detectar en qué IP corre el servidor
 * y así mostrar instrucciones precisas de conexión para dispositivos móviles conectados a la misma red local.
 */
app.get('/ip', (req, res) => {
    const interfaces = os.networkInterfaces();
    let ip = '127.0.0.1'; // IP fallback en caso de no encontrar interfaces de red activas
    
    // Iteramos sobre todas las interfaces de red configuradas en el sistema operativo
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Filtrado estricto: 
            // 1. Queremos IPv4 para máxima compatibilidad con dispositivos de red.
            // 2. Ignoramos interfaces internas (internal/loopback como 127.0.0.1) ya que no son accesibles desde el exterior.
            if (iface.family === 'IPv4' && !iface.internal) {
                ip = iface.address;
                break;
            }
        }
        // Si ya encontramos una IP de red externa válida (diferente de localhost), detenemos la búsqueda
        if (ip !== '127.0.0.1') break;
    }
    
    // Retorna un JSON con la IP externa y el puerto en uso
    res.json({ ip, port: PORT });
});

// Iniciar el servidor Express y escuchar en el puerto especificado
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));