import { pool } from '../database.js';
import { httpError } from '../middleware/errors.js';

function toPublicUser(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    rol_id: row.rol_id,
    rol: row.rol,
    activo: Boolean(row.activo),
    creado_en: row.creado_en,
  };
}

export async function listUsers(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.activo, u.creado_en, u.rol_id, r.nombre AS rol
         FROM usuarios u JOIN roles r ON r.id = u.rol_id
        ORDER BY u.id ASC`,
    );
    res.json({ ok: true, data: rows.map(toPublicUser) });
  } catch (error) {
    next(error);
  }
}

export async function getUser(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.activo, u.creado_en, u.rol_id, r.nombre AS rol
         FROM usuarios u JOIN roles r ON r.id = u.rol_id WHERE u.id = ?`,
      [req.params.id],
    );
    if (rows.length === 0) throw httpError(404, 'Usuario no encontrado');
    res.json({ ok: true, data: toPublicUser(rows[0]) });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { nombre, email } = req.body;
    const [result] = await pool.query(
      'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
      [nombre, email, req.params.id],
    );
    if (result.affectedRows === 0) throw httpError(404, 'Usuario no encontrado');

    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.activo, u.creado_en, u.rol_id, r.nombre AS rol
         FROM usuarios u JOIN roles r ON r.id = u.rol_id WHERE u.id = ?`,
      [req.params.id],
    );
    res.json({ ok: true, data: toPublicUser(rows[0]) });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return next(httpError(409, 'Ya existe una cuenta con ese email'));
    }
    next(error);
  }
}

export async function updateRole(req, res, next) {
  try {
    const { rol_id } = req.body;
    const [roleRows] = await pool.query('SELECT id FROM roles WHERE id = ?', [rol_id]);
    if (roleRows.length === 0) throw httpError(400, 'El rol indicado no existe');

    const [result] = await pool.query('UPDATE usuarios SET rol_id = ? WHERE id = ?', [
      rol_id,
      req.params.id,
    ]);
    if (result.affectedRows === 0) throw httpError(404, 'Usuario no encontrado');

    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.activo, u.creado_en, u.rol_id, r.nombre AS rol
         FROM usuarios u JOIN roles r ON r.id = u.rol_id WHERE u.id = ?`,
      [req.params.id],
    );
    res.json({ ok: true, data: toPublicUser(rows[0]) });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    if (Number(req.params.id) === Number(req.usuario.id)) {
      throw httpError(400, 'No podés eliminar tu propia cuenta');
    }
    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [
      req.params.id,
    ]);
    if (result.affectedRows === 0) throw httpError(404, 'Usuario no encontrado');
    res.json({ ok: true, mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    next(error);
  }
}
