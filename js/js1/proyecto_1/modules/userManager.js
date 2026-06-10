// modules/userManager.js
// Propósito: Gestionar el CRUD de usuarios y persistencia en localStorage.
// Módulos usados: ninguno (puro JS)
// Funciones principales: cargarUsuarios, guardarUsuario, eliminarUsuario, etc.

const STORAGE_KEY = 'listaUsuarios';

// Datos de ejemplo iniciales
const usuariosEjemplo = [
    { id: '1', nombre: 'Carlos López', email: 'carlos@mail.com', edad: 28, activo: true },
    { id: '2', nombre: 'María García', email: 'maria@mail.com', edad: 34, activo: false },
    { id: '3', nombre: 'Jorge Fernández', email: 'jorge@mail.com', edad: 45, activo: true }
];

/**
 * Obtiene la lista actual de usuarios desde localStorage.
 * Si no existe, inicializa con los datos de ejemplo.
 * @returns {Array} Lista de usuarios.
 */
export function obtenerUsuarios() {
    const datos = localStorage.getItem(STORAGE_KEY);
    if (!datos) {
        // Inicializar con ejemplo
        localStorage.setItem(STORAGE_KEY, JSON.stringify(usuariosEjemplo));
        return [...usuariosEjemplo];
    }
    return JSON.parse(datos);
}

/**
 * Guarda la lista completa de usuarios en localStorage.
 * @param {Array} usuarios - Lista actualizada.
 */
function persistirUsuarios(usuarios) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}

/**
 * Genera un ID único simple.
 * @returns {string} ID basado en timestamp + random.
 */
function generarId() {
    return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 6);
}

/**
 * Agrega un nuevo usuario a la lista.
 * @param {Object} datosUsuario - { nombre, email, edad, activo }
 * @returns {Object} El usuario creado (con id).
 */
export function agregarUsuario(datosUsuario) {
    const usuarios = obtenerUsuarios();
    const nuevoUsuario = {
        id: generarId(),
        ...datosUsuario,
        edad: Number(datosUsuario.edad)
    };
    usuarios.push(nuevoUsuario);
    persistirUsuarios(usuarios);
    return nuevoUsuario;
}

/**
 * Actualiza un usuario existente.
 * @param {string} id - ID del usuario a modificar.
 * @param {Object} datosActualizados - { nombre, email, edad, activo }
 * @returns {Object|null} Usuario actualizado o null si no existe.
 */
export function actualizarUsuario(id, datosActualizados) {
    const usuarios = obtenerUsuarios();
    const indice = usuarios.findIndex(u => u.id === id);
    if (indice === -1) return null;

    const actualizado = {
        ...usuarios[indice],
        ...datosActualizados,
        edad: Number(datosActualizados.edad)
    };
    usuarios[indice] = actualizado;
    persistirUsuarios(usuarios);
    return actualizado;
}

/**
 * Elimina un usuario por su ID.
 * @param {string} id 
 * @returns {boolean} true si se eliminó, false si no existía.
 */
export function eliminarUsuario(id) {
    let usuarios = obtenerUsuarios();
    const nuevaLista = usuarios.filter(u => u.id !== id);
    if (nuevaLista.length === usuarios.length) return false;
    persistirUsuarios(nuevaLista);
    return true;
}

/**
 * Obtiene un usuario específico por ID.
 * @param {string} id 
 * @returns {Object|undefined}
 */
export function obtenerUsuarioPorId(id) {
    const usuarios = obtenerUsuarios();
    return usuarios.find(u => u.id === id);
}