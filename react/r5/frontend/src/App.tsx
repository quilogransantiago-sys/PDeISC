// App: componente raíz del frontend (sistema con React Router).
// Propósito: definir el header global (con sesión y tema) y las rutas de la app.
// Dependencias: react-router-dom, AuthContext, useTema, las páginas.
import { Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "./context/AuthContext";
import { useTema } from "./scripts/useTema";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import ListaUsuarios from "./pages/ListaUsuarios";
import DetalleUsuario from "./pages/DetalleUsuario";
import FormularioUsuario from "./pages/FormularioUsuario";
import { RutaProtegida } from "./components/RutaProtegida";
import { ManejadorLoginSocial } from "./components/ManejadorLoginSocial";

function App() {
    const { usuario, cerrarSesion } = useAuth();
    const { tema, alternarTema } = useTema();
    const { isLoading: cargandoAuth0, logout } = useAuth0();

    // Cierra la sesión propia (JWT) y la de Auth0 (social), para que el
    // ManejadorLoginSocial no vuelva a loguear automáticamente.
    const manejarCerrarSesion = () => {
        cerrarSesion();
        logout({ openUrl: false });
    };

    return (
        <>
            {/* Completa el login social después del redirect de Auth0. */}
            <ManejadorLoginSocial />

            {cargandoAuth0 ? (
                <div className="contenedor--centrado">
                    <p className="detalle__campo">Cargando…</p>
                </div>
            ) : (
                <>
            {/* Header global: título + sesión + botón de tema. */}
            <header className="header">
                <span className="header__titulo">Sistema de Usuarios</span>
                <div className="header__acciones">
                    {usuario && (
                        <>
                            <span className="detalle__campo">
                                {usuario.nombre}
                                {usuario.rol === "admin" && " (admin)"}
                            </span>
                            <button
                                className="boton boton--secundario"
                                onClick={manejarCerrarSesion}
                            >
                                Cerrar sesión
                            </button>
                        </>
                    )}
                    <button
                        className="boton-tema"
                        onClick={alternarTema}
                        aria-label="Cambiar tema"
                    >
                        {tema === "claro" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                            </svg>
                        )}
                    </button>
                </div>
            </header>

            {/* Rutas de la aplicación. */}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route
                    path="/"
                    element={
                        <RutaProtegida>
                            <ListaUsuarios />
                        </RutaProtegida>
                    }
                />
                <Route
                    path="/usuario/:id"
                    element={
                        <RutaProtegida>
                            <DetalleUsuario />
                        </RutaProtegida>
                    }
                />
                <Route
                    path="/crear"
                    element={
                        <RutaProtegida>
                            <FormularioUsuario />
                        </RutaProtegida>
                    }
                />
                <Route
                    path="/editar/:id"
                    element={
                        <RutaProtegida>
                            <FormularioUsuario />
                        </RutaProtegida>
                    }
                />
            </Routes>
                </>
            )}
        </>
    );
}

export default App;

