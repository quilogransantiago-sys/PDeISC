// authController: maneja registro, login y recuperación de contraseña.
// Dependencias: bcryptjs, jsonwebtoken, crypto, pool, sanitizar, validaciones, enviarEmail.
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../database.js";
import { sanitizarTexto } from "../utilidades/sanitizar.js";
import {
    validarContrasena,
    MENSAJE_CONTRASENA,
} from "../utilidades/validaciones.js";

// Registro: crea un usuario nuevo (siempre con rol "usuario").
export async function registrar(req, res) {
    const { nombre, email, contrasena } = req.body;

    if (!nombre || !email || !contrasena) {
        return res.status(400).json({ mensaje: "Nombre, email y contraseña son obligatorios." });
    }

    const nombreLimpio = sanitizarTexto(nombre);
    const emailLimpio = sanitizarTexto(email).toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)) {
        return res.status(400).json({ mensaje: "El email no tiene un formato válido." });
    }

    // Valida que la contraseña cumpla los requisitos.
    if (!validarContrasena(contrasena)) {
        return res.status(400).json({ mensaje: MENSAJE_CONTRASENA });
    }

    try {
        const hash = await bcrypt.hash(contrasena, 10);
        const [resultado] = await pool.execute(
            "INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES (?, ?, ?, 'usuario')",
            [nombreLimpio, emailLimpio, hash]
        );

        // Auto-login: genera el token y devuelve el usuario (igual que el login),
        // para que al registrarse entre directo a la cuenta sin volver a loguearse.
        const token = jwt.sign(
            { id: resultado.insertId, rol: "usuario" },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(201).json({
            mensaje: "Usuario registrado correctamente.",
            token,
            usuario: {
                id: resultado.insertId,
                nombre: nombreLimpio,
                email: emailLimpio,
                rol: "usuario",
            },
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ mensaje: "Ya existe un usuario con ese email." });
        }
        console.error(error);
        res.status(500).json({ mensaje: "Error al registrar el usuario." });
    }
}

// Login: verifica credenciales y devuelve token JWT (con id y rol).
export async function iniciarSesion(req, res) {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
        return res.status(400).json({ mensaje: "Email y contraseña son obligatorios." });
    }

    const emailLimpio = sanitizarTexto(email).toLowerCase();

    try {
        const [filas] = await pool.execute(
            "SELECT * FROM usuarios WHERE email = ?",
            [emailLimpio]
        );

        if (filas.length === 0) {
            return res.status(401).json({ mensaje: "Credenciales incorrectas." });
        }

        const usuario = filas[0];
        const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!contrasenaValida) {
            return res.status(401).json({ mensaje: "Credenciales incorrectas." });
        }

        // El token incluye el rol para la autorización.
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            mensaje: "Inicio de sesión correcto.",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al iniciar sesión." });
    }
}
