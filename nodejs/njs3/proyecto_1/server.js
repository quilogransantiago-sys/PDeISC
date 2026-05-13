// Importamos express (el servidor web)
import express from 'express';

// Creamos la aplicación
const app = express();

// Definimos el puerto
const PORT = 3000;

// Servir archivos estáticos desde las carpetas:
// - /styles   para CSS
// - /scripts  para JS
// - /modules  para módulos (aunque ahora no lo usamos)
// - /pages    para los HTML (pero lo haremos por separado)
app.use('/styles', express.static('styles'));
app.use('/scripts', express.static('scripts'));
app.use('/modules', express.static('modules'));

// Ruta principal: cuando entran a "/" enviamos el archivo index.html que está dentro de /pages
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/pages/index.html');
});

// Arrancamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
