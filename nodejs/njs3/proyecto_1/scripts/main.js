document.addEventListener('DOMContentLoaded', () => {
    const zonaH1 = document.getElementById('zonaH1');
    const zonaImagen = document.getElementById('zonaImagen');
    let h1Dinamico = null;
    let imgDinamica = null;

    function crearOActualizarH1(texto, color = '#2c3e66') {
        if (!h1Dinamico) {
            h1Dinamico = document.createElement('h1');
            zonaH1.appendChild(h1Dinamico);
        }
        h1Dinamico.textContent = texto;
        h1Dinamico.style.color = color;
        return h1Dinamico;
    }

    function cambiarTextoH1() {
        if (!h1Dinamico) crearOActualizarH1('Hola DOM');
        h1Dinamico.textContent = 'Chau DOM';
    }

    function cambiarColorH1() {
        if (!h1Dinamico) crearOActualizarH1('Hola DOM');
        const colores = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
        const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
        h1Dinamico.style.color = colorAleatorio;
    }

    const misImagenes = [
        'https://www.eldiarioweb.com/wp-content/uploads/2026/04/turismo-World-Travel-Awards-para-mar-del-plata.png',
        'https://img.jamesedition.com/listing_images/2026/04/25/10/33/54/518f50c2-147e-4e18-87bf-a76354171560/je/507x312xc.jpg',
        'https://th.bing.com/th?id=OIF.4eiYTDoO6%2fv3ZduyWyez6g&rs=1&pid=ImgDetMain&o=7&rm=3',
        'https://media.urgente24.com/p/66b90e8ecb8b7f96bec0ae2b9ae8d8f7/adjuntos/319/imagenes/002/819/0002819148/imagepng.png',
        'https://c.tenor.com/yFe8fgyL_RoAAAAC/hombre-morado-bailando.gif'
    ];
    let indiceImagenActual = 0;

    // ---- Función para agregar/quitar imagen (toggle) ----
    function agregarImagen() {
        if (imgDinamica) {
            // Si ya existe, la eliminamos
            imgDinamica.remove();
            imgDinamica = null;
        } else {
            // Creamos la imagen con la primera de la lista
            imgDinamica = document.createElement('img');
            imgDinamica.src = misImagenes[0];
            imgDinamica.alt = 'Imagen dinámica';
            imgDinamica.style.width = '400px';
            zonaImagen.appendChild(imgDinamica);
            indiceImagenActual = 0;
        }
    }

    // ---- Función para cambiar a la siguiente imagen ----
    function cambiarImagen() {
        if (!imgDinamica) {
            alert('Primero agrega una imagen con el botón "Agregar imagen"');
            return;
        }
        // Pasamos a la siguiente imagen (volviendo a 0 si llegamos al final)
        indiceImagenActual = (indiceImagenActual + 1) % misImagenes.length;
        imgDinamica.src = misImagenes[indiceImagenActual];
    }

    // ---- Función para cambiar tamaño ----
    function cambiarTamanioImagen() {
        if (!imgDinamica) {
            alert('Primero agrega una imagen');
            return;
        }
        let anchoActual = parseInt(imgDinamica.style.width);
        if (isNaN(anchoActual)) anchoActual = 300;
        let nuevoAncho = (anchoActual >= 450) ? 300 : anchoActual + 100;
        imgDinamica.style.width = nuevoAncho + 'px';
    }

    document.getElementById('btnAgregarH1').addEventListener('click', () => crearOActualizarH1('Hola DOM'));
    document.getElementById('btnCambiarTexto').addEventListener('click', cambiarTextoH1);
    document.getElementById('btnCambiarColor').addEventListener('click', cambiarColorH1);
    document.getElementById('btnAgregarImg').addEventListener('click', () => agregarImagen());
    document.getElementById('btnCambiarImg').addEventListener('click', cambiarImagen);
    document.getElementById('btnCambiarTamanio').addEventListener('click', cambiarTamanioImagen);

    crearOActualizarH1('Presiona un botón', '#888');
});