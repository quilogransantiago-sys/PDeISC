// modules/uiHelpers.js
// Actualizado: la lista tiene scroll automático (CSS), eliminación sin confirm.
import { obtenerUsuarios, eliminarUsuario, actualizarUsuario, obtenerUsuarioPorId } from './userManager.js';

let contenedorLista = null;
let mensajesDiv = null;

export function inicializarUI(listaElement, mensajesElement) {
    contenedorLista = listaElement;
    mensajesDiv = mensajesElement;
}

export function mostrarMensaje(texto, tipo = 'exito') {
    if (!mensajesDiv) return;
    const msg = document.createElement('div');
    msg.className = 'mensaje';
    msg.style.borderLeftColor = tipo === 'exito' ? 'var(--exito)' : 'var(--peligro)';
    msg.textContent = texto;
    mensajesDiv.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}

export function limpiarFormulario(form, idHidden) {
    form.reset();
    idHidden.value = '';
    const chk = document.getElementById('activo');
    if (chk) chk.checked = false;
}

export function cargarUsuarioEnFormulario(usuario, form, idHidden) {
    idHidden.value = usuario.id;
    document.getElementById('nombre').value = usuario.nombre;
    document.getElementById('email').value = usuario.email;
    document.getElementById('edad').value = usuario.edad;
    document.getElementById('activo').checked = usuario.activo;
}

export function renderizarLista() {
    if (!contenedorLista) return;
    const usuarios = obtenerUsuarios();
    if (usuarios.length === 0) {
        contenedorLista.innerHTML = '<p class="cargando">No hay usuarios registrados.</p>';
        return;
    }
    const html = usuarios.map(usuario => `
        <div class="tarjeta-usuario" data-usuario-id="${usuario.id}">
            <div class="info-usuario">
                <strong>${escapeHtml(usuario.nombre)}</strong>
                <span>📧 ${escapeHtml(usuario.email)}</span>
                <span>🎂 ${usuario.edad} años</span>
                <span class="${usuario.activo ? 'estado-activo' : 'estado-inactivo'}">
                    ${usuario.activo ? 'Activo' : 'Inactivo'}
                </span>
            </div>
            <div class="acciones-usuario">
                <button class="btn btn-editar btn-accion" data-id="${usuario.id}" data-accion="editar">✏️ Editar</button>
                <button class="btn btn-eliminar btn-accion" data-id="${usuario.id}" data-accion="eliminar">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
    contenedorLista.innerHTML = html;
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : (m === '<' ? '&lt;' : '&gt;'));
}

export function manejarDelegacionLista(event, form, idHidden, actualizarVistaCallback) {
    const boton = event.target.closest('.btn-accion');
    if (!boton) return;
    const id = boton.dataset.id;
    const accion = boton.dataset.accion;
    if (accion === 'eliminar') {
        if (eliminarUsuario(id)) {
            mostrarMensaje('Usuario eliminado correctamente', 'exito');
            actualizarVistaCallback();
        } else {
            mostrarMensaje('Error al eliminar', 'error');
        }
    } else if (accion === 'editar') {
        const usuario = obtenerUsuarioPorId(id);
        if (usuario) {
            cargarUsuarioEnFormulario(usuario, form, idHidden);
            document.getElementById('btnGuardar').textContent = 'Actualizar usuario';
            mostrarMensaje(`Editando a ${usuario.nombre}`, 'exito');
        }
    }
}