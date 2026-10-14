// autenticar: middleware que valida el token JWT del admin.
import jwt from "jsonwebtoken";

export function autenticar(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ mensaje: "No autenticado." });
    }
    try {
        const token = header.slice(7);
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        next();
    } catch {
        res.status(401).json({ mensaje: "Token inválido o vencido." });
    }
}
