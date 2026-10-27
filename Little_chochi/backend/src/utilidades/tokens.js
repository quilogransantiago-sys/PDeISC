import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

/**
 * Utilidades de tokens JWT (acceso y renovación).
 * No se implementa criptografía propia: se usa la biblioteca `jsonwebtoken`
 * y SHA-256 solo para guardar el hash del refresh token en la base.
 */

export function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, rol: user.rol, nombre: user.nombre },
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpires },
  );
}

export function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, type: 'refresh' },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpires },
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

export function verifyRefreshToken(token) {
  const payload = jwt.verify(token, config.jwt.secret);
  if (payload.type !== 'refresh') {
    throw new Error('Tipo de token inválido');
  }
  return payload;
}

/** Hash determinístico del refresh token para no guardarlo en texto plano. */
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
