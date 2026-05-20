/**
 * validation.js - Valida los campos del formulario.
 * Incluye: campos obligatorios, formato, duplicado de documento,
 *          duplicado de email (case-insensitive) y coherencia edad-fechaNac.
 */

/**
 * Calcula la edad a partir de una fecha de nacimiento.
 * @param {string} fechaNac - Fecha en formato YYYY-MM-DD.
 * @returns {number|null} Edad calculada o null si fecha inválida.
 */
function calcularEdadDesdeFecha(fechaNac) {
    if (!fechaNac) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNac);
    if (isNaN(nacimiento.getTime())) return null;
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesDiff = hoy.getMonth() - nacimiento.getMonth();
    if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

/**
 * Valida una persona completa.
 * @param {Object} data - Datos del formulario.
 * @param {Array} existingPeople - Lista de personas ya almacenadas (para duplicados).
 * @param {number|null} excludeId - ID de persona a excluir (para edición, aquí no se usa pero se deja para extensibilidad).
 * @returns {Object} { isValid: boolean, errors: object }
 */
export function validatePerson(data, existingPeople, excludeId = null) {
    const errors = {};

    // --- Validaciones existentes (se mantienen igual, solo añadimos las nuevas) ---
    // Nombre
    if (!data.nombre || data.nombre.trim().length < 2) {
        errors.nombre = 'Nombre debe tener al menos 2 caracteres.';
    } else if (!/^[a-zA-ZáéíóúñÑ\s]+$/.test(data.nombre)) {
        errors.nombre = 'Solo letras y espacios.';
    }

    // Apellido
    if (!data.apellido || data.apellido.trim().length < 2) {
        errors.apellido = 'Apellido debe tener al menos 2 caracteres.';
    } else if (!/^[a-zA-ZáéíóúñÑ\s]+$/.test(data.apellido)) {
        errors.apellido = 'Solo letras y espacios.';
    }

    // Edad (se validará después contra fecha de nacimiento)
    const edadIngresada = Number(data.edad);
    if (isNaN(edadIngresada) || edadIngresada <= 0 || edadIngresada > 120) {
        errors.edad = 'Edad debe ser un número entre 1 y 120.';
    }

    // Fecha de nacimiento
    let edadCalculada = null;
    if (!data.fechaNac) {
        errors.fechaNac = 'Seleccione fecha de nacimiento.';
    } else {
        const fecha = new Date(data.fechaNac);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fecha >= hoy) {
            errors.fechaNac = 'La fecha debe ser anterior a hoy.';
        } else {
            edadCalculada = calcularEdadDesdeFecha(data.fechaNac);
            if (edadCalculada === null) {
                errors.fechaNac = 'Fecha de nacimiento inválida.';
            }
        }
    }

    // Validar coherencia: edad ingresada vs edad calculada
    if (!errors.edad && !errors.fechaNac && edadCalculada !== null) {
        if (edadIngresada !== edadCalculada) {
            errors.edad = `La edad ingresada (${edadIngresada}) no coincide con la fecha de nacimiento (edad calculada: ${edadCalculada}).`;
            errors.fechaNac = errors.edad; // opcional: mostrar también en fecha
        }
    }

    // Sexo
    if (!data.sexo) {
        errors.sexo = 'Seleccione sexo.';
    }

    // Documento (único)
    const doc = data.documento?.trim();
    if (!doc) {
        errors.documento = 'Documento es obligatorio.';
    } else if (!/^\d{6,12}$/.test(doc)) {
        errors.documento = 'Documento debe tener entre 6 y 12 dígitos numéricos.';
    } else {
        const duplicado = existingPeople.some(p => p.documento === doc && (excludeId === null || p.id !== excludeId));
        if (duplicado) {
            errors.documento = 'Este documento ya está registrado.';
        }
    }

    // Estado civil
    if (!data.estadoCivil) {
        errors.estadoCivil = 'Seleccione estado civil.';
    }

    // Nacionalidad
    if (!data.nacionalidad || data.nacionalidad.trim().length < 3) {
        errors.nacionalidad = 'Nacionalidad debe tener al menos 3 caracteres.';
    }

    // Teléfono
    const tel = data.telefono?.trim();
    if (!tel) {
        errors.telefono = 'Teléfono es obligatorio.';
    } else if (!/^\d{7,15}$/.test(tel)) {
        errors.telefono = 'Teléfono debe tener entre 7 y 15 dígitos.';
    }

    // Email (NUEVO: validar formato y unicidad)
    const email = data.mail?.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.mail = 'Correo electrónico es obligatorio.';
    } else if (!emailRegex.test(email)) {
        errors.mail = 'Formato de correo inválido.';
    } else {
        const emailDuplicado = existingPeople.some(p =>
            p.mail?.toLowerCase() === email && (excludeId === null || p.id !== excludeId)
        );
        if (emailDuplicado) {
            errors.mail = 'Este correo electrónico ya está registrado.';
        }
    }

    // Hijos
    const tieneHijos = data.tieneHijos === 'on' || data.tieneHijos === true;
    if (tieneHijos) {
        const cant = Number(data.cantidadHijos);
        if (isNaN(cant) || !Number.isInteger(cant) || cant < 1) {
            errors.cantidadHijos = 'Debe indicar cantidad de hijos (mínimo 1).';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}