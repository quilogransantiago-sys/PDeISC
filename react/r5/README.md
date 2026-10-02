# R5 — Sistema de Usuarios con Login Social (OAuth 2.0 / Auth0)

Réplica del R3 (sistema de usuarios con React Router, JWT, roles y MySQL) con **login social** agregado mediante **Auth0**: se puede entrar con **Google**, **GitHub** y **Discord**.

## Stack

- **Backend:** Node.js + Express + MySQL/MariaDB (XAMPP) + JWT + bcryptjs.
- **Frontend:** React + TypeScript + Vite + React Router + React Hook Form + Auth0 SPA SDK.
- **Auth0:** proveedor de identidad (OAuth 2.0 / OpenID Connect).

## Estructura

```
r5/
├── backend/                 # API en Express (puerto 5001)
│   ├── database/schema.sql  # script de creación de la BD (referencia)
│   ├── src/
│   │   ├── controllers/authController.js   # registro, login y login social
│   │   ├── routes/authRoutes.js
│   │   └── ...
│   └── .env.example         # configuración de ejemplo
└── frontend/                # SPA en Vite (puerto 3004)
    ├── src/
    │   ├── context/AuthContext.tsx           # sesión propia (JWT del backend)
    │   ├── components/BotonesSociales.tsx    # botones Google/GitHub/Discord
    │   ├── components/ManejadorLoginSocial.tsx # cierre del login social
    │   ├── pages/Login.tsx   # login normal + social
    │   └── pages/Registro.tsx # registro normal + social
    └── vite.config.ts
```

## Requisitos

1. **Node.js** (18+).
2. **MySQL/MariaDB** corriendo (XAMPP), usuario `root` sin contraseña.
3. **Cuenta Auth0** con una aplicación *Single Page Application*.

## 1) Backend

```bash
cd r5/backend
npm install
# Crear la base de datos "sistema_router" y la tabla (ejecutar schema.sql)
npm run dev                # arranca en http://localhost:5001
```

Variables de entorno (copiá `.env.example` a `.env`):

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=sistema_router
JWT_SECRET=clave_super_secreta_r3_sistema_router
PORT=5001
AUTH0_DOMAIN=dev-tbn8w11v62ipodup.us.auth0.com
```

### Credenciales de prueba

| Rol   | Email            | Contraseña |
|-------|------------------|------------|
| Admin | `admin@admin.com`| `admin123` |

## 2) Frontend

```bash
cd r5/frontend
npm install
npm run dev                # arranca en http://localhost:3004
```

## 3) Configuración de Auth0

App **`sistema-usuarios-r5`** (Single Page Application):

- **Domain:** `dev-tbn8w11v62ipodup.us.auth0.com`
- **Client ID:** `KRAXo1q5KjEJnyokbZI1cpziE5hlBuKs`
- **Allowed Callback URLs:** `http://localhost:3004`
- **Allowed Logout URLs:** `http://localhost:3004`
- **Allowed Web Origins:** `http://localhost:3004`

Conexiones sociales habilitadas (**Authentication → Social**):

| Proveedor | Conexión        | Nota |
|-----------|-----------------|------|
| Google    | `google-oauth2` | claves de desarrollo |
| GitHub    | `github`        | claves de desarrollo |
| Discord   | `discord`       | requiere app propia en Discord Developers (callback `https://dev-tbn8w11v62ipodup.us.auth0.com/login/callback`) |

## Flujo OAuth 2.0 (login social)

1. El usuario hace clic en "Continuar con Google/GitHub/Discord".
2. El SDK de Auth0 redirige a `https://dev-tbn8w11v62ipodup.us.auth0.com/authorize` con `connection=...` (Authorization Code + PKCE).
3. Auth0 redirige al proveedor, el usuario autoriza y el proveedor devuelve un código a Auth0.
4. Auth0 intercambia el código por tokens y redirige al frontend (`http://localhost:3004`).
5. El frontend obtiene el access token con `getAccessTokenSilently()` y lo envía al backend.
6. `POST /api/auth/social` llama a `/userinfo` de Auth0 para obtener `email` y `name`.
7. El backend busca el usuario por email y, si no existe, lo crea (contraseña aleatoria que nunca se usa). Si el proveedor no devuelve email (p. ej. GitHub con email privado), usa un email sintético basado en el `sub`.
8. El backend firma su JWT propio (id + rol) y el frontend entra al sistema.

## Endpoints del backend

| Método | Ruta                 | Descripción                                          |
|--------|----------------------|------------------------------------------------------|
| POST   | `/api/auth/registro` | Registro de usuario (rol `usuario`).                 |
| POST   | `/api/auth/login`    | Login con email/contraseña (devuelve JWT).           |
| POST   | `/api/auth/social`   | Login social: verifica token de Auth0 y devuelve JWT.|
| GET    | `/api/usuarios`      | Lista de usuarios (requiere JWT).                    |
| POST   | `/api/usuarios`      | Crear usuario (solo admin).                          |
| GET    | `/api/usuarios/:id`  | Detalle de usuario (requiere JWT).                   |
| PUT    | `/api/usuarios/:id`  | Editar usuario (solo admin).                         |
| DELETE | `/api/usuarios/:id`  | Eliminar usuario (solo admin).                       |
