# Arquitectura — Little Chochi

## Visión general

Aplicación **cliente-servidor** separada en dos proyectos:

```
[ Expo Web / Expo Go ]  --HTTP REST-->  [ Express API ]  --SQL-->  [ MySQL ]
      (frontend)                          (backend)               (XAMPP)
```

- El frontend **nunca** accede directo a la base de datos: consume la API REST.
- La comunicación es JSON y usa JWT para autenticación.

---

## Frontend (Expo SDK 58)

Estructura dentro de `frontend/src/`:

| Carpeta        | Contenido |
| -------------- | --------- |
| `app/`         | Rutas de **Expo Router** (cada archivo es una pantalla). |
| `components/`  | Componentes reutilizables (Navbar, Footer, ProductCard, ui/*). |
| `context/`     | `AuthContext` (estado global de sesión). |
| `modules/api/` | Cliente HTTP y servicios por recurso (auth, products, …). |
| `modules/`     | `storage` (persistencia), `types` (modelos), `format` (precios). |
| `styles/`      | `theme` con la paleta derivada del logo real. |

### Navegación (Expo Router)

- `(site)/` → portada, catálogo, detalle, contacto, cuenta (con Navbar + Footer).
- `(auth)/` → login y registro.
- `admin/` → panel protegido (solo `admin`/`editor`).

### Estado y sesión

`AuthContext` guarda el usuario y los tokens. La sesión se **persiste** con
`@react-native-async-storage/async-storage` (en web usa `localStorage` como
respaldo). El cliente HTTP renueva automáticamente el access token ante un 401
usando el refresh token.

> Nota de seguridad: para producción web se recomienda migrar el refresh token
> a una cookie **HttpOnly** servida por el backend.

---

## Backend (Express)

Estructura en `backend/src/`:

| Carpeta/archivo | Responsabilidad |
| --------------- | --------------- |
| `server.js`     | Arranque y verificación de conexión a MySQL. |
| `app.js`        | Configura Express (CORS, JSON, estáticos, rutas, errores). |
| `database.js`   | Pool de conexiones `mysql2/promise`. |
| `routes/`       | Definición de endpoints. |
| `controllers/`  | Lógica de cada endpoint. |
| `middleware/`   | `auth` (JWT), `roles` (autorización), `validate` (zod), `errors`, `upload`. |
| `utilidades/`   | `tokens` (JWT), `validators` (esquemas zod). |

### Autenticación

- **Access token** (JWT, 15 min) + **refresh token** (JWT, 7 días).
- El refresh token se guarda **hasheado** (SHA-256) en la base y se **rota** en
  cada renovación.
- Contraseñas con **bcryptjs** (nunca en texto plano).
- Login social (Google/Facebook/GitHub) verifica el token contra el proveedor y
  crea/víncula la identidad en la tabla `identidades_sociales`.

### Roles y permisos

| Rol      | Permisos |
| -------- | -------- |
| `admin`  | CRUD de productos, categorías y usuarios; cambia roles. |
| `editor` | CRUD de productos y categorías. |
| `cliente`| Solo sus propios datos. |

El middleware `requireRole(...)` protege los endpoints según el rol.

---

## Base de datos (MySQL, 3FN)

Tablas:

- `roles` (1) ← `usuarios` (N)
- `usuarios` (1) ← `identidades_sociales` (N)
- `categorias` (1) ← `productos` (N)
- `usuarios` (1) ← `refresh_tokens` (N)
- `productos` (1) ← `mensajes_contacto` (N, opcional)

La normalización elimina dependencias transitivas (p. ej., el rol es una entidad
propia referenciada por los usuarios; la categoría es una entidad propia
referenciada por los productos).

---

## Seguridad

- Consultas SQL **parametrizadas** (anti SQL injection).
- Validación de entrada con **zod** y sanitización.
- Contraseñas con hash; tokens con vencimiento y rotación.
- CORS configurado para los orígenes del frontend.
- Variables sensibles en `.env` (no versionadas; se provee `.env.example`).
- No se implementa criptografía propia (se usan `jsonwebtoken`, `bcryptjs` y
  SHA-256 solo para el hash del refresh token).

---

## Decisiones relevantes

1. **Expo SDK 58** (última estable al momento de crear el proyecto) con Expo
   Router y React Native Web para probar en navegador.
2. **Context API** en lugar de Redux: el estado global es solo la sesión, no
   justifica una librería extra.
3. **fetch** en lugar de axios: cero dependencias extra para el cliente HTTP.
4. **ego-browser** en lugar de Playwright (requisito del proyecto).
5. **AsyncStorage** para persistir la sesión (con la salvedad documentada sobre
   localStorage en web).
6. **MariaDB (XAMPP)** como MySQL, con `mysql2` y pool.

---

## Qué se validó y qué quedó pendiente

**Validado con ego-browser (web):**

- Portada, catálogo (búsqueda/filtro/orden), detalle y contacto.
- Registro, validaciones, email duplicado, login correcto/incorrecto.
- Rutas protegidas y persistencia de sesión (recarga).
- CRUD de productos y gestión de usuarios/roles.
- Responsive (1366×768, 768×1024, 390×844) sin scroll horizontal.
- `tsc --noEmit` y `eslint` sin errores.

**Pendiente:**

- Validación del **APK Android** (requiere EAS Build y otra herramienta de
  prueba: Maestro/Appium o prueba manual).
- **Login social** end-to-end (requiere credenciales reales de los proveedores).
