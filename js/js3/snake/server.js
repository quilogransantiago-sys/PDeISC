import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Servir archivos estáticos
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Ruta para obtener la IP local del servidor
app.get('/ip', (req, res) => {
    const interfaces = os.networkInterfaces();
    let ip = '127.0.0.1';
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Ignorar IPv6 y loopback
            if (iface.family === 'IPv4' && !iface.internal) {
                ip = iface.address;
                break;
            }
        }
        if (ip !== '127.0.0.1') break;
    }
    res.json({ ip, port: PORT });
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));