import bcrypt from 'bcryptjs';
import { pool } from '../database.js';
import { config } from '../config.js';
import { httpError } from '../middleware/errors.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} from '../utilidades/tokens.js';

const ROL_CLIENTE = 'cliente';

/** Carga un usuario (con su rol) por id. */
async function findUserById(id) {
  const [rows] = await pool.query(
    `SELECT u.id, u.nombre, u.email, u.activo, r.nombre AS rol
       FROM usuarios u JOIN roles r ON r.id = u.rol_id WHERE u.id = ?`,
    [id],
  );
  return rows[0] || null;
}

/** Crea tokens de acceso + renovación y persiste el refresh token (hash). */
async function issueTokens(usuario) {
  const accessToken = signAccessToken(usuario);
  const refreshToken = signRefreshToken(usuario);
  const expiresAt = new Date(Date.now() + config.jwt.refreshExpiresSeconds * 1000);
  await pool.query(
    'INSERT INTO refresh_tokens (usuario_id, token_hash, expires_at) VALUES (?, ?, ?)',
    [usuario.id, hashToken(refreshToken), expiresAt],
  );
  return { accessToken, refreshToken };
}

/** Convierte una fila de usuario (con rol) al payload público. */
function toPublicUser(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
  };
}

export async function register(req, res, next) {
  try {
    const { nombre, email, password } = req.body;

    const [rolRows] = await pool.query('SELECT id FROM roles WHERE nombre = ?', [
      ROL_CLIENTE,
    ]);
    if (rolRows.length === 0) {
      throw httpError(500, 'Rol de cliente no configurado en la base de datos');
    }

    const [existing] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [
      email,
    ]);
    if (existing.length > 0) {
      throw httpError(409, 'Ya existe una cuenta con ese email');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol_id) VALUES (?, ?, ?, ?)',
      [nombre, email, passwordHash, rolRows[0].id],
    );

    const usuario = await findUserById(result.insertId);
    const tokens = await issueTokens(usuario);

    res.status(201).json({
      ok: true,
      usuario: toPublicUser(usuario),
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.password_hash, u.activo, r.nombre AS rol
         FROM usuarios u JOIN roles r ON r.id = u.rol_id WHERE u.email = ?`,
      [email],
    );

    const usuario = rows[0];
    if (!usuario) {
      throw httpError(401, 'Email o contraseña incorrectos');
    }
    if (!usuario.activo) {
      throw httpError(403, 'Tu cuenta está deshabilitada');
    }
    if (!usuario.password_hash) {
      throw httpError(
        400,
        'Esta cuenta se creó con una red social. Iniciá sesión con ese proveedor.',
      );
    }

    const valid = await bcrypt.compare(password, usuario.password_hash);
    if (!valid) {
      throw httpError(401, 'Email o contraseña incorrectos');
    }

    const tokens = await issueTokens(usuario);
    res.json({ ok: true, usuario: toPublicUser(usuario), ...tokens });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw httpError(401, 'Sesión vencida. Volvé a iniciar sesión.');
    }

    const hash = hashToken(refreshToken);
    const [rows] = await pool.query(
      'SELECT id, usuario_id, expires_at FROM refresh_tokens WHERE token_hash = ?',
      [hash],
    );
    if (rows.length === 0) {
      throw httpError(401, 'Sesión inválida. Volvé a iniciar sesión.');
    }
    const stored = rows[0];
    if (new Date(stored.expires_at).getTime() < Date.now()) {
      await pool.query('DELETE FROM refresh_tokens WHERE id = ?', [stored.id]);
      throw httpError(401, 'Sesión vencida. Volvé a iniciar sesión.');
    }

    // Rotación: se invalida el refresh anterior y se emiten nuevos tokens.
    await pool.query('DELETE FROM refresh_tokens WHERE id = ?', [stored.id]);
    const usuario = await findUserById(payload.sub);
    if (!usuario || !usuario.activo) {
      throw httpError(401, 'Usuario no encontrado o deshabilitado');
    }

    const tokens = await issueTokens(usuario);
    res.json({ ok: true, usuario: toPublicUser(usuario), ...tokens });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await pool.query('DELETE FROM refresh_tokens WHERE token_hash = ?', [
        hashToken(refreshToken),
      ]);
    }
    res.json({ ok: true, mensaje: 'Sesión cerrada correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({ ok: true, usuario: toPublicUser(req.usuario) });
}

/* ------------------------------------------------------------------ */
/* Login social (Google, Facebook, GitHub)                             */
/* ------------------------------------------------------------------ */

/** Verifica el token contra el proveedor y devuelve la identidad. */
async function verifySocial(proveedor, token) {
  if (proveedor === 'google') {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw httpError(401, 'No se pudo validar el token de Google');
    const data = await res.json();
    return { socialId: data.sub, email: data.email, nombre: data.name };
  }

  if (proveedor === 'facebook') {
    const res = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${encodeURIComponent(token)}`,
    );
    if (!res.ok) throw httpError(401, 'No se pudo validar el token de Facebook');
    const data = await res.json();
    return { socialId: data.id, email: data.email, nombre: data.name };
  }

  if (proveedor === 'github') {
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'little-chochi' },
    });
    if (!userRes.ok) throw httpError(401, 'No se pudo validar el token de GitHub');
    const data = await userRes.json();
    let email = data.email;
    if (!email) {
      const emailsRes = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'little-chochi' },
      });
      if (emailsRes.ok) {
        const emails = await emailsRes.json();
        const primary = emails.find((e) => e.primary && e.verified) || emails[0];
        email = primary?.email;
      }
    }
    return { socialId: String(data.id), email, nombre: data.name || data.login };
  }

  throw httpError(400, 'Proveedor social no soportado');
}

export async function socialLogin(req, res, next) {
  try {
    const { proveedor, token } = req.body;
    const identity = await verifySocial(proveedor, token);

    if (!identity.socialId) {
      throw httpError(401, 'No se pudo obtener la identidad del proveedor');
    }

    // 1) ¿Ya existe esta identidad social?
    const [identityRows] = await pool.query(
      `SELECT i.usuario_id, u.id, u.nombre, u.email, u.activo, r.nombre AS rol
         FROM identidades_sociales i
         JOIN usuarios u ON u.id = i.usuario_id
         JOIN roles r ON r.id = u.rol_id
        WHERE i.proveedor = ? AND i.social_id = ?`,
      [proveedor, identity.socialId],
    );

    if (identityRows.length > 0) {
      const usuario = identityRows[0];
      if (!usuario.activo) throw httpError(403, 'Tu cuenta está deshabilitada');
      const tokens = await issueTokens(usuario);
      return res.json({ ok: true, usuario: toPublicUser(usuario), ...tokens });
    }

    // 2) ¿Existe un usuario con ese email? (vinculamos la identidad)
    if (identity.email) {
      const [emailRows] = await pool.query(
        `SELECT u.id, u.nombre, u.email, u.activo, r.nombre AS rol
           FROM usuarios u JOIN roles r ON r.id = u.rol_id WHERE u.email = ?`,
        [identity.email.toLowerCase()],
      );
      if (emailRows.length > 0) {
        const usuario = emailRows[0];
        if (!usuario.activo) throw httpError(403, 'Tu cuenta está deshabilitada');
        await pool.query(
          'INSERT IGNORE INTO identidades_sociales (usuario_id, proveedor, social_id) VALUES (?, ?, ?)',
          [usuario.id, proveedor, identity.socialId],
        );
        const tokens = await issueTokens(usuario);
        return res.json({ ok: true, usuario: toPublicUser(usuario), ...tokens });
      }
    }

    // 3) Crear un usuario nuevo (rol cliente) y vincular la identidad.
    const nombre = identity.nombre || proveedor;
    const email = identity.email
      ? identity.email.toLowerCase()
      : `${identity.socialId}@${proveedor}.social`;

    const [rolRows] = await pool.query('SELECT id FROM roles WHERE nombre = ?', [
      ROL_CLIENTE,
    ]);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol_id) VALUES (?, ?, NULL, ?)',
      [nombre, email, rolRows[0].id],
    );
    await pool.query(
      'INSERT INTO identidades_sociales (usuario_id, proveedor, social_id) VALUES (?, ?, ?)',
      [result.insertId, proveedor, identity.socialId],
    );

    const usuario = await findUserById(result.insertId);
    const tokens = await issueTokens(usuario);
    res.status(201).json({ ok: true, usuario: toPublicUser(usuario), ...tokens });
  } catch (error) {
    next(error);
  }
}
