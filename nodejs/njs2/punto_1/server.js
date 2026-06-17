import express from 'express';
const app = express();
const PORT = 3000;

app.use('/styles', express.static('styles'));
app.use('/scripts', express.static('scripts'));
app.use('/modules', express.static('modules'));

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/pages/index.html');
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));