import { verifyAccessToken } from '../utilidades/tokens.js';
import { pool } from '../database.js';
import { httpError } from './errors.js';

/**
 * Autenticación por JWT (Authorization: Bearer <token>).
 * Adjunta `req.usuario` con los datos vigentes del usuario en la base.
 */
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(httpError(401, 'No estás autenticado. Iniciá sesión.'));
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    return next(httpError(401, 'Sesión inválida o vencida. Volvé a iniciar sesión.'));
  }

  const [rows] = await pool.query(
    `SELECT u.id, u.nombre, u.email, u.activo, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON r.id = u.rol_id
      WHERE u.id = ?`,
    [payload.sub],
  );

  if (rows.length === 0) {
    return next(httpError(401, 'Usuario no encontrado'));
  }

  const usuario = rows[0];
  if (!usuario.activo) {
    return next(httpError(403, 'Tu cuenta está deshabilitada'));
  }

  req.usuario = usuario;
  next();
}
