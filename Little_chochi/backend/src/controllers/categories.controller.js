import { pool } from '../database.js';
import { httpError } from '../middleware/errors.js';

export async function listCategories(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, slug, descripcion FROM categorias ORDER BY nombre ASC',
    );
    res.json({ ok: true, data: rows });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { nombre, slug, descripcion } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO categorias (nombre, slug, descripcion) VALUES (?, ?, ?)',
        [nombre, slug, descripcion ?? null],
      );
      res.status(201).json({
        ok: true,
        data: { id: result.insertId, nombre, slug, descripcion },
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw httpError(409, 'Ya existe una categoría con ese slug');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { nombre, slug, descripcion } = req.body;
    const [result] = await pool.query(
      'UPDATE categorias SET nombre = ?, slug = ?, descripcion = ? WHERE id = ?',
      [nombre, slug, descripcion ?? null, req.params.id],
    );
    if (result.affectedRows === 0) {
      throw httpError(404, 'Categoría no encontrada');
    }
    res.json({ ok: true, data: { id: Number(req.params.id), nombre, slug, descripcion } });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return next(httpError(409, 'Ya existe una categoría con ese slug'));
    }
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const [result] = await pool.query('DELETE FROM categorias WHERE id = ?', [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      throw httpError(404, 'Categoría no encontrada');
    }
    res.json({ ok: true, mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return next(httpError(409, 'No se puede eliminar: tiene productos asociados'));
    }
    next(error);
  }
}
