/**
 * server.js - Servidor Express con API propia.
 * - POST /api/users: recibe { name, email }, valida duplicados (case insensitive),
 *   guarda en memoria y devuelve el usuario con ID asignado.
 * - Sirve archivos estáticos y la página principal.
 */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware para parsear JSON
app.use(express.json());

// Archivos estáticos
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));

// ===== API propia en memoria =====
let usuarios = [];
let nextId = 1;

app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Faltan nombre o email' });
    }
    // Validar duplicado por email (case insensitive)
    const emailLower = email.toLowerCase().trim();
    const existe = usuarios.some(u => u.email.toLowerCase().trim() === emailLower);
    if (existe) {
        return res.status(409).json({ error: 'El correo ya está registrado en el servidor' });
    }
    const nuevo = { id: nextId++, name: name.trim(), email: emailLower };
    usuarios.push(nuevo);
    res.status(201).json(nuevo);
});

// Ruta GET opcional para consultar (no requerida pero útil)
app.get('/api/users', (req, res) => {
    res.json(usuarios);
});

// ===== Página principal =====
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});