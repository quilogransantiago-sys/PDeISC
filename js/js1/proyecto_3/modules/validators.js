export function validarNombre(nombre) { return /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]{3,}$/.test(nombre.trim()); }
export function validarEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
export function validarDNI(dni) { return /^\d{7,9}$/.test(dni); }
export function validarCantidad(cantidad, tipoCliente) {
    const num = parseInt(cantidad);
    if (isNaN(num) || num < 1) return false;
    if (tipoCliente === 'mayorista' && num < 3) return false;
    return true;
}