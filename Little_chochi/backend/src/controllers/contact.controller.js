import { pool } from '../database.js';

export async function createMessage(req, res, next) {
  try {
    const { nombre, email, mensaje, producto_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO mensajes_contacto (nombre, email, mensaje, producto_id) VALUES (?, ?, ?, ?)',
      [nombre, email, mensaje, producto_id ?? null],
    );
    res.status(201).json({
      ok: true,
      mensaje: 'Tu mensaje fue enviado. Te responderemos a la brevedad.',
      id: result.insertId,
    });
  } catch (error) {
    next(error);
  }
}

export async function listMessages(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT m.id, m.nombre, m.email, m.mensaje, m.creado_en, m.producto_id,
              p.nombre AS producto
         FROM mensajes_contacto m
         LEFT JOIN productos p ON p.id = m.producto_id
        ORDER BY m.creado_en DESC`,
    );
    res.json({ ok: true, data: rows });
  } catch (error) {
    next(error);
  }
}
