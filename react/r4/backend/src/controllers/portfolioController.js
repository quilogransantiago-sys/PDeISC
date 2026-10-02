// portfolioController: CRUD genérico de las secciones del portfolio + subida de imágenes.
// Propósito: manejar datos, habilidades, experiencias, proyectos y logros.
// Dependencias: pool, sanitizar, configMulter.
import { pool } from "../database.js";
import { sanitizarTexto } from "../utilidades/sanitizar.js";
import { subir } from "../configMulter.js";

// Campos permitidos por cada sección (evita modificar columnas que no existen).
const CAMPOS = {
    datos: ["nombre", "profesion", "bio", "email", "foto", "linkedin", "github"],
    habilidades: ["nombre", "nivel", "imagen"],
    experiencias: ["cargo", "lugar", "fecha", "descripcion"],
    proyectos: ["nombre", "descripcion", "imagen", "link"],
    logros: ["titulo", "descripcion", "fecha"],
};

// Verifica que la sección (tabla) sea válida.
function esTablaValida(tabla) {
    return Object.keys(CAMPOS).includes(tabla);
}

// Filtra el cuerpo para quedarse solo con los campos permitidos y sanitizados.
function limpiarCuerpo(tabla, cuerpo) {
    const permitidos = CAMPOS[tabla];
    const resultado = {};
    for (const campo of permitidos) {
        if (cuerpo[campo] !== undefined) {
            resultado[campo] =
                typeof cuerpo[campo] === "string"
                    ? sanitizarTexto(cuerpo[campo])
                    : cuerpo[campo];
        }
    }
    return resultado;
}

// GET /api/:tabla -> lista los registros de una sección.
export async function listar(req, res) {
    const { tabla } = req.params;
    if (!esTablaValida(tabla)) {
        return res.status(400).json({ mensaje: "Sección inválida." });
    }
    try {
        const [filas] = await pool.query("SELECT * FROM ?? ORDER BY id ASC", [tabla]);
        res.json(filas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al listar." });
    }
}

// POST /api/:tabla -> crea un registro.
export async function crear(req, res) {
    const { tabla } = req.params;
    if (!esTablaValida(tabla)) {
        return res.status(400).json({ mensaje: "Sección inválida." });
    }
    const datos = limpiarCuerpo(tabla, req.body);
    const campos = Object.keys(datos);
    if (campos.length === 0) {
        return res.status(400).json({ mensaje: "No hay datos válidos." });
    }
    try {
        const columnas = campos.join(", ");
        const placeholders = campos.map(() => "?").join(", ");
        const [resultado] = await pool.execute(
            `INSERT INTO ?? (${columnas}) VALUES (${placeholders})`,
            [tabla, ...campos.map((c) => datos[c])]
        );
        res.status(201).json({ mensaje: "Creado.", id: resultado.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al crear." });
    }
}

// PUT /api/:tabla/:id -> actualiza un registro.
export async function actualizar(req, res) {
    const { tabla, id } = req.params;
    if (!esTablaValida(tabla)) {
        return res.status(400).json({ mensaje: "Sección inválida." });
    }
    const datos = limpiarCuerpo(tabla, req.body);
    const campos = Object.keys(datos);
    if (campos.length === 0) {
        return res.status(400).json({ mensaje: "No hay datos válidos." });
    }
    try {
        const set = campos.map((c) => `${c} = ?`).join(", ");
        const [resultado] = await pool.execute(
            `UPDATE ?? SET ${set} WHERE id = ?`,
            [tabla, ...campos.map((c) => datos[c]), id]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "No encontrado." });
        }
        res.json({ mensaje: "Actualizado." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar." });
    }
}

// DELETE /api/:tabla/:id -> elimina un registro.
export async function eliminar(req, res) {
    const { tabla, id } = req.params;
    if (!esTablaValida(tabla)) {
        return res.status(400).json({ mensaje: "Sección inválida." });
    }
    try {
        const [resultado] = await pool.execute("DELETE FROM ?? WHERE id = ?", [tabla, id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "No encontrado." });
        }
        res.json({ mensaje: "Eliminado." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar." });
    }
}

// POST /api/subir-imagen -> sube una imagen y devuelve su URL.
export async function subirImagen(req, res) {
    subir.single("imagen")(req, res, (error) => {
        if (error) {
            return res.status(400).json({ mensaje: error.message });
        }
        if (!req.file) {
            return res.status(400).json({ mensaje: "No se subió ninguna imagen." });
        }
        // Devuelve la ruta pública de la imagen (servida por express.static).
        res.json({ url: `/uploads/${req.file.filename}` });
    });
}
