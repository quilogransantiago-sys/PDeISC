/**
 * main.js
 * Controlador con modal personalizado para confirmar eliminación.
 */

import {
    obtenerRegistros,
    agregarRegistro,
    actualizarRegistro,
    eliminarRegistro,
    obtenerRegistroPorId,
    inicializarDatosEjemplo
} from '/modules/gestorRegistros.js';

// DOM elements
const form = document.getElementById('formRegistro');
const nombreInput = document.getElementById('nombreCompleto');
const emailInput = document.getElementById('email');
const edadInput = document.getElementById('edad');
const generoRadios = document.querySelectorAll('input[name="genero"]');
const paisSelect = document.getElementById('pais');
const interesesCheckboxes = document.querySelectorAll('input[name="intereses"]');
const registroIdInput = document.getElementById('registroId');
const btnCancelar = document.getElementById('btnCancelar');
const panelMensajes = document.getElementById('panelMensajes');
const contenedorLista = document.getElementById('contenedorLista');
const btnModoOscuro = document.getElementById('btnModoOscuro');

// Modal personalizado (se crea dinámicamente)
let modalConfirmacion = null;

let modoEdicion = false;
let idEditando = null;

// Variable para almacenar el ID pendiente de eliminar
let pendingDeleteId = null;

function mostrarMensaje(texto, esError = false) {
    panelMensajes.innerHTML = `<span style="color: ${esError ? 'var(--error)' : 'inherit'}">${texto}</span>`;
    setTimeout(() => {
        if (panelMensajes.innerHTML === `<span style="color: ${esError ? 'var(--error)' : 'inherit'}">${texto}</span>`) {
            panelMensajes.innerHTML = '';
        }
    }, 4000);
}

function limpiarErrores() {
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
}

function validarYRecolectarDatos() {
    limpiarErrores();
    let valido = true;
    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const edad = edadInput.value;
    let genero = '';
    for (let radio of generoRadios) {
        if (radio.checked) { genero = radio.value; break; }
    }
    const pais = paisSelect.value;
    const intereses = Array.from(interesesCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    // Validación nombre: solo letras, espacios y acentos
    const nombreRegex = /^[a-zA-ZáéíóúñÑüÜ\s]+$/;
    if (nombre === '') {
        document.getElementById('errorNombre').textContent = 'El nombre es obligatorio.';
        valido = false;
    } else if (!nombreRegex.test(nombre)) {
        document.getElementById('errorNombre').textContent = 'El nombre solo puede contener letras y espacios (no números ni símbolos).';
        valido = false;
    }

    // Validación email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        document.getElementById('errorEmail').textContent = 'El email es obligatorio.';
        valido = false;
    } else if (!emailRegex.test(email)) {
        document.getElementById('errorEmail').textContent = 'Ingrese un email válido (ej: nombre@dominio.com).';
        valido = false;
    }

    // Validación edad
    if (edad === '') {
        document.getElementById('errorEdad').textContent = 'La edad es obligatoria.';
        valido = false;
    } else {
        const edadNum = Number(edad);
        if (isNaN(edadNum) || edadNum < 0 || edadNum > 120) {
            document.getElementById('errorEdad').textContent = 'Edad debe ser un número entre 0 y 120.';
            valido = false;
        }
    }

    // Validación género
    if (!genero) {
        document.getElementById('errorGenero').textContent = 'Seleccione una opción.';
        valido = false;
    }

    // Validación país
    if (pais === '') {
        document.getElementById('errorPais').textContent = 'Seleccione un país.';
        valido = false;
    }

    // (Opcional) Intereses no es obligatorio, se puede dejar vacío

    return {
        valido,
        datos: {
            nombreCompleto: nombre,
            email,
            edad: Number(edad),
            genero,
            pais,
            intereses
        }
    };
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Crear modal personalizado (sin alert/confirm)
function crearModal() {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'modalConfirmacion';
    modalDiv.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    modalDiv.innerHTML = `
        <div style="background: var(--card-fondo); padding: 1.5rem; border-radius: 1rem; max-width: 350px; text-align: center; box-shadow: 0 4px 12px var(--sombra);">
            <p style="margin-bottom: 1rem;">¿Está seguro de eliminar este registro?</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="confirmarEliminar" class="btn btn-eliminar">Eliminar</button>
                <button id="cancelarEliminar" class="btn btn-secundario">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalDiv);
    return modalDiv;
}

function mostrarModal() {
    if (!modalConfirmacion) modalConfirmacion = crearModal();
    modalConfirmacion.style.display = 'flex';
}

function ocultarModal() {
    if (modalConfirmacion) modalConfirmacion.style.display = 'none';
    pendingDeleteId = null;
}

function renderizarLista() {
    const registros = obtenerRegistros();
    if (registros.length === 0) {
        contenedorLista.innerHTML = '<p class="texto-vacio">No hay registros. Complete el formulario para agregar.</p>';
        return;
    }
    contenedorLista.innerHTML = '';
    registros.forEach(reg => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-registro';
        tarjeta.innerHTML = `
            <div class="info-registro">
                <p><strong>${escapeHtml(reg.nombreCompleto)}</strong> (${reg.edad} años, ${reg.genero})</p>
                <p>Email: ${escapeHtml(reg.email)}</p>
                <p>País: ${escapeHtml(reg.pais)} | Intereses: ${reg.intereses.length ? reg.intereses.join(', ') : 'Ninguno'}</p>
            </div>
            <div class="acciones-registro">
                <button data-id="${reg.id}" class="btn btn-editar btn-editar-registro">Editar</button>
                <button data-id="${reg.id}" class="btn btn-eliminar btn-eliminar-registro">Eliminar</button>
            </div>
        `;
        contenedorLista.appendChild(tarjeta);
    });

    // Eventos editar
    document.querySelectorAll('.btn-editar-registro').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            cargarRegistroParaEditar(id);
        });
    });
    // Eventos eliminar: abren modal, no confirman directamente
    document.querySelectorAll('.btn-eliminar-registro').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            pendingDeleteId = id;
            mostrarModal();
        });
    });
}

function cargarRegistroParaEditar(id) {
    const registro = obtenerRegistroPorId(id);
    if (!registro) {
        mostrarMensaje('Registro no encontrado', true);
        return;
    }
    modoEdicion = true;
    idEditando = id;
    registroIdInput.value = id;
    nombreInput.value = registro.nombreCompleto;
    emailInput.value = registro.email;
    edadInput.value = registro.edad;
    generoRadios.forEach(radio => {
        radio.checked = (radio.value === registro.genero);
    });
    paisSelect.value = registro.pais;
    interesesCheckboxes.forEach(cb => {
        cb.checked = registro.intereses.includes(cb.value);
    });
    btnCancelar.style.display = 'inline-block';
    form.querySelector('button[type="submit"]').textContent = 'Actualizar registro';
    mostrarMensaje(`Editando registro de ${registro.nombreCompleto}`);
}

function cancelarEdicion() {
    modoEdicion = false;
    idEditando = null;
    registroIdInput.value = '';
    form.reset();
    limpiarErrores();
    btnCancelar.style.display = 'none';
    form.querySelector('button[type="submit"]').textContent = 'Guardar registro';
    mostrarMensaje('Edición cancelada.');
}

function manejarSubmit(e) {
    e.preventDefault();
    const { valido, datos } = validarYRecolectarDatos();
    if (!valido) return;

    let resultado;
    if (modoEdicion) {
        resultado = actualizarRegistro(idEditando, datos);
        if (resultado.exito) {
            mostrarMensaje(resultado.mensaje);
            cancelarEdicion();
            renderizarLista();
        } else {
            mostrarMensaje(resultado.mensaje, true);
        }
    } else {
        resultado = agregarRegistro(datos);
        if (resultado.exito) {
            mostrarMensaje(resultado.mensaje);
            form.reset();
            renderizarLista();
        } else {
            mostrarMensaje(resultado.mensaje, true);
        }
    }
}

function inicializarModoOscuro() {
    if (!btnModoOscuro) return;
    const root = document.documentElement;
    const actualizarTexto = () => {
        const tema = root.getAttribute('data-tema');
        btnModoOscuro.textContent = tema === 'oscuro' ? '☀️ Modo claro' : '🌙 Modo oscuro';
    };
    actualizarTexto();
    btnModoOscuro.addEventListener('click', () => {
        const nuevo = root.getAttribute('data-tema') === 'oscuro' ? 'claro' : 'oscuro';
        root.setAttribute('data-tema', nuevo);
        localStorage.setItem('tema', nuevo);
        actualizarTexto();
    });
}

// Configurar eventos del modal
function configurarModal() {
    if (!modalConfirmacion) modalConfirmacion = crearModal();
    const confirmBtn = document.getElementById('confirmarEliminar');
    const cancelBtn = document.getElementById('cancelarEliminar');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (pendingDeleteId !== null) {
                const resultado = eliminarRegistro(pendingDeleteId);
                if (resultado.exito) {
                    mostrarMensaje(resultado.mensaje);
                    renderizarLista();
                    if (modoEdicion && idEditando === pendingDeleteId) cancelarEdicion();
                } else {
                    mostrarMensaje(resultado.mensaje, true);
                }
                ocultarModal();
            }
        });
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', ocultarModal);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarDatosEjemplo();
    renderizarLista();
    inicializarModoOscuro();
    form.addEventListener('submit', manejarSubmit);
    btnCancelar.addEventListener('click', cancelarEdicion);
    configurarModal();
});