// Control de modo claro/oscuro con localStorage
const botonTema = document.getElementById('tema-btn');
const html = document.documentElement;

botonTema.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('darkMode', html.classList.contains('dark'));
});

// Mensaje para demostrar funcionalidad del script
console.log('Componente HTTP+FS: scripts cargado correctamente.');