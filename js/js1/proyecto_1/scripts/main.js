// ==============================
// main.js
// Orquesta los tres métodos de lectura, validaciones y tema.
// Incluye soporte para "Otro/s" en intereses.
// ==============================

import UserManager from '/modules/userManager.js';

// Instancia del gestor
const userManager = new UserManager();

// Elementos del DOM
const form = document.getElementById('user-form');
const resultArea = document.getElementById('result-area');
const usersListDiv = document.getElementById('users-list');
const themeToggle = document.getElementById('theme-toggle');

// Referencias a campos para validación en tiempo real
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const ageInput = document.getElementById('age');
const countrySelect = document.getElementById('country');
const interestCheckboxes = document.querySelectorAll('input[name="interests"]');

// Elementos para "Otro/s"
const otherCheckbox = document.getElementById('otherCheckbox');
const otherText = document.getElementById('otherText');

// ==============================
// FUNCIONES AUXILIARES
// ==============================

function actualizarListaUsuarios() {
    usersListDiv.innerHTML = userManager.renderizarUsuarios();
}

function mostrarResultado(mensaje, esError = false) {
    resultArea.textContent = mensaje;
    resultArea.style.borderLeftColor = esError ? '#ef4444' : 'var(--accent)';
}

// ==============================
// VALIDACIONES INDIVIDUALES
// ==============================

function validarNombre(nombre) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
    return regex.test(nombre.trim());
}

function validarEdad(edad) {
    if (!edad) return true; // opcional
    const num = parseInt(edad, 10);
    return !isNaN(num) && num >= 1 && num <= 120;
}

// Validación de intereses incluyendo "Otro/s"
function validarIntereses() {
    const checkboxesNormales = Array.from(interestCheckboxes).some(cb => cb.checked);
    const hayOtroConTexto = otherCheckbox.checked && otherText.value.trim() !== '';

    if (!checkboxesNormales && !hayOtroConTexto) {
        return false;
    }
    if (otherCheckbox.checked && otherText.value.trim() === '') {
        return false;
    }
    return true;
}

// Obtiene la lista completa de intereses (normales + texto de "Otro/s")
// Devuelve objeto { intereses: array, error: string | null }
function obtenerInteresesCompletos() {
    const checkboxesNormales = Array.from(interestCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    if (otherCheckbox.checked && otherText.value.trim() !== '') {
        checkboxesNormales.push(`Otros: ${otherText.value.trim()}`);
    } else if (otherCheckbox.checked && otherText.value.trim() === '') {
        return { intereses: [], error: 'Por favor, escribe el interés en "Otro/s".' };
    }
    return { intereses: checkboxesNormales, error: null };
}

// ==============================
// VALIDACIÓN COMPLETA DEL FORMULARIO
// ==============================

function validarFormularioCompleto(datos) {
    const errores = {};

    if (!datos.fullName || !validarNombre(datos.fullName)) {
        errores.nombre = 'Nombre debe contener solo letras y espacios (2-50 caracteres).';
    }

    if (!datos.email || !/^\S+@\S+\.\S+$/.test(datos.email)) {
        errores.email = 'Correo electrónico inválido.';
    } else if (userManager.emailExiste(datos.email)) {
        errores.email = 'Este correo ya está registrado.';
    }

    if (datos.age && !validarEdad(datos.age)) {
        errores.edad = 'Edad debe ser un número entre 1 y 120.';
    }

    if (!validarIntereses()) {
        errores.intereses = 'Debe seleccionar al menos un interés o llenar "Otro/s".';
    }

    if (!datos.country) {
        errores.pais = 'Seleccione un país.';
    }

    return errores;
}

// ==============================
// MANEJO DE ERRORES EN UI
// ==============================

function mostrarErroresEnFormulario(errores) {
    document.getElementById('name-error').textContent = errores.nombre || '';
    document.getElementById('email-error').textContent = errores.email || '';
    document.getElementById('age-error').textContent = errores.edad || '';
    document.getElementById('interests-error').textContent = errores.intereses || '';
    document.getElementById('country-error').textContent = errores.pais || '';
}

function limpiarErroresFormulario() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

// ==============================
// PROCESAR Y AGREGAR USUARIO
// ==============================

function procesarYAgregarUsuario(datos, metodoNombre) {
    limpiarErroresFormulario();
    const errores = validarFormularioCompleto(datos);

    if (Object.keys(errores).length > 0) {
        mostrarErroresEnFormulario(errores);
        mostrarResultado(`[${metodoNombre}] Error de validación: No se pudo registrar el usuario. Revise los campos.`, true);
        return false;
    }

    const resultado = userManager.agregarUsuario(datos);
    if (resultado.success) {
        mostrarResultado(`[${metodoNombre}] Usuario registrado con éxito: ${datos.fullName} (${datos.email})`);
        actualizarListaUsuarios();
        form.reset();
        // Reiniciar campo "Otro/s"
        otherCheckbox.checked = false;
        otherText.value = '';
        otherText.disabled = true;
        limpiarErroresFormulario();
        return true;
    } else {
        mostrarResultado(`[${metodoNombre}] Error: ${resultado.error}`, true);
        if (resultado.error.includes('correo')) {
            document.getElementById('email-error').textContent = resultado.error;
        }
        return false;
    }
}

// ==============================
// TRES MÉTODOS DE LECTURA (con soporte para "Otro/s")
// ==============================

// 1. form.elements
function leerConFormElements() {
    const elements = form.elements;
    let fullName = '', email = '', age = '', country = '';
    const interesesNormales = [];

    for (let i = 0; i < elements.length; i++) {
        const field = elements[i];
        if (field.type === 'button' || field.type === 'reset') continue;
        switch (field.name) {
            case 'fullName': fullName = field.value; break;
            case 'email': email = field.value; break;
            case 'age': age = field.value; break;
            case 'country': country = field.value; break;
            case 'interests':
                if (field.checked) interesesNormales.push(field.value);
                break;
        }
    }

    // Obtener intereses completos (incluye "Otro/s")
    const otros = obtenerInteresesCompletos();
    if (otros.error) {
        mostrarResultado(`[form.elements] Error: ${otros.error}`, true);
        document.getElementById('interests-error').textContent = otros.error;
        return;
    }

    const intereses = [...interesesNormales, ...(otros.intereses.filter(i => i.startsWith('Otros:')))];
    const datos = { fullName, email, age, country, interests: intereses };
    mostrarResultado(`[form.elements] Datos capturados:\n${JSON.stringify(datos, null, 2)}`);
    procesarYAgregarUsuario(datos, 'form.elements');
}

// 2. FormData
function leerConFormData() {
    const formData = new FormData(form);
    const interesesNormales = formData.getAll('interests');

    const otros = obtenerInteresesCompletos();
    if (otros.error) {
        mostrarResultado(`[FormData] Error: ${otros.error}`, true);
        document.getElementById('interests-error').textContent = otros.error;
        return;
    }

    const intereses = [...interesesNormales, ...(otros.intereses.filter(i => i.startsWith('Otros:')))];
    const datos = {
        fullName: formData.get('fullName') || '',
        email: formData.get('email') || '',
        age: formData.get('age') || '',
        country: formData.get('country') || '',
        interests: intereses
    };
    mostrarResultado(`[FormData] Datos capturados:\n${JSON.stringify(datos, null, 2)}`);
    procesarYAgregarUsuario(datos, 'FormData');
}

// 3. querySelector
function leerConQuerySelector() {
    const fullName = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const age = document.querySelector('#age').value;
    const country = document.querySelector('#country').value;
    const interesesNormales = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
        .map(cb => cb.value);

    const otros = obtenerInteresesCompletos();
    if (otros.error) {
        mostrarResultado(`[querySelector] Error: ${otros.error}`, true);
        document.getElementById('interests-error').textContent = otros.error;
        return;
    }

    const intereses = [...interesesNormales, ...(otros.intereses.filter(i => i.startsWith('Otros:')))];
    const datos = { fullName, email, age, country, interests: intereses };
    mostrarResultado(`[querySelector] Datos capturados:\n${JSON.stringify(datos, null, 2)}`);
    procesarYAgregarUsuario(datos, 'querySelector');
}

// ==============================
// TEMA CLARO / OSCURO
// ==============================

function aplicarTema() {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark';
    if (isDark) {
        document.documentElement.classList.add('dark-theme');
        themeToggle.textContent = 'Modo claro';
    } else {
        document.documentElement.classList.remove('dark-theme');
        themeToggle.textContent = 'Modo oscuro';
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark-theme');
    if (isDark) {
        document.documentElement.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = 'Modo oscuro';
    } else {
        document.documentElement.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = 'Modo claro';
    }
}

// ==============================
// EVENTOS E INICIALIZACIÓN
// ==============================

document.addEventListener('DOMContentLoaded', () => {
    // Botones de lectura
    document.getElementById('btn-elements').addEventListener('click', leerConFormElements);
    document.getElementById('btn-formdata').addEventListener('click', leerConFormData);
    document.getElementById('btn-query').addEventListener('click', leerConQuerySelector);

    // Tema
    themeToggle.addEventListener('click', toggleTheme);
    aplicarTema();
    actualizarListaUsuarios();

    // Manejo del campo "Otro/s": habilitar/deshabilitar input y limpiar error
    if (otherCheckbox && otherText) {
        otherCheckbox.addEventListener('change', () => {
            otherText.disabled = !otherCheckbox.checked;
            if (!otherCheckbox.checked) {
                otherText.value = '';
            }
            // Limpiar error de intereses cuando el usuario interactúa
            document.getElementById('interests-error').textContent = '';
        });
    }

    // Validación en tiempo real para feedback inmediato
    nameInput.addEventListener('input', () => {
        const err = document.getElementById('name-error');
        if (nameInput.value && !validarNombre(nameInput.value)) {
            err.textContent = 'Solo letras y espacios.';
        } else {
            err.textContent = '';
        }
    });

    emailInput.addEventListener('blur', () => {
        const errSpan = document.getElementById('email-error');
        if (emailInput.value && userManager.emailExiste(emailInput.value)) {
            errSpan.textContent = 'Este correo ya está registrado.';
        } else if (emailInput.value && !/^\S+@\S+\.\S+$/.test(emailInput.value)) {
            errSpan.textContent = 'Formato de correo inválido.';
        } else {
            errSpan.textContent = '';
        }
    });

    // Limpiar error de intereses cuando se cambie algún checkbox o el texto de "Otro/s"
    const allInterestInputs = [...interestCheckboxes, otherCheckbox, otherText];
    allInterestInputs.forEach(input => {
        if (input) {
            input.addEventListener('change', () => {
                document.getElementById('interests-error').textContent = '';
            });
            if (input === otherText) {
                input.addEventListener('input', () => {
                    document.getElementById('interests-error').textContent = '';
                });
            }
        }
    });
});