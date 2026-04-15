// modules/menu.js
function generarMenu(rutaActiva = '') {
    const enlaces = [
        { nombre: 'Inicio', url: '/' },
        { nombre: 'Clima', url: '/clima' },
        { nombre: 'Calculadora', url: '/calculadora' },
        { nombre: 'Acerca', url: '/acerca' },
        { nombre: 'Contacto', url: '/contacto' }
    ];
    let menuHtml = '<nav class="menu"><ul>';
    for (const enlace of enlaces) {
        const activo = (enlace.url === rutaActiva) ? ' class="activo"' : '';
        menuHtml += `<li><a href="${enlace.url}"${activo}>${enlace.nombre}</a></li>`;
    }
    menuHtml += '</ul></nav>';
    return menuHtml;
}
export default generarMenu;