// Validaciones de texto y números

export function validarTexto(texto) {
    const valor = texto.trim();
    if (valor === '') {
        return { valido: false, mensaje: '❌ No puede estar vacío.' };
    }
    const soloLetras = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/;
    if (soloLetras.test(valor)) {
        return { valido: true, normalizado: valor };
    } else {
        return { valido: false, mensaje: '❌ Solo letras y espacios (sin números ni símbolos).' };
    }
}

export function validarNumero(valor) {
    const numero = Number(valor);
    if (isNaN(numero)) {
        return { valido: false, mensaje: '❌ Ingresa un número válido.' };
    }
    return { valido: true, normalizado: numero };
}

export function validarEdad(valor) {
    const edad = Number(valor);
    if (isNaN(edad) || edad <= 0 || edad > 120) {
        return { valido: false, mensaje: '❌ Edad inválida (debe ser entre 1 y 120).' };
    }
    return { valido: true, normalizado: edad };
}