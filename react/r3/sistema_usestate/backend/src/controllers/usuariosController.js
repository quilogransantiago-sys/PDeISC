// usuariosController: CRUD de usuarios con control de roles.
// Dependencias: bcryptjs, pool (database), sanitizar, validaciones.
import bcrypt from "bcryptjs";
import { pool } from "../database.js";
import { sanitizarTexto } from "../utilidades/sanitizar.js";
import { validarContrasena, MENSAJE_CONTRASENA } from "../utilidades/validaciones.js";

// Helper: un usuario normal solo opera sobre su propio id; el admin sobre cualquiera.
function puedeOperar(req, idObjetivo) {
    if (req.rolUsuario === "admin") return true;
    return Number(idObjetivo) === Number(req.idUsuario);
}

// Lista todos los usuarios (incluye rol).
export async function listar(req, res) {
    try {
        const [filas] = await pool.execute(
            "SELECT id, nombre, email, rol, fecha_creacion FROM usuarios ORDER BY id ASC"
        );
        res.json(filas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener los usuarios." });
    }
}

// Obtiene un usuario por id (con control de permiso).
export async function obtenerPorId(req, res) {
    const { id } = req.params;
    if (!puedeOperar(req, id)) {
        return res.status(403).json({ mensaje: "No tenés permiso para ver este usuario." });
    }
    try {
        const [filas] = await pool.execute(
            "SELECT id, nombre, email, rol, fecha_creacion FROM usuarios WHERE id = ?",
            [id]
        );
        if (filas.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado." });
        }
        res.json(filas[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener el usuario." });
    }
}

// Crea un usuario (solo admin).
export async function crear(req, res) {
    if (req.rolUsuario !== "admin") {
        return res.status(403).json({ mensaje: "Solo un administrador puede crear usuarios." });
    }
    const { nombre, email, contrasena } = req.body;
    if (!nombre || !email || !contrasena) {
        return res.status(400).json({ mensaje: "Nombre, email y contraseña son obligatorios." });
    }
    const nombreLimpio = sanitizarTexto(nombre);
    const emailLimpio = sanitizarTexto(email).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)) {
        return res.status(400).json({ mensaje: "El email no tiene un formato válido." });
    }
    if (!validarContrasena(contrasena)) {
        return res.status(400).json({ mensaje: MENSAJE_CONTRASENA });
    }
    try {
        const hash = await bcrypt.hash(contrasena, 10);
        const [resultado] = await pool.execute(
            "INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES (?, ?, ?, 'usuario')",
            [nombreLimpio, emailLimpio, hash]
        );
        res.status(201).json({ mensaje: "Usuario creado.", id: resultado.insertId });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ mensaje: "Ya existe un usuario con ese email." });
        }
        console.error(error);
        res.status(500).json({ mensaje: "Error al crear el usuario." });
    }
}

// Actualiza un usuario (con control de permiso y validación de contraseña).
export async function actualizar(req, res) {
    const { id } = req.params;
    if (!puedeOperar(req, id)) {
        return res.status(403).json({ mensaje: "No tenés permiso para editar este usuario." });
    }
    const { nombre, email, contrasena } = req.body;
    const nombreLimpio = nombre ? sanitizarTexto(nombre) : undefined;
    const emailLimpio = email ? sanitizarTexto(email).toLowerCase() : undefined;
    try {
        if (contrasena) {
            if (!validarContrasena(contrasena)) {
                return res.status(400).json({ mensaje: MENSAJE_CONTRASENA });
            }
            const hash = await bcrypt.hash(contrasena, 10);
            const [resultado] = await pool.execute(
                "UPDATE usuarios SET nombre = ?, email = ?, contrasena = ? WHERE id = ?",
                [nombreLimpio, emailLimpio, hash, id]
            );
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensaje: "Usuario no encontrado." });
            }
            return res.json({ mensaje: "Usuario actualizado." });
        }
        const [resultado] = await pool.execute(
            "UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?",
            [nombreLimpio, emailLimpio, id]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado." });
        }
        res.json({ mensaje: "Usuario actualizado." });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ mensaje: "Ya existe un usuario con ese email." });
        }
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar el usuario." });
    }
}

// Elimina un usuario (con control de permiso).
export async function eliminar(req, res) {
    const { id } = req.params;
    if (!puedeOperar(req, id)) {
        return res.status(403).json({ mensaje: "No tenés permiso para eliminar este usuario." });
    }
    try {
        const [resultado] = await pool.execute("DELETE FROM usuarios WHERE id = ?", [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado." });
        }
        res.json({ mensaje: "Usuario eliminado." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar el usuario." });
    }
}
