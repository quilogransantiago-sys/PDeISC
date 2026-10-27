# AGENTS.md — Little Chochi

Guía para agentes que trabajen en este repositorio.

## Estructura

- `frontend/` — Expo SDK 58 + React Native + TypeScript + Expo Router.
  - Las rutas viven en `frontend/src/app/`. No pongas código de ruteo fuera de ahí.
  - `frontend/src/components/`, `context/`, `modules/`, `styles/`.
- `backend/` — Node.js + Express (módulos ES) + MySQL (`mysql2`).
  - `backend/src/routes`, `controllers`, `middleware`, `utilidades`.
  - `backend/database/schema.sql` es la fuente del esquema (3FN).
- `docs/` — documentación en español.

## Comandos

```bash
# Backend
cd backend && npm install && npm run seed && npm run dev

# Frontend (usá Node 24; Expo SDK 58 no soporta Node 25)
cd frontend && npm install && npm run web
cd frontend && npx tsc --noEmit          # typecheck
cd frontend && npx eslint src            # lint
```

## Convenciones

- **No toques** `frontend/ios/` ni `frontend/android/` (generados por CNG).
- Agregá dependencias de Expo con `npx expo install <pkg>` (versiones
  compatibles con el SDK).
- El frontend consume el backend solo por la API REST (`EXPO_PUBLIC_API_URL`).
- Mantené los textos en español y los precios en pesos (formato `$ 4.500`).
- Antes de dar por terminado un cambio: `tsc --noEmit` y `eslint` sin errores.

## Paleta de marca (del logo real)

- Crema `#EEE3DF`, verde azulado `#1A92A6`, coral `#E37369`, celeste `#A4BCE8`,
  amarillo `#F5C159`. Ver `frontend/src/styles/theme.ts`.
