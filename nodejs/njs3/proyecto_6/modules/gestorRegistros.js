/**
 * gestorRegistros.js
 * Módulo para gestionar el ABM de registros con persistencia en localStorage.
 * Incluye validaciones de campos: nombre (solo letras), email, edad, género, país.
 * Funciones exportadas: obtenerRegistros, agregarRegistro, actualizarRegistro,
 *                       eliminarRegistro, obtenerRegistroPorId, inicializarDatosEjemplo.
 */

const STORAGE_KEY = 'registros_abm';
let nextId = 1;

/**
 * Carga los registros desde localStorage.
 * @returns {Array} Lista de registros.
 */
function cargarRegistros() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        const registros = JSON.parse(stored);
        if (registros.length > 0) {
            nextId = Math.max(...registros.map(r => r.id)) + 1;
        }
        return registros;
    }
    return [];
}

/**
 * Guarda los registros en localStorage.
 * @param {Array} registros - Lista de registros a guardar.
 */
function guardarRegistros(registros) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
}

/**
 * Obtiene todos los registros.
 * @returns {Array} Copia de los registros almacenados.
 */
export function obtenerRegistros() {
    return cargarRegistros();
}

/**
 * Valida y agrega un nuevo registro.
 * @param {Object} datos - { nombreCompleto, email, edad, genero, pais, intereses }
 * @returns {Object} { exito: boolean, mensaje: string, id?: number }
 */
export function agregarRegistro(datos) {
    const nombreRegex = /^[a-zA-ZáéíóúñÑüÜ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validación nombre
    if (!datos.nombreCompleto || datos.nombreCompleto.trim() === '') {
        return { exito: false, mensaje: 'El nombre es obligatorio.' };
    }
    if (!nombreRegex.test(datos.nombreCompleto.trim())) {
        return { exito: false, mensaje: 'El nombre solo puede contener letras y espacios (sin números ni símbolos).' };
    }

    // Validación email
    if (!datos.email || !emailRegex.test(datos.email.trim())) {
        return { exito: false, mensaje: 'Email inválido. Debe tener formato usuario@dominio.com.' };
    }

    // Validación edad
    if (datos.edad === undefined || datos.edad === null || datos.edad === '') {
        return { exito: false, mensaje: 'La edad es obligatoria.' };
    }
    const edadNum = Number(datos.edad);
    if (isNaN(edadNum) || edadNum < 0 || edadNum > 120) {
        return { exito: false, mensaje: 'Edad debe ser un número entre 0 y 120.' };
    }

    // Validación género
    if (!datos.genero) {
        return { exito: false, mensaje: 'Debe seleccionar un género.' };
    }

    // Validación país
    if (!datos.pais) {
        return { exito: false, mensaje: 'Debe seleccionar un país.' };
    }

    // Intereses opcional (si no se envía, array vacío)
    const intereses = Array.isArray(datos.intereses) ? datos.intereses : [];

    const registros = cargarRegistros();
    const nuevo = {
        id: nextId++,
        nombreCompleto: datos.nombreCompleto.trim(),
        email: datos.email.trim(),
        edad: edadNum,
        genero: datos.genero,
        pais: datos.pais,
        intereses: intereses
    };
    registros.push(nuevo);
    guardarRegistros(registros);
    return { exito: true, mensaje: 'Registro agregado correctamente.', id: nuevo.id };
}

/**
 * Actualiza un registro existente.
 * @param {number} id - Identificador del registro.
 * @param {Object} datos - mismos campos que en agregar.
 * @returns {Object} { exito: boolean, mensaje: string }
 */
export function actualizarRegistro(id, datos) {
    const nombreRegex = /^[a-zA-ZáéíóúñÑüÜ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const registros = cargarRegistros();
    const index = registros.findIndex(r => r.id === id);
    if (index === -1) {
        return { exito: false, mensaje: 'Registro no encontrado.' };
    }

    // Validaciones igual que en agregar
    if (!datos.nombreCompleto || datos.nombreCompleto.trim() === '') {
        return { exito: false, mensaje: 'El nombre es obligatorio.' };
    }
    if (!nombreRegex.test(datos.nombreCompleto.trim())) {
        return { exito: false, mensaje: 'El nombre solo puede contener letras y espacios.' };
    }
    if (!datos.email || !emailRegex.test(datos.email.trim())) {
        return { exito: false, mensaje: 'Email inválido.' };
    }
    if (datos.edad === undefined || datos.edad === null || datos.edad === '') {
        return { exito: false, mensaje: 'La edad es obligatoria.' };
    }
    const edadNum = Number(datos.edad);
    if (isNaN(edadNum) || edadNum < 0 || edadNum > 120) {
        return { exito: false, mensaje: 'Edad debe ser entre 0 y 120.' };
    }
    if (!datos.genero) {
        return { exito: false, mensaje: 'Debe seleccionar un género.' };
    }
    if (!datos.pais) {
        return { exito: false, mensaje: 'Debe seleccionar un país.' };
    }

    const intereses = Array.isArray(datos.intereses) ? datos.intereses : [];

    registros[index] = {
        id: id,
        nombreCompleto: datos.nombreCompleto.trim(),
        email: datos.email.trim(),
        edad: edadNum,
        genero: datos.genero,
        pais: datos.pais,
        intereses: intereses
    };
    guardarRegistros(registros);
    return { exito: true, mensaje: 'Registro actualizado correctamente.' };
}

/**
 * Elimina un registro por su ID.
 * @param {number} id
 * @returns {Object} { exito: boolean, mensaje: string }
 */
export function eliminarRegistro(id) {
    const registros = cargarRegistros();
    const index = registros.findIndex(r => r.id === id);
    if (index === -1) {
        return { exito: false, mensaje: 'Registro no encontrado.' };
    }
    registros.splice(index, 1);
    guardarRegistros(registros);
    return { exito: true, mensaje: 'Registro eliminado.' };
}

/**
 * Obtiene un registro por su ID.
 * @param {number} id
 * @returns {Object|undefined} Registro encontrado o undefined.
 */
export function obtenerRegistroPorId(id) {
    const registros = cargarRegistros();
    return registros.find(r => r.id === id);
}

/**
 * Inicializa datos de ejemplo si localStorage está vacío.
 */
export function inicializarDatosEjemplo() {
    const registros = cargarRegistros();
    if (registros.length === 0) {
        agregarRegistro({
            nombreCompleto: 'Ana García',
            email: 'ana@ejemplo.com',
            edad: 28,
            genero: 'femenino',
            pais: 'Argentina',
            intereses: ['cultura', 'tecnologia']
        });
        agregarRegistro({
            nombreCompleto: 'Carlos López',
            email: 'carlos@ejemplo.com',
            edad: 34,
            genero: 'masculino',
            pais: 'Chile',
            intereses: ['deporte']
        });
    }
}