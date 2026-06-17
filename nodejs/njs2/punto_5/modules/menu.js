// Módulo que genera el HTML del menú de navegación (incluye hamburguesa)
// Se exporta una función que inserta el menú en el elemento con id 'menu-container'

/**
 * Construye el menú con enlaces a las 5 páginas y lo agrega al DOM.
 * @param {string} paginaActual - El nombre de la página actual (sin extensión) para resaltar.
 */
export function construirMenu(paginaActual = '') {
    const contenedor = document.getElementById('menu-container');
    if (!contenedor) return;

    // Definir los enlaces (nombre mostrado, ruta)
    const enlaces = [
        { nombre: 'Inicio', ruta: '/' },
        { nombre: 'Calculadora', ruta: '/calculadora' },
        { nombre: 'Clima', ruta: '/clima' },
        { nombre: 'Demo Módulos', ruta: '/demo-modulos' },
        { nombre: 'Contacto', ruta: '/contacto' }
    ];

    // Crear estructura del menú
    const nav = document.createElement('nav');
    nav.className = 'menu-navegacion';

    // Botón hamburguesa
    const hamburger = document.createElement('button');
    hamburger.className = 'menu-hamburguesa';
    hamburger.setAttribute('aria-label', 'Abrir menú');
    hamburger.innerHTML = '☰'; // Usar carácter simple, sin emoji (se puede estilizar)
    // O mejor: tres líneas con CSS, pero por simplicidad usamos texto

    // Lista de enlaces
    const lista = document.createElement('ul');
    lista.className = 'menu-lista';

    enlaces.forEach(enlace => {
        const item = document.createElement('li');
        const a = document.createElement('a');
        a.href = enlace.ruta;
        a.textContent = enlace.nombre;
        if (enlace.ruta === '/' + paginaActual || (enlace.ruta === '/' && paginaActual === '')) {
            a.classList.add('activo');
        }
        item.appendChild(a);
        lista.appendChild(item);
    });

    nav.appendChild(hamburger);
    nav.appendChild(lista);
    contenedor.appendChild(nav);

    // Evento para toggle del menú en móvil
    hamburger.addEventListener('click', () => {
        lista.classList.toggle('abierto');
    });

    // Cerrar menú al hacer clic en un enlace (opcional)
    lista.querySelectorAll('a').forEach(enlace => {
        enlace.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                lista.classList.remove('abierto');
            }
        });
    });

    // Cerrar menú al redimensionar a desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            lista.classList.remove('abierto');
        }
    });
}