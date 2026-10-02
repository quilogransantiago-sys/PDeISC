// validaciones: funciones de validación reutilizables.
// Propósito: centralizar las reglas de validación (por ejemplo, de contraseñas).

// Valida que la contraseña cumpla los requisitos:
//  - mínimo 8 caracteres
//  - al menos una letra minúscula
//  - al menos una letra mayúscula
//  - al menos un número
//  - al menos un carácter especial (no letra ni número ni espacio)
export function validarContrasena(contrasena) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    return regex.test(contrasena);
}

// Mensaje explicativo de los requisitos (para mostrar en la API/frontend).
export const MENSAJE_CONTRASENA =
    "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
