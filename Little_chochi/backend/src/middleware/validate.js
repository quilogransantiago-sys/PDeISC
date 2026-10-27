/**
 * Middleware de validación con Zod.
 * Valida `req.body` (y opcionalmente `req.query` / `req.params`) contra un
 * esquema y lanza un error 400 con los mensajes en español si falla.
 */
export function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(parsed.error);
    }
    req.body = parsed.data;
    next();
  };
}
