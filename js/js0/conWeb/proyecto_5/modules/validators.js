/**
 * Validación simple: solo letras, espacios, y mínimo 2 caracteres.
 * Esto evita números y símbolos raros.
 */
export function validarNombre(input) {
    const valor = input.trim();
    if (valor === '') {
        return { valido: false, mensaje: '❌ Escribe un nombre válido.' };
    }
    // Solo letras (con acentos incluidos) y espacios
    const soloLetras = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,30}$/;
    if (soloLetras.test(valor)) {
        return { valido: true, mensaje: '✅ Nombre correcto.', normalizado: valor };
    } else {
        return { valido: false, mensaje: '❌ Solo letras y espacios. Sin números ni símbolos.' };
    }
}