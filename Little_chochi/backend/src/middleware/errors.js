import { ZodError } from 'zod';

/**
 * Middleware de manejo centralizado de errores.
 * Convierte errores conocidos en respuestas HTTP coherentes y en español.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    ok: false,
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Errores de validación de Zod
  if (err instanceof ZodError) {
    const details = err.errors.map((issue) => ({
      campo: issue.path.join('.') || 'body',
      mensaje: issue.message,
    }));
    return res.status(400).json({
      ok: false,
      error: 'Datos inválidos',
      details,
    });
  }

  // Errores operativos propios (con statusCode)
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      ok: false,
      error: err.message,
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      ok: false,
      error: 'Sesión inválida o vencida. Volvé a iniciar sesión.',
    });
  }

  // Errores de subida de archivos (multer)
  if (err.name === 'MulterError') {
    const mensaje =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'El archivo supera el tamaño máximo permitido (5 MB)'
        : 'Error al subir el archivo';
    return res.status(400).json({ ok: false, error: mensaje });
  }

  // Error de parsing JSON en el body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      ok: false,
      error: 'El cuerpo de la petición no es un JSON válido',
    });
  }

  console.error('[error no controlado]', err);
  return res.status(500).json({
    ok: false,
    error: 'Error interno del servidor. Intentalo de nuevo más tarde.',
  });
}

/** Helper para lanzar errores operativos con código HTTP. */
export function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/** Envuelve un controller async para capturar rechazos. */
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
