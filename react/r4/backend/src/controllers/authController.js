// authController: maneja el login del administrador.
// Dependencias: bcryptjs, jsonwebtoken, pool, sanitizar.
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../database.js";
import { sanitizarTexto } from "../utilidades/sanitizar.js";

// Login del admin: verifica credenciales y devuelve un token JWT.
export async function iniciarSesionAdmin(req, res) {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
        return res.status(400).json({ mensaje: "Email y contraseña son obligatorios." });
    }

    const emailLimpio = sanitizarTexto(email).toLowerCase();

    try {
        const [filas] = await pool.execute("SELECT * FROM admin WHERE email = ?", [
            emailLimpio,
        ]);

        if (filas.length === 0) {
            return res.status(401).json({ mensaje: "Credenciales incorrectas." });
        }

        const admin = filas[0];
        const valida = await bcrypt.compare(contrasena, admin.contrasena);
        if (!valida) {
            return res.status(401).json({ mensaje: "Credenciales incorrectas." });
        }

        const token = jwt.sign({ id: admin.id, rol: "admin" }, process.env.JWT_SECRET, {
            expiresIn: "4h",
        });

        res.json({
            mensaje: "Bienvenido.",
            token,
            admin: { id: admin.id, email: admin.email },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al iniciar sesión." });
    }
}
