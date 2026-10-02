// App: componente raíz del frontend (sistema con useState, sin React Router).
// Propósito: manejar la "vista" actual con useState y renderizar la pantalla
// correspondiente (login, registro, lista, detalle, crear, editar).
// Dependencias: react (useState), AuthContext, useTema, las páginas.
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useTema } from "./scripts/useTema";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import ListaUsuarios from "./pages/ListaUsuarios";
import DetalleUsuario from "./pages/DetalleUsuario";
import FormularioUsuario from "./pages/FormularioUsuario";

// Tipo que describe las posibles vistas de la aplicación.
type Vista = "login" | "registro" | "lista" | "detalle" | "crear" | "editar";

function App() {
    const { usuario, cerrarSesion } = useAuth();
    const { tema, alternarTema } = useTema();

    // Estado de la vista actual (navegación con useState, sin router).
    const [vista, setVista] = useState<Vista>("lista");
    // Id del usuario seleccionado (para detalle/edición).
    const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);

    // Si no hay sesión y la vista no es login/registro, se fuerza el login.
    const vistaActual: Vista =
        !usuario && vista !== "login" && vista !== "registro" ? "login" : vista;

    // Funciones de navegación (cambian la vista).
    const irALista = () => {
        setIdSeleccionado(null);
        setVista("lista");
    };
    const irADetalle = (id: number) => {
        setIdSeleccionado(id);
        setVista("detalle");
    };
    const irACrear = () => setVista("crear");
    const irAEditar = (id: number) => {
        setIdSeleccionado(id);
        setVista("editar");
    };
    const irALogin = () => setVista("login");
    const irARegistro = () => setVista("registro");

    // Cierra sesión y vuelve al login.
    const cerrar = () => {
        cerrarSesion();
        setVista("login");
    };

    // Renderiza la vista actual.
    const renderVista = () => {
        switch (vistaActual) {
            case "login":
                return (
                    <Login
                        onExito={irALista}
                        irARegistro={irARegistro}
                    />
                );
            case "registro":
                return <Registro onExito={irALista} irALogin={irALogin} />;
            case "lista":
                return (
                    <ListaUsuarios
                        onVerDetalle={irADetalle}
                        onEditar={irAEditar}
                        onCrear={irACrear}
                    />
                );
            case "detalle":
                return (
                    <DetalleUsuario
                        id={idSeleccionado ?? 0}
                        onVolver={irALista}
                        onEditar={irAEditar}
                    />
                );
            case "crear":
                return (
                    <FormularioUsuario
                        onGuardado={irALista}
                        onCancelar={irALista}
                    />
                );
            case "editar":
                return (
                    <FormularioUsuario
                        id={idSeleccionado ?? undefined}
                        onGuardado={irALista}
                        onCancelar={irALista}
                    />
                );
            default:
                return null;
        }
    };

    return (
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
                                onClick={cerrar}
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

            {renderVista()}
        </>
    );
}

export default App;

