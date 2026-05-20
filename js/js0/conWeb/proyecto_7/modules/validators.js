/**
 * Validaciones para evitar caracteres extraños.
 * Se usa en animales y ciudades.
 */

// Solo permite letras (con acentos y ñ) y espacios. Nada de números ni símbolos.
export function validarTexto(texto) {
    const valor = texto.trim();
    if (valor === '') {
        return { valido: false, mensaje: '❌ No puede estar vacío.' };
    }
    // Expresión regular: letras mayúsculas/minúsculas con acentos, ñ, espacios
    const soloLetras = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/;
    if (soloLetras.test(valor)) {
        return { valido: true, normalizado: valor };
    } else {
        return { valido: false, mensaje: '❌ Solo se permiten letras y espacios. Sin números ni símbolos.' };
    }
}

// Para números: valida que sea un número y no tenga símbolos extraños
export function validarNumero(valor) {
    const numero = Number(valor);
    if (isNaN(numero)) {
        return { valido: false, mensaje: '❌ Debes ingresar un número válido.' };
    }
    return { valido: true, normalizado: numero };
}