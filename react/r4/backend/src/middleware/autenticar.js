// autenticar: middleware que protege las rutas del panel admin con JWT.
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
        req.idAdmin = payload.id;
        next();
    } catch {
        return res.status(401).json({ mensaje: "Token inválido o expirado." });
    }
}
