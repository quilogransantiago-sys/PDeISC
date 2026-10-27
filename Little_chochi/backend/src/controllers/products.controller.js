import { pool } from '../database.js';
import { httpError } from '../middleware/errors.js';

const SELECT_BASE = `
  SELECT p.id, p.nombre, p.descripcion, p.precio, p.imagen_url,
         p.disponible, p.es_ejemplo, p.creado_en, p.actualizado_en,
         c.id AS categoria_id, c.nombre AS categoria, c.slug AS categoria_slug
    FROM productos p
    JOIN categorias c ON c.id = p.categoria_id`;

function toPublicProduct(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    precio: Number(row.precio),
    imagen_url: row.imagen_url,
    disponible: Boolean(row.disponible),
    es_ejemplo: Boolean(row.es_ejemplo),
    creado_en: row.creado_en,
    actualizado_en: row.actualizado_en,
    categoria_id: row.categoria_id,
    categoria: row.categoria,
    categoria_slug: row.categoria_slug,
  };
}

export async function listProducts(req, res, next) {
  try {
    const { buscar, categoria, orden } = req.query;
    const where = [];
    const params = [];

    if (buscar) {
      where.push('p.nombre LIKE ?');
      params.push(`%${buscar}%`);
    }
    if (categoria) {
      where.push('c.slug = ?');
      params.push(categoria);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    let orderSql = 'ORDER BY p.nombre ASC';
    if (orden === 'precio-asc') orderSql = 'ORDER BY p.precio ASC';
    if (orden === 'precio-desc') orderSql = 'ORDER BY p.precio DESC';
    if (orden === 'nombre-desc') orderSql = 'ORDER BY p.nombre DESC';

    const [rows] = await pool.query(
      `${SELECT_BASE} ${whereSql} ${orderSql}`,
      params,
    );
    res.json({ ok: true, data: rows.map(toPublicProduct) });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const [rows] = await pool.query(`${SELECT_BASE} WHERE p.id = ?`, [
      req.params.id,
    ]);
    if (rows.length === 0) {
      throw httpError(404, 'Producto no encontrado');
    }
    res.json({ ok: true, data: toPublicProduct(rows[0]) });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const { nombre, descripcion, precio, imagen_url, disponible, es_ejemplo, categoria_id } =
      req.body;

    const [catRows] = await pool.query('SELECT id FROM categorias WHERE id = ?', [
      categoria_id,
    ]);
    if (catRows.length === 0) {
      throw httpError(400, 'La categoría indicada no existe');
    }

    const [result] = await pool.query(
      `INSERT INTO productos
         (nombre, descripcion, precio, imagen_url, disponible, es_ejemplo, categoria_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        descripcion ?? null,
        precio,
        imagen_url ?? null,
        disponible ? 1 : 0,
        es_ejemplo ? 1 : 0,
        categoria_id,
      ],
    );

    const [rows] = await pool.query(`${SELECT_BASE} WHERE p.id = ?`, [
      result.insertId,
    ]);
    res.status(201).json({ ok: true, data: toPublicProduct(rows[0]) });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { nombre, descripcion, precio, imagen_url, disponible, es_ejemplo, categoria_id } =
      req.body;

    const [catRows] = await pool.query('SELECT id FROM categorias WHERE id = ?', [
      categoria_id,
    ]);
    if (catRows.length === 0) {
      throw httpError(400, 'La categoría indicada no existe');
    }

    const [result] = await pool.query(
      `UPDATE productos
          SET nombre = ?, descripcion = ?, precio = ?, imagen_url = ?,
              disponible = ?, es_ejemplo = ?, categoria_id = ?
        WHERE id = ?`,
      [
        nombre,
        descripcion ?? null,
        precio,
        imagen_url ?? null,
        disponible ? 1 : 0,
        es_ejemplo ? 1 : 0,
        categoria_id,
        req.params.id,
      ],
    );

    if (result.affectedRows === 0) {
      throw httpError(404, 'Producto no encontrado');
    }

    const [rows] = await pool.query(`${SELECT_BASE} WHERE p.id = ?`, [
      req.params.id,
    ]);
    res.json({ ok: true, data: toPublicProduct(rows[0]) });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      throw httpError(404, 'Producto no encontrado');
    }
    res.json({ ok: true, mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    next(error);
  }
}
