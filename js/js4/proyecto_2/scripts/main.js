/**
 * main.js - Orquesta ABM local, envío a API con fetch/axios, validaciones personalizadas.
 * - Al enviar el formulario (sin edición), hace POST a /api/users con el método seleccionado.
 * - Muestra el ID devuelto por la API.
 * - Luego agrega el usuario al listado local (storage) si no está duplicado.
 * - Editar y eliminar afectan solo al listado local.
 * - Validaciones de nombre (letras/espacios) y email (formato) con mensajes debajo del campo.
 * - No se permiten emails duplicados (case insensitive).
 */
import { getUsers, addUser, updateUser, deleteUser, getUserById } from '../modules/storage.js';
import { loadTheme, toggleTheme } from '../modules/themeManager.js';
import axios from 'axios';

// ============================================================
// 1. Cargar tema guardado
// ============================================================
loadTheme();

// ============================================================
// 2. Referencias al DOM
// ============================================================
const form = document.getElementById('userForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const editIdInput = document.getElementById('editId');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const resultado = document.getElementById('resultado');
const userListDiv = document.getElementById('userList');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');

// Modal
const modal = document.getElementById('modalConfirm');
const modalMensaje = document.getElementById('modalMensaje');
const modalSi = document.getElementById('modalSi');
const modalNo = document.getElementById('modalNo');
let pendingDeleteId = null;

// ============================================================
// 3. Funciones de validación y mensajes de error
// ============================================================

/** Limpia los mensajes de error de los campos */
function limpiarErrores() {
    nameError.textContent = '';
    nameError.classList.remove('visible');
    nameInput.classList.remove('error');
    emailError.textContent = '';
    emailError.classList.remove('visible');
    emailInput.classList.remove('error');
}

/** Muestra un mensaje de error debajo de un campo específico */
function mostrarError(campo, mensaje) {
    if (campo === 'name') {
        nameError.textContent = mensaje;
        nameError.classList.add('visible');
        nameInput.classList.add('error');
    } else if (campo === 'email') {
        emailError.textContent = mensaje;
        emailError.classList.add('visible');
        emailInput.classList.add('error');
    }
}

/** Valida nombre y email, devuelve objeto con datos o null si hay error */
function validarFormulario() {
    limpiarErrores();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    let valido = true;

    if (!name) {
        mostrarError('name', 'El nombre es obligatorio');
        valido = false;
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(name)) {
        mostrarError('name', 'Solo letras y espacios');
        valido = false;
    }

    if (!email) {
        mostrarError('email', 'El correo es obligatorio');
        valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarError('email', 'Formato inválido (ej: usuario@dominio.com)');
        valido = false;
    }

    return valido ? { name, email } : null;
}

/** Verifica si un email ya existe en el listado local (case insensitive) */
function existeEmail(email, excludeId = null) {
    const users = getUsers();
    const emailLower = email.toLowerCase().trim();
    return users.some(u =>
        u.email.toLowerCase().trim() === emailLower &&
        (excludeId === null || u.id !== excludeId)
    );
}

/** Muestra un mensaje en el bloque de resultado general */
function mostrarResultado(msg, exito = true) {
    resultado.textContent = msg;
    resultado.className = 'resultado ' + (exito ? 'exito' : 'error');
}

// ============================================================
// 4. Renderizado del listado local
// ============================================================

function renderUserList() {
    const users = getUsers();
    if (!users.length) {
        userListDiv.innerHTML = '<p>No hay usuarios.</p>';
        return;
    }
    userListDiv.innerHTML = users.map(u => `
    <div class="user-card" data-id="${u.id}">
      <div class="info">
        <h3>${u.name}</h3>
        <p>${u.email}</p>
      </div>
      <div class="acciones-card">
        <button class="btn-editar" data-id="${u.id}">Editar</button>
        <button class="btn-eliminar" data-id="${u.id}">Eliminar</button>
      </div>
    </div>
  `).join('');

    // Asignar eventos a botones
    document.querySelectorAll('.btn-editar').forEach(b =>
        b.addEventListener('click', () => cargarParaEditar(+b.dataset.id))
    );
    document.querySelectorAll('.btn-eliminar').forEach(b =>
        b.addEventListener('click', () => confirmarEliminar(+b.dataset.id))
    );
}

// ============================================================
// 5. CRUD local (con validación de duplicados)
// ============================================================

function agregarUsuarioLocal(name, email) {
    if (existeEmail(email)) {
        mostrarError('email', 'Ya existe un usuario con ese correo');
        return null;
    }
    const newId = addUser({ name, email });
    renderUserList();
    mostrarResultado(`Usuario agregado localmente con ID ${newId}`, true);
    return newId;
}

function cargarParaEditar(id) {
    const user = getUserById(id);
    if (!user) {
        mostrarResultado('No encontrado', false);
        return;
    }
    nameInput.value = user.name;
    emailInput.value = user.email;
    editIdInput.value = user.id;
    submitBtn.textContent = 'Actualizar local';
    cancelBtn.style.display = 'inline-block';
    limpiarErrores();
    nameInput.focus();
}

function actualizarUsuarioLocal(id, name, email) {
    if (existeEmail(email, id)) {
        mostrarError('email', 'Ya existe otro usuario con ese correo');
        return;
    }
    try {
        updateUser(id, { name, email });
        renderUserList();
        mostrarResultado(`Usuario ID ${id} actualizado localmente`, true);
        resetForm();
    } catch (e) {
        mostrarResultado(`Error: ${e.message}`, false);
    }
}

function eliminarUsuarioLocal(id) {
    try {
        deleteUser(id);
        renderUserList();
        mostrarResultado(`Usuario ID ${id} eliminado`, true);
    } catch (e) {
        mostrarResultado(`Error: ${e.message}`, false);
    }
}

function resetForm() {
    form.reset();
    editIdInput.value = '';
    submitBtn.textContent = 'Enviar a API';
    cancelBtn.style.display = 'none';
    limpiarErrores();
    setTimeout(() => {
        if (!resultado.textContent.includes('Error')) {
            resultado.textContent = 'Listo';
            resultado.className = 'resultado';
        }
    }, 4000);
}

// ============================================================
// 6. Modal de confirmación (reemplaza confirm)
// ============================================================

function confirmarEliminar(id) {
    pendingDeleteId = id;
    const user = getUserById(id);
    modalMensaje.textContent = `¿Eliminar a "${user?.name || 'usuario'}"?`;
    modal.style.display = 'flex';
}

modalSi.addEventListener('click', () => {
    if (pendingDeleteId !== null) {
        eliminarUsuarioLocal(pendingDeleteId);
        pendingDeleteId = null;
    }
    modal.style.display = 'none';
});

modalNo.addEventListener('click', () => {
    pendingDeleteId = null;
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        pendingDeleteId = null;
    }
});

// ============================================================
// 7. Envío a API propia (fetch / axios)
// ============================================================

function getMetodoSeleccionado() {
    const radio = document.querySelector('input[name="metodo"]:checked');
    return radio ? radio.value : 'fetch';
}

async function enviarUsuarioAPI(name, email) {
    const metodo = getMetodoSeleccionado();
    const url = '/api/users';
    const data = { name, email };

    try {
        let response;
        if (metodo === 'fetch') {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || `HTTP ${res.status}`);
            }
            response = await res.json();
        } else {
            const res = await axios.post(url, data);
            response = res.data;
        }
        return { success: true, id: response.id, metodo };
    } catch (error) {
        return { success: false, error: error.message, metodo };
    }
}

// ============================================================
// 8. Evento submit del formulario
// ============================================================

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    limpiarErrores();

    const data = validarFormulario();
    if (!data) return;

    const { name, email } = data;
    const editId = editIdInput.value;

    // Si estamos en modo edición
    if (editId) {
        actualizarUsuarioLocal(+editId, name, email);
        return;
    }

    // Alta: validar duplicado antes de enviar
    if (existeEmail(email)) {
        mostrarError('email', 'Ya existe un usuario con ese correo en el listado local');
        return;
    }

    // Enviar a API
    mostrarResultado(`Enviando con ${getMetodoSeleccionado().toUpperCase()}...`);

    const result = await enviarUsuarioAPI(name, email);

    if (result.success) {
        mostrarResultado(`Usuario creado con ID ${result.id} (vía ${result.metodo.toUpperCase()})`, true);
        // Agregar localmente (ya validado)
        const newId = addUser({ name, email });
        renderUserList();
        resetForm();
    } else {
        mostrarResultado(`Error con ${result.metodo.toUpperCase()}: ${result.error}`, false);
    }
});

// ============================================================
// 9. Eventos adicionales
// ============================================================

cancelBtn.addEventListener('click', resetForm);

document.getElementById('themeToggle').addEventListener('click', toggleTheme);

// ============================================================
// 10. Inicialización
// ============================================================

renderUserList();