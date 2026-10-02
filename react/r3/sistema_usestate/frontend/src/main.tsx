// Punto de entrada de la aplicación.
// Propósito: montar <App /> dentro de <AuthProvider> (contexto de autenticación).
// Nota: este sistema NO usa React Router (la navegación se hace con useState).
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)

