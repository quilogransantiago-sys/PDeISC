# Little Chochi 🧶

**Tienda visual de productos artesanales para bebés** — el emprendimiento de
tejidos y confección hecha a mano. Aplicación full-stack (React Native + Expo y
Node.js + Express + MySQL) preparada para sumar compras/pedidos a futuro.

> Esta versión es una **tienda de exhibición sin pagos reales**: en lugar de
> "comprar", cada producto expone un **botón de contacto**.

---

## ¿Qué hace?

- **Portada** cuidada con logo real, categorías y productos destacados.
- **Catálogo** con búsqueda por nombre, filtro por categoría y ordenamiento por
  precio/nombre.
- **Detalle de producto** con imagen, precio, descripción, disponibilidad y
  botón de contacto.
- **Registro e inicio de sesión** con email/contraseña y **3 proveedores
  sociales** (Google, Facebook y GitHub).
- **3 roles** con permisos diferenciados: `admin`, `editor` y `cliente`.
- **Panel de administración** con CRUD de productos (incluye subida de imagen) y
  gestión de usuarios/roles.
- **Sesión persistente** (el usuario sigue conectado al reabrir la app).

---

## Tecnologías

| Capa      | Tecnología                                                        |
| --------- | ----------------------------------------------------------------- |
| Frontend  | React Native + **Expo SDK 58**, TypeScript, **Expo Router**, React Native Web |
| Estado    | Context API (`AuthContext`)                                       |
| Backend   | Node.js + **Express** (módulos ES), `mysql2`, `jsonwebtoken`, `bcryptjs`, `zod` |
| Base datos| **MySQL / MariaDB** (XAMPP), normalizada a **3FN**                 |
| Pruebas   | **ego-browser** (automatización de navegador, reemplaza a Playwright) |

---

## Estructura

```
little-chochi/
├── frontend/            # Expo + React Native + TypeScript
│   ├── app/  (src/app/) # Rutas y pantallas de Expo Router
│   ├── src/components/  # Componentes reutilizables
│   ├── src/context/     # AuthContext (estado global)
│   ├── src/modules/     # API, storage, tipos, formato
│   ├── src/styles/      # Tema y paleta del logo
│   └── assets/images/   # Logotipo e imágenes
├── backend/
│   ├── src/             # server, app, database, routes, controllers, middleware, utilidades
│   └── database/schema.sql
├── docs/                # Documentación en español
├── README.md
├── AGENTS.md
└── .gitignore
```

---

## Requisitos

- **Node.js** (se probó con Node 24 para Expo; el backend funciona con Node 18+).
  ⚠️ Expo SDK 58 requiere Node `^22.13 || ^24.3 || ^26`. Con Node 25 npm emite
  advertencias de engine (no bloqueantes).
- **npm**.
- **XAMPP** (o cualquier MySQL/MariaDB) con Apache/MySQL iniciados.
- **ego-browser** (ego lite) para las pruebas de navegador.

---

## Instalación

### 1. Base de datos

1. Iniciá **XAMPP** (Apache + MySQL).
2. Importá el esquema (crea la base `little_chochi`, tablas y datos de referencia):

   ```powershell
   C:\xampp\mysql\bin\mysql.exe -u root --default-character-set=utf8mb4 -e "source C:/ruta/al/proyecto/backend/database/schema.sql"
   ```

3. Cargá la semilla (admin + productos de ejemplo):

   ```powershell
   cd backend
   npm install
   npm run seed
   ```

### 2. Backend

```powershell
cd backend
copy .env.example .env   # y editá las credenciales si hace falta
npm install
npm run dev              # http://localhost:4000
```

### 3. Frontend

```powershell
cd frontend
npm install
npm run web              # http://localhost:8081
```

Para Expo Go en el celular: `npm start` y escaneá el QR. Para el APK: ver
`docs/guia-instalacion.md` (EAS Build).

---

## Credenciales de demostración

| Rol    | Email                  | Contraseña |
| ------ | ---------------------- | ---------- |
| Admin  | `admin@littlechochi.com` | `Admin123!` |
| Cliente| Creá tu cuenta desde *Registrarse* | —    |

---

## Variables de entorno

**Backend** (`backend/.env`, ver `.env.example`):

```
PORT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME,
JWT_SECRET, JWT_ACCESS_EXPIRES, JWT_REFRESH_EXPIRES,
CORS_ORIGIN, WHATSAPP_NUMBER, GOOGLE_CLIENT_ID, ...
```

**Frontend** (`frontend/.env`, ver `.env.example`):

```
EXPO_PUBLIC_API_URL=http://localhost:4000/api
EXPO_PUBLIC_WHATSAPP_NUMBER=5491100000000
```

---

## Rutas principales de la API

Base: `http://localhost:4000/api`

| Método | Ruta                    | Descripción                          | Acceso          |
| ------ | ----------------------- | ------------------------------------ | --------------- |
| POST   | `/auth/register`        | Registro de usuario                  | Público         |
| POST   | `/auth/login`           | Inicio de sesión                     | Público         |
| POST   | `/auth/refresh`         | Renovación de tokens                 | Público         |
| POST   | `/auth/logout`          | Cierre de sesión                     | Público         |
| POST   | `/auth/social`          | Login social (Google/Facebook/GitHub)| Público         |
| GET    | `/auth/me`              | Usuario actual                       | Autenticado     |
| GET    | `/products`             | Listar productos (buscar/categoría/orden) | Público   |
| GET    | `/products/:id`         | Detalle de producto                  | Público         |
| POST   | `/products`             | Crear producto                       | admin, editor   |
| PUT    | `/products/:id`         | Actualizar producto                  | admin, editor   |
| DELETE | `/products/:id`         | Eliminar producto                    | admin, editor   |
| GET    | `/categories`           | Listar categorías                    | Público         |
| POST/PUT/DELETE | `/categories`… | CRUD de categorías                   | admin, editor   |
| GET    | `/users`                | Listar usuarios                      | admin           |
| PATCH  | `/users/:id/role`       | Cambiar rol                          | admin           |
| DELETE | `/users/:id`            | Eliminar usuario                     | admin           |
| POST   | `/contact`              | Enviar mensaje de contacto           | Público         |
| POST   | `/uploads`              | Subir imagen de producto             | admin, editor   |

Ver la referencia completa en [`docs/documentacion-api.md`](docs/documentacion-api.md).

---

## Pruebas

Se validó la **versión web** con **ego-browser** (ver `docs/arquitectura.md` y la
carpeta de scripts de prueba). Se verificó:

- Portada, catálogo, detalle y contacto.
- Búsqueda y ordenamiento.
- Registro, validaciones, email duplicado, login válido/inválido.
- Protección de rutas y persistencia de sesión.
- CRUD de productos (crear/editar/eliminar) y gestión de usuarios.
- Responsive en 1366×768, 768×1024 y 390×844 (sin scroll horizontal).

Para repetirlas:

```powershell
# con backend y frontend web corriendo
ego-browser nodejs -e "await import('file:///C:/ruta/al/script.mjs')"
```

> **Limitación:** ego-browser valida la **web**. El **APK Android** requiere
> validación aparte (Maestro/Appium o prueba manual) y generación con EAS Build.

---

## Limitaciones conocidas

- **Pagos**: no implementados por alcance; la arquitectura está preparada.
- **Login social**: el flujo está implementado, pero requiere credenciales
  reales de cada proveedor (Google/Facebook/GitHub). Sin ellas, los botones
  muestran un mensaje informativo.
- **APK**: requiere cuenta de Expo/EAS para compilarse.

---

## Documentación

- [`docs/manual-usuario.md`](docs/manual-usuario.md)
- [`docs/guia-instalacion.md`](docs/guia-instalacion.md)
- [`docs/documentacion-api.md`](docs/documentacion-api.md)
- [`docs/arquitectura.md`](docs/arquitectura.md)
