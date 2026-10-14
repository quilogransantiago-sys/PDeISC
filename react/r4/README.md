# R4 — Portfolio Personal

Portfolio personal con **panel de administración**. El visitante ve el portfolio (datos, habilidades, experiencias, proyectos, logros y contacto), y un **admin** puede crear/editar/eliminar cada sección y subir imágenes.

## Stack

- **Backend:** Node.js + Express + MySQL/MariaDB (XAMPP) + JWT + bcryptjs + Multer (subida de imágenes).
- **Frontend:** React + TypeScript + Vite + React Router + Framer Motion (animaciones) + Axios.

## Estructura

```
r4/
├── backend/                 # API en Express (puerto 5000)
│   ├── database/schema.sql  # script de creación (referencia)
│   ├── database/seed.mjs    # crea BD + tablas + admin (node database/seed.mjs)
│   ├── src/
│   │   ├── controllers/authController.js      # login del admin
│   │   ├── controllers/portfolioController.js # CRUD genérico + subida de imagen
│   │   ├── middleware/autenticar.js           # valida JWT
│   │   └── ...
│   └── .env.example
└── frontend/                # SPA en Vite (puerto 3002)
    ├── src/
    │   ├── context/AuthContext.tsx  # sesión del admin
    │   ├── pages/Home.tsx           # portfolio público
    │   ├── pages/LoginAdmin.tsx     # login del admin
    │   └── pages/AdminPanel.tsx     # panel de administración
    └── vite.config.ts
```

## Requisitos

1. **Node.js** (18+).
2. **MySQL/MariaDB** corriendo (XAMPP), usuario `root` sin contraseña.

## 1) Backend

```bash
cd r4/backend
npm install
cp .env.example .env          # o copialo manualmente en Windows
node database/seed.mjs        # crea la BD, las tablas y el admin
npm run dev                   # arranca en http://localhost:5000
```

Variables de entorno (`.env`):

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=portfolio_r4
JWT_SECRET=clave_secreta_portfolio_r4
PORT=5000
```

### Credenciales de prueba

| Rol   | Email            | Contraseña |
|-------|------------------|------------|
| Admin | `admin@admin.com`| `admin123` |

## 2) Frontend

```bash
cd r4/frontend
npm install
npm run dev                   # arranca en http://localhost:3002
```

- **Portfolio público:** http://localhost:3002
- **Panel admin:** http://localhost:3002/admin

## Secciones del portfolio

El admin puede editar 5 secciones (cada una es una tabla en la BD):

| Sección     | Tabla         | Campos |
|-------------|---------------|--------|
| Datos personales | `datos` | nombre, profesión, bio, email, foto, linkedin, github |
| Habilidades | `habilidades` | nombre, nivel, imagen |
| Experiencias | `experiencias` | cargo, lugar, fecha, descripción |
| Proyectos   | `proyectos` | nombre, descripción, imagen, link |
| Logros      | `logros` | título, descripción, fecha |

## Endpoints del backend

| Método | Ruta                  | Descripción                              |
|--------|-----------------------|------------------------------------------|
| POST   | `/api/auth/login`     | Login del admin (devuelve JWT).          |
| GET    | `/api/:tabla`         | Lista pública de una sección.            |
| POST   | `/api/:tabla`         | Crea un registro (solo admin).           |
| PUT    | `/api/:tabla/:id`     | Actualiza un registro (solo admin).      |
| DELETE | `/api/:tabla/:id`     | Elimina un registro (solo admin).        |
| POST   | `/api/subir-imagen`   | Sube una imagen (solo admin).            |

Las imágenes subidas se sirven en `http://localhost:5000/uploads/...`.
