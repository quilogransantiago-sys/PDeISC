// ListaUsuarios: vista que muestra todos los usuarios (sin React Router).
// Propósito: cargar la lista desde la API (useEffect + axios) y exponer
// acciones (ver detalle, editar, crear) mediante callbacks al padre.
// Dependencias: react (useState, useEffect), api, tipos.
import { useEffect, useState } from "react";
import api, { obtenerMensajeError } from "../modules/api";
import type { Usuario } from "../modules/tipos";
import { useAuth } from "../context/AuthContext";

interface PropsLista {
    onVerDetalle: (id: number) => void;
    onEditar: (id: number) => void;
    onCrear: () => void;
}

function ListaUsuarios({ onVerDetalle, onEditar, onCrear }: PropsLista) {
    const { usuario: usuarioActual } = useAuth();
    const esAdmin = usuarioActual?.rol === "admin";

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);

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

    useEffect(() => {
        cargarUsuarios();
    }, []);

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
                <h1 className="titulo" style={{ marginBottom: 0 }}>Usuarios</h1>
                {esAdmin && (
                    <button className="boton boton--primario" onClick={onCrear}>
                        Nuevo usuario
                    </button>
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
                            <button
                                className="boton--enlace usuario-item__nombre"
                                onClick={() => onVerDetalle(usuario.id)}
                            >
                                {usuario.nombre}
                            </button>
                            <span className="usuario-item__email">{usuario.email}</span>
                        </div>
                        {(esAdmin || usuario.id === usuarioActual?.id) && (
                            <div className="usuario-item__acciones">
                                <button
                                    className="boton boton--secundario"
                                    onClick={() => onEditar(usuario.id)}
                                >
                                    Editar
                                </button>
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
