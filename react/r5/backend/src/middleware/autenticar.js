// autenticar: middleware que protege las rutas con JWT.
// Propósito: verificar el token del header Authorization y agregar a req
// el id y el rol del usuario autenticado.
// Dependencias: jsonwebtoken.
import jwt from "jsonwebtoken";

export function autenticar(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ mensaje: "No autorizado. Falta el token." });
    }

    const token = header.slice(7);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Guarda el id y el rol del usuario para usarlos en los controladores.
        req.idUsuario = payload.id;
        req.rolUsuario = payload.rol;
        next();
    } catch {
        return res.status(401).json({ mensaje: "Token inválido o expirado." });
    }
}

