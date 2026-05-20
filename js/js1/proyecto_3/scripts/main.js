/**
 * main.js - Script principal que orquesta formulario, validación, almacenamiento y listado.
 * Importa módulos y maneja la interacción del usuario.
 */

import { getPeople, addPerson, deletePerson } from '/modules/storage.js';
import { validatePerson } from '/modules/validation.js';
import { renderList } from '/modules/listRenderer.js';
import { initTheme } from '/modules/themeManager.js';

// --- Elementos del DOM ---
const form = document.getElementById('person-form');
const globalMsgDiv = document.getElementById('global-message');
const cantidadHijosContainer = document.getElementById('hijos-cantidad-container');
const tieneHijosCheck = document.getElementById('tieneHijos');
const cantidadHijosInput = document.getElementById('cantidadHijos');

// --- Estado ---
let currentPeople = [];

// --- Funciones auxiliares de UI ---
function showMessage(text, type = 'success') {
    globalMsgDiv.textContent = text;
    globalMsgDiv.className = `global-message ${type}`;
    setTimeout(() => {
        globalMsgDiv.style.display = 'none';
        globalMsgDiv.className = 'global-message';
    }, 3000);
    globalMsgDiv.style.display = 'block';
}

function clearFieldErrors() {
    document.querySelectorAll('.error-msg').forEach(span => span.textContent = '');
}

function displayErrors(errors) {
    for (const [field, message] of Object.entries(errors)) {
        const errorSpan = document.querySelector(`.error-msg[data-for="${field}"]`);
        if (errorSpan) errorSpan.textContent = message;
    }
}

// Manejar visibilidad del campo cantidad de hijos
function toggleHijosField() {
    const tieneHijos = tieneHijosCheck.checked;
    cantidadHijosContainer.style.display = tieneHijos ? 'block' : 'none';
    if (!tieneHijos) {
        cantidadHijosInput.value = '';
        const errorSpan = document.querySelector(`.error-msg[data-for="cantidadHijos"]`);
        if (errorSpan) errorSpan.textContent = '';
    }
}

// Resetear formulario manualmente
function resetForm() {
    form.reset();
    toggleHijosField();
    clearFieldErrors();
    globalMsgDiv.style.display = 'none';
}

// Cargar listado actualizado
function refreshList() {
    currentPeople = getPeople();
    renderList(currentPeople, handleDeletePerson);
}

// --- Manejador de eliminación ---
function handleDeletePerson(id) {
    const success = deletePerson(id);
    if (success) {
        refreshList();
        showMessage('Persona eliminada correctamente', 'success');
    } else {
        showMessage('Error al eliminar la persona', 'error');
    }
}

// --- Manejador de envío del formulario ---
function onSubmitForm(event) {
    event.preventDefault();
    clearFieldErrors();
    globalMsgDiv.style.display = 'none';

    // Recoger datos del formulario
    const formData = new FormData(form);
    const data = {
        nombre: formData.get('nombre')?.trim() || '',
        apellido: formData.get('apellido')?.trim() || '',
        edad: formData.get('edad') || '',
        fechaNac: formData.get('fechaNac') || '',
        sexo: formData.get('sexo') || '',
        documento: formData.get('documento')?.trim() || '',
        estadoCivil: formData.get('estadoCivil') || '',
        nacionalidad: formData.get('nacionalidad')?.trim() || '',
        telefono: formData.get('telefono')?.trim() || '',
        mail: formData.get('mail')?.trim() || '',
        tieneHijos: tieneHijosCheck.checked,
        cantidadHijos: tieneHijosCheck.checked ? (formData.get('cantidadHijos') || '') : 0
    };

    // Obtener lista actual para validar duplicados
    const existing = getPeople();
    const { isValid, errors } = validatePerson(data, existing);

    if (!isValid) {
        displayErrors(errors);
        showMessage('Por favor corrija los errores en el formulario', 'error');
        return;
    }

    // Construir objeto final
    const newPerson = {
        nombre: data.nombre,
        apellido: data.apellido,
        edad: Number(data.edad),
        fechaNac: data.fechaNac,
        sexo: data.sexo,
        documento: data.documento,
        estadoCivil: data.estadoCivil,
        nacionalidad: data.nacionalidad,
        telefono: data.telefono,
        mail: data.mail.toLowerCase(), // Guardar en minúsculas para unicidad
        tieneHijos: data.tieneHijos,
        cantidadHijos: data.tieneHijos ? Number(data.cantidadHijos) : 0
    };

    // Guardar
    addPerson(newPerson);
    refreshList();
    resetForm();
    showMessage('Persona guardada exitosamente', 'success');
}

// --- Inicialización ---
function init() {
    // Tema oscuro/claro
    initTheme();

    // Configurar visibilidad inicial del campo hijos
    toggleHijosField();
    tieneHijosCheck.addEventListener('change', toggleHijosField);

    // Cargar listado inicial
    refreshList();

    // Evento submit
    form.addEventListener('submit', onSubmitForm);

    // Botón reset: limpiar mensajes y errores
    const resetBtn = form.querySelector('.btn-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetForm();
        });
    }
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}