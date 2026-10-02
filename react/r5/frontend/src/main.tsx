// Punto de entrada de la aplicación.
// Propósito: montar <App /> dentro de <Auth0Provider> (login social OAuth 2.0),
// <BrowserRouter> (enrutamiento) y <AuthProvider> (contexto de autenticación global).
// Nota: sin StrictMode, porque su doble montaje interfiere con el redirect callback de Auth0.
// Dependencias: react-dom/client, react-router-dom, @auth0/auth0-react, App, AuthContext.
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain="dev-tbn8w11v62ipodup.us.auth0.com"
    clientId="KRAXo1q5KjEJnyokbZI1cpziE5hlBuKs"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
    cacheLocation="localstorage"
    onRedirectCallback={(appState) => {
      window.history.replaceState({}, document.title, appState?.returnTo || "/");
    }}
  >
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </Auth0Provider>,
)

