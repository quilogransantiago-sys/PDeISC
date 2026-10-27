import { httpError } from './errors.js';

/**
 * Autorización por roles.
 * Uso: requireRole('admin') o requireRole('admin', 'editor').
 * Debe ejecutarse después de `requireAuth`.
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.usuario) {
      return next(httpError(401, 'No estás autenticado'));
    }
    if (!roles.includes(req.usuario.rol)) {
      return next(httpError(403, 'No tenés permisos para realizar esta acción'));
    }
    next();
  };
}
