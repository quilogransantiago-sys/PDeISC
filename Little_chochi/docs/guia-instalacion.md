# Guía de instalación y configuración — Little Chochi

Guía para levantar el proyecto en **Windows** de forma local.

---

## 1. Requisitos

| Herramienta | Versión recomendada / nota |
| ----------- | -------------------------- |
| Node.js     | Se usó **Node 24** para el frontend (Expo SDK 58 pide Node `^22.13 \|\| ^24.3 \|\| ^26`). El backend funciona con Node 18+. |
| npm         | Incluido con Node. |
| XAMPP       | MySQL/MariaDB + Apache. |
| ego-browser | Para las pruebas de navegador (ego lite). |

> ⚠️ Con Node 25, npm muestra advertencias `EBADENGINE` para Expo/React Native
> (no bloqueantes), pero se recomienda Node 24 para evitar inconvenientes.

---

## 2. Base de datos (XAMPP)

1. Abrí el **Panel de control de XAMPP** e iniciá **MySQL** (y Apache si querés
   usar phpMyAdmin).
2. Verificá que el usuario `root` no tenga contraseña (default de XAMPP) o
   ajustá `DB_USER`/`DB_PASSWORD` en el `.env` del backend.
3. Importá el esquema (crea `little_chochi` y sus tablas):

   ```powershell
   C:\xampp\mysql\bin\mysql.exe -u root --default-character-set=utf8mb4 -e "source C:/ruta/al/proyecto/backend/database/schema.sql"
   ```

   (O abrí phpMyAdmin → Importar → `backend/database/schema.sql`.)

---

## 3. Backend

```powershell
cd backend
copy .env.example .env
npm install
npm run seed      # crea el admin y productos de ejemplo (idempotente)
npm run dev       # API en http://localhost:4000
```

`npm run start` usa Node directamente (sin nodemon).

### Variables de entorno (`backend/.env`)

```
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=little_chochi
JWT_SECRET=una-cadena-larga-y-aleatoria
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CORS_ORIGIN=http://localhost:8081,http://localhost:19006
WHATSAPP_NUMBER=5491100000000
# OAuth (opcional, para login social):
GOOGLE_CLIENT_ID=
FACEBOOK_CLIENT_ID=
GITHUB_CLIENT_ID=
```

---

## 4. Frontend

```powershell
cd frontend
copy .env.example .env
npm install
npm run web      # Expo Web en http://localhost:8081
```

Para el celular con **Expo Go**: `npm start` y escaneá el QR.

### Variables de entorno (`frontend/.env`)

```
EXPO_PUBLIC_API_URL=http://localhost:4000/api
EXPO_PUBLIC_WHATSAPP_NUMBER=5491100000000
```

> En un dispositivo físico, `localhost` apunta al teléfono. Usá la IP local de
> tu PC (ej. `http://192.168.0.10:4000/api`) y asegurate de que esté en
> `CORS_ORIGIN`.

---

## 5. Credenciales de demostración

- **Admin**: `admin@littlechochi.com` / `Admin123!`
- **Cliente**: registrate desde la app.

---

## 6. Login social (Google / Facebook / GitHub)

El flujo está implementado en backend (`POST /api/auth/social`) y en el
frontend, pero **requiere credenciales reales**:

1. Creá una app en cada proveedor y obtené `CLIENT_ID`/`CLIENT_SECRET`.
2. Cargalos en `backend/.env`.
3. En el frontend, configurá los `EXPO_PUBLIC_*` correspondientes y las URIs de
   redirección.

Sin credenciales, los botones sociales muestran un mensaje informativo y el
resto de la app sigue funcionando con email/contraseña.

---

## 7. Generar el APK Android (EAS Build)

El tutorial oficial: https://docs.expo.dev/tutorial/eas/introduction/

1. Instalá EAS CLI: `npm install -g eas-cli` (o `npx eas-cli@latest`).
2. Iniciá sesión: `eas login` (requiere cuenta de Expo).
3. Configurá: `eas build:configure`.
4. Compilá: `eas build -p android --profile preview` (APK de prueba).

> La APK requiere cuenta/credenciales de Expo. Si no las tenés, el proyecto
> queda listo para compilar pero **no** debe declararse la APK como generada.
