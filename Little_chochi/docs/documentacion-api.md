# Documentación de la API — Little Chochi

Base URL: `http://localhost:4000/api`

Formato de respuestas (JSON):

```json
{ "ok": true, "data": ... }
{ "ok": true, "mensaje": "..." }
{ "ok": false, "error": "Mensaje legible" }
{ "ok": false, "error": "Datos inválidos", "details": [{ "campo": "...", "mensaje": "..." }] }
```

Autenticación: enviá el access token en el header
`Authorization: Bearer <accessToken>`.

Códigos de error comunes:

| Código | Significado |
| ------ | ----------- |
| 200/201 | Éxito |
| 400 | Datos inválidos / error de validación |
| 401 | No autenticado o sesión vencida |
| 403 | No tenés permisos para esa acción |
| 404 | Recurso no encontrado |
| 409 | Conflicto (email o slug duplicado, etc.) |
| 500 | Error interno |

---

## Autenticación

### `POST /auth/register`
Crea un usuario con rol `cliente`.

Body: `{ nombre, email, password, confirmPassword }`

Reglas de contraseña: ≥8 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1
carácter especial.

Respuesta `201`: `{ ok, usuario, accessToken, refreshToken }`

Errores: `409` email duplicado, `400` validación.

### `POST /auth/login`
Body: `{ email, password }`

Respuesta `200`: `{ ok, usuario, accessToken, refreshToken }`

Errores: `401` credenciales incorrectas, `400` cuenta social (sin contraseña).

### `POST /auth/refresh`
Body: `{ refreshToken }`

Respuesta `200`: `{ ok, usuario, accessToken, refreshToken }` (rota el refresh
token anterior).

### `POST /auth/logout`
Body: `{ refreshToken }` (opcional). Invalida el refresh token.

### `POST /auth/social`
Body: `{ proveedor: "google" | "facebook" | "github", token }`

Verifica el token contra el proveedor y crea/víncula el usuario.

### `GET /auth/me` (autenticado)
Respuesta `200`: `{ ok, usuario }`.

---

## Productos

### `GET /products` (público)
Query params (opcionales): `buscar` (nombre), `categoria` (slug), `orden`
(`precio-asc`, `precio-desc`, `nombre-desc`).

Respuesta `200`: `{ ok, data: [producto] }`.

```json
{
  "id": 1, "nombre": "Babero artesanal de algodón",
  "descripcion": "...", "precio": 4500, "imagen_url": "...",
  "disponible": true, "es_ejemplo": true,
  "categoria_id": 1, "categoria": "Accesorios", "categoria_slug": "accesorios"
}
```

### `GET /products/:id` (público)
Detalle de un producto. `404` si no existe.

### `POST /products` (admin, editor)
Body: `{ nombre, descripcion?, precio, imagen_url?, disponible?, es_ejemplo?, categoria_id }`

Respuesta `201`: `{ ok, data: producto }`.

### `PUT /products/:id` (admin, editor)
Actualiza el producto (mismos campos que POST).

### `DELETE /products/:id` (admin, editor)
Respuesta `200`: `{ ok, mensaje }`.

---

## Categorías

### `GET /categories` (público)
Respuesta `200`: `{ ok, data: [{ id, nombre, slug, descripcion }] }`.

### `POST /categories` (admin, editor)
Body: `{ nombre, slug, descripcion? }`.

### `PUT /categories/:id` (admin, editor)
### `DELETE /categories/:id` (admin)
`409` si la categoría tiene productos asociados.

---

## Usuarios

### `GET /users` (admin)
Lista de usuarios con rol.

### `GET /users/:id` (admin)
### `PUT /users/:id` (admin) — actualiza nombre/email.
Body: `{ nombre, email }`.

### `PATCH /users/:id/role` (admin) — cambia rol.
Body: `{ rol_id }` (1=admin, 2=editor, 3=cliente).

### `DELETE /users/:id` (admin)
`400` si intentás eliminar tu propia cuenta.

---

## Contacto

### `POST /contact` (público)
Body: `{ nombre, email, mensaje, producto_id? }`

Respuesta `201`: `{ ok, mensaje, id }`.

### `GET /contact` (admin, editor)
Lista de mensajes recibidos.

---

## Subida de imágenes

### `POST /uploads` (admin, editor)
`multipart/form-data` con el campo `archivo` (imagen JPG/PNG/WEBP/GIF, máx 5 MB).

Respuesta `201`: `{ ok, data: { url: "/uploads/<archivo>" } }`.

Las imágenes se sirven estáticamente en `http://localhost:4000/uploads/...`.
