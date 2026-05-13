import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use('/styles', express.static(join(__dirname, 'styles')));
app.use('/scripts', express.static(join(__dirname, 'scripts')));
app.use('/modules', express.static(join(__dirname, 'modules')));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'pages', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor Punto 6 corriendo en http://localhost:${PORT}`);
});