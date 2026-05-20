/**
 * Módulo de validaciones para el proyecto unshift().
 * 
 * Contiene funciones que verifican la entrada del usuario antes de
 * agregar elementos a los arrays. Cada función retorna un objeto estandarizado
 * con las propiedades: valido (boolean), mensaje (string) y normalizado (string|number).
 * 
 * @module validators
 */

/**
 * Valida que el texto ingresado sea una tarea válida.
 * 
 * Reglas de validación:
 * - No puede estar vacío ni ser solo espacios en blanco.
 * - Debe tener al menos 2 caracteres (evita entradas como "a").
 * 
 * Decisión de diseño: Se usa trim() para eliminar espacios al inicio y final,
 * porque los usuarios podrían ingresar espacios sin querer.
 * 
 * @param {string} input - Texto ingresado por el usuario en el campo de tarea.
 * @returns {Object} Objeto con:
 *   - valido: boolean (true si cumple todas las reglas)
 *   - mensaje: string (texto explicativo para mostrar al usuario)
 *   - normalizado: string (el texto limpio, sin espacios extra)
 */
export function validarTarea(input) {
    const valor = input.trim(); // Elimina espacios sobrantes

    if (valor === '') {
        return {
            valido: false,
            mensaje: '❌ La tarea no puede estar vacía.',
            normalizado: ''
        };
    }

    if (valor.length < 2) {
        return {
            valido: false,
            mensaje: '⚠️ La tarea debe tener al menos 2 caracteres.',
            normalizado: ''
        };
    }

    return {
        valido: true,
        mensaje: '✅ Tarea válida.',
        normalizado: valor
    };
}

/**
 * Valida que el nombre de usuario sea apto para ser agregado al array.
 * 
 * Reglas de validación:
 * - No puede estar vacío.
 * - Solo puede contener letras (incluyendo acentos y ñ) y espacios.
 * - Longitud mínima: 2 caracteres, máxima: 30 (para evitar nombres excesivamente largos).
 * 
 * Uso de expresión regular: /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,30}$/
 * - ^...$ : asegura que toda la cadena coincida.
 * - [a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s] : letras mayúsculas/minúsculas con acentos, ñ, y espacios.
 * - {2,30} : entre 2 y 30 caracteres.
 * 
 * @param {string} input - Nombre ingresado por el usuario.
 * @returns {Object} Misma estructura que validarTarea.
 */
export function validarUsuario(input) {
    const valor = input.trim();

    if (valor === '') {
        return {
            valido: false,
            mensaje: '❌ El nombre no puede estar vacío.',
            normalizado: ''
        };
    }

    // Expresión regular que permite letras con acentos, ñ, y espacios.
    const regex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,30}$/;

    if (regex.test(valor)) {
        return {
            valido: true,
            mensaje: '✅ Nombre válido.',
            normalizado: valor
        };
    } else {
        return {
            valido: false,
            mensaje: '⚠️ Solo letras y espacios (mínimo 2 caracteres, máximo 30).',
            normalizado: ''
        };
    }
}