// ListaUsuarios: página que muestra todos los usuarios.
// Propósito: cargar la lista desde la API (useEffect + axios), mostrar cada usuario
// con enlace a su detalle y botones de editar/eliminar (con modal de confirmación).
// Dependencias: react (useState, useEffect), react-router-dom, api, tipos.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { obtenerMensajeError } from "../modules/api";
import type { Usuario } from "../modules/tipos";
import { useAuth } from "../context/AuthContext";

function ListaUsuarios() {
    const { usuario: usuarioActual } = useAuth();
    const esAdmin = usuarioActual?.rol === "admin";

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);

    // Carga la lista de usuarios desde la API.
    const cargarUsuarios = async () => {
        setCargando(true);
        setError("");
        try {
            const respuesta = await api.get<Usuario[]>("/usuarios");
            setUsuarios(respuesta.data);
        } catch (err) {
            setError(obtenerMensajeError(err));
        } finally {
            setCargando(false);
        }
    };

    // useEffect: carga los usuarios al montar la página.
    useEffect(() => {
        cargarUsuarios();
    }, []);

    // Elimina el usuario confirmado y recarga la lista.
    const confirmarEliminar = async () => {
        if (!usuarioAEliminar) return;
        try {
            await api.delete(`/usuarios/${usuarioAEliminar.id}`);
            setUsuarioAEliminar(null);
            cargarUsuarios();
        } catch (err) {
            setError(obtenerMensajeError(err));
        }
    };

    return (
        <div className="contenedor">
            <div className="fila mb-2">
                <h1 className="titulo" style={{ marginBottom: 0 }}>
                    Usuarios
                </h1>
                {/* El botón "Nuevo usuario" solo lo ve el admin. */}
                {esAdmin && (
                    <Link to="/crear" className="boton boton--primario">
                        Nuevo usuario
                    </Link>
                )}
            </div>

            {cargando && <p className="detalle__campo">Cargando...</p>}
            {error && <p className="error mb-1">{error}</p>}

            {!cargando && usuarios.length === 0 && (
                <p className="detalle__campo">No hay usuarios registrados.</p>
            )}

            <ul className="lista">
                {usuarios.map((usuario) => (
                    <li key={usuario.id} className="usuario-item">
                        <div className="usuario-item__info">
                            <Link
                                to={`/usuario/${usuario.id}`}
                                className="usuario-item__nombre"
                                style={{ textDecoration: "none" }}
                            >
                                {usuario.nombre}
                            </Link>
                            <span className="usuario-item__email">
                                {usuario.email}
                            </span>
                        </div>
                        {/* Botones de acción: visibles para admin o para el dueño de la cuenta. */}
                        {(esAdmin || usuario.id === usuarioActual?.id) && (
                            <div className="usuario-item__acciones">
                                <Link
                                    to={`/editar/${usuario.id}`}
                                    className="boton boton--secundario"
                                >
                                    Editar
                                </Link>
                                <button
                                    className="boton boton--peligro"
                                    onClick={() => setUsuarioAEliminar(usuario)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {/* Modal de confirmación de eliminación (sin alert()). */}
            {usuarioAEliminar && (
                <div className="modal-fondo">
                    <div className="modal">
                        <h2 className="titulo">¿Eliminar usuario?</h2>
                        <p className="detalle__campo mb-1">
                            ¿Estás seguro de que querés eliminar a{" "}
                            <strong>{usuarioAEliminar.nombre}</strong>? Esta
                            acción no se puede deshacer.
                        </p>
                        <div className="modal__acciones">
                            <button
                                className="boton boton--secundario"
                                onClick={() => setUsuarioAEliminar(null)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="boton boton--peligro"
                                onClick={confirmarEliminar}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListaUsuarios;
