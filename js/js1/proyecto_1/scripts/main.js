// scripts/main.js
// Propósito: Orquestar la aplicación con validaciones, demostración práctica de lectura de formularios.
import { agregarUsuario, actualizarUsuario } from '../modules/userManager.js';
import {
    inicializarUI, mostrarMensaje, limpiarFormulario,
    renderizarLista, manejarDelegacionLista
} from '../modules/uiHelpers.js';

const form = document.getElementById('formUsuario');
const idHidden = document.getElementById('usuarioId');
const btnCancelar = document.getElementById('btnCancelar');
const contenedorLista = document.getElementById('contenedorLista');
const mensajesDiv = document.getElementById('mensajes');
const btnDemoDirecto = document.getElementById('demoDirecto');
const btnDemoFormData = document.getElementById('demoFormData');
const btnDemoDelegacion = document.getElementById('demoDelegacion');
const demoResultado = document.getElementById('demoResultado');

// Validaciones (igual que antes)
function validarNombre(nombre) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/;
    return regex.test(nombre);
}
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
function validarEdad(edad) {
    const num = Number(edad);
    return !isNaN(num) && Number.isInteger(num) && num >= 0 && num <= 120;
}
function validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const edad = document.getElementById('edad').value;
    if (!nombre) { mostrarMensaje('El nombre es obligatorio', 'error'); return false; }
    if (!validarNombre(nombre)) { mostrarMensaje('El nombre solo puede contener letras y espacios', 'error'); return false; }
    if (!email) { mostrarMensaje('El correo electrónico es obligatorio', 'error'); return false; }
    if (!validarEmail(email)) { mostrarMensaje('Correo electrónico inválido', 'error'); return false; }
    if (edad === '') { mostrarMensaje('La edad es obligatoria', 'error'); return false; }
    if (!validarEdad(edad)) { mostrarMensaje('Edad debe ser entero entre 0 y 120', 'error'); return false; }
    return true;
}

inicializarUI(contenedorLista, mensajesDiv);
renderizarLista();

function refrescarVista() {
    renderizarLista();
    limpiarFormulario(form, idHidden);
    document.getElementById('btnGuardar').textContent = 'Guardar usuario';
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validarFormulario()) return;
    const id = idHidden.value;
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const edad = parseInt(document.getElementById('edad').value, 10);
    const activo = document.getElementById('activo').checked;
    if (id === '') {
        const nuevo = agregarUsuario({ nombre, email, edad, activo });
        mostrarMensaje(`Usuario ${nuevo.nombre} creado`, 'exito');
    } else {
        const actualizado = actualizarUsuario(id, { nombre, email, edad, activo });
        if (actualizado) mostrarMensaje(`Usuario ${actualizado.nombre} actualizado`, 'exito');
        else mostrarMensaje('Error al actualizar', 'error');
    }
    refrescarVista();
});

btnCancelar.addEventListener('click', () => {
    limpiarFormulario(form, idHidden);
    document.getElementById('btnGuardar').textContent = 'Guardar usuario';
});

contenedorLista.addEventListener('click', (event) => {
    manejarDelegacionLista(event, form, idHidden, refrescarVista);
});

// ========== DEMOSTRACIÓN PRÁCTICA DE LECTURA ==========
// 1. Método directo (DOM)
btnDemoDirecto.addEventListener('click', () => {
    const nombre = document.getElementById('nombre').value.trim() || '(vacío)';
    const email = document.getElementById('email').value.trim() || '(vacío)';
    const edad = document.getElementById('edad').value || '(vacío)';
    const activo = document.getElementById('activo').checked;
    demoResultado.innerHTML = `
        <strong>🔍 MÉTODO DIRECTO (lectura elemento por elemento)</strong><br>
        ✅ Lectura correcta de los valores actuales del formulario:<br>
        📛 Nombre: ${escapeHtml(nombre)}<br>
        ✉️ Email: ${escapeHtml(email)}<br>
        🎂 Edad: ${edad}<br>
        ✅ Activo: ${activo ? 'Sí' : 'No'}<br>
        <span style="color: var(--exito);">✨ Funciona: se accedió con getElementById y .value / .checked</span>
    `;
});

// 2. Método FormData
btnDemoFormData.addEventListener('click', () => {
    const formData = new FormData(form);
    const nombre = formData.get('nombre') || '(vacío)';
    const email = formData.get('email') || '(vacío)';
    const edad = formData.get('edad') || '(vacío)';
    const activo = formData.has('activo') ? 'Sí' : 'No';
    demoResultado.innerHTML = `
        <strong>📦 MÉTODO FORMDATA</strong><br>
        ✅ Lectura automática del formulario completo:<br>
        📛 Nombre: ${escapeHtml(nombre)}<br>
        ✉️ Email: ${escapeHtml(email)}<br>
        🎂 Edad: ${edad}<br>
        ✅ Activo: ${activo}<br>
        <span style="color: var(--exito);">✨ Funciona: se usó new FormData() y .get() / .has()</span>
    `;
});

// 3. Método por delegación (explicación + simulación de lectura desde evento)
btnDemoDelegacion.addEventListener('click', () => {
    // Para hacerlo práctico, tomamos un usuario de ejemplo de la lista si existe
    const usuarios = document.querySelectorAll('.tarjeta-usuario');
    let ejemploHtml = '';
    if (usuarios.length > 0) {
        const primerBotonEditar = usuarios[0]?.querySelector('.btn-editar');
        const idEjemplo = primerBotonEditar?.dataset.id || 'desconocido';
        ejemploHtml = `<br><strong>🎯 Ejemplo real:</strong> En la lista de usuarios, cuando haces clic en "Editar" o "Eliminar",<br>
        el evento se captura en el contenedor padre (delegación) y mediante <code>event.target</code> se lee el atributo <code>data-id="${idEjemplo}"</code><br>
        y la acción correspondiente. Así se evita tener que asignar eventos a cada botón individualmente.`;
    }
    demoResultado.innerHTML = `
        <strong>🖱️ MÉTODO POR DELEGACIÓN (event.target)</strong><br>
        ✅ La delegación consiste en escuchar eventos en un contenedor padre y usar <code>event.target</code><br>
        para identificar el elemento exacto que disparó el evento.<br>
        ${ejemploHtml}<br>
        <span style="color: var(--exito);">✨ Funciona: actualmente los botones de la lista usan esta técnica (prueba Editar/Eliminar).</span>
    `;
});

// Modo oscuro con íconos textuales (mejorado visualmente)
function aplicarTema(tema) {
    const btn = document.getElementById('btnTema');
    if (tema === 'oscuro') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('tema', 'oscuro');
        btn.innerHTML = '☀️ Modo claro';
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('tema', 'claro');
        btn.innerHTML = '🌙 Modo oscuro';
    }
}
document.getElementById('btnTema').addEventListener('click', () => {
    const esOscuro = document.documentElement.classList.contains('dark');
    aplicarTema(esOscuro ? 'claro' : 'oscuro');
});
// Inicializar
if (document.documentElement.classList.contains('dark')) {
    document.getElementById('btnTema').innerHTML = '☀️ Modo claro';
} else {
    document.getElementById('btnTema').innerHTML = '🌙 Modo oscuro';
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}