/**
 * menuHamburguesa.js
 * Componente que agrega un botón hamburguesa y un menú desplegable
 * con enlaces a las 5 páginas principales.
 * Exporta la función crearMenuHamburguesa.
 */

/**
 * Crea e inyecta el menú hamburguesa en el DOM.
 * Se añade un botón en el encabezado, un panel lateral y una capa overlay.
 */
export function crearMenuHamburguesa() {
    // Evitar duplicados
    if (document.querySelector('.boton-hamburguesa')) return;

    const encabezado = document.querySelector('.encabezado');
    if (!encabezado) return;

    // Botón hamburguesa
    const boton = document.createElement('button');
    boton.textContent = '☰';
    boton.className = 'boton-hamburguesa';
    boton.setAttribute('aria-label', 'Menú');
    encabezado.appendChild(boton);

    // Menú lateral
    const menu = document.createElement('nav');
    menu.className = 'menu-lateral';
    menu.innerHTML = `
    <ul>
      <li><a href="/">Inicio</a></li>
      <li><a href="/tiempo">Módulo Tiempo</a></li>
      <li><a href="/calculo">Módulo Cálculo</a></li>
      <li><a href="/url">Analizador URL</a></li>
      <li><a href="/upper">Convertidor Upper-Case</a></li>
      <li><a href="/sistema">HTTP + FS</a></li>
    </ul>
  `;
    document.body.appendChild(menu);

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    function abrirMenu() {
        menu.classList.add('abierto');
        overlay.classList.add('visible');
    }

    function cerrarMenu() {
        menu.classList.remove('abierto');
        overlay.classList.remove('visible');
    }

    boton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (menu.classList.contains('abierto')) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    });

    overlay.addEventListener('click', cerrarMenu);

    // Cerrar al hacer clic en un enlace
    menu.querySelectorAll('a').forEach(enlace => {
        enlace.addEventListener('click', cerrarMenu);
    });
}