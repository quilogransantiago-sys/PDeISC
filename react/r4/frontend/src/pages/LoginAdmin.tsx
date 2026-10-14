// LoginAdmin: página de inicio de sesión del administrador.
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { obtenerMensajeError } from "../modules/api";

function LoginAdmin() {
    const { iniciarSesion } = useAuth();
    const [email, setEmail] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");

    const manejarEnvio = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await iniciarSesion(email, contrasena);
        } catch (err) {
            setError(obtenerMensajeError(err));
        }
    };

    return (
        <div className="contenedor--centrado">
            <form className="tarjeta tarjeta--estrecha formulario" onSubmit={manejarEnvio}>
                <h1 className="titulo">Acceso admin</h1>

                <label className="etiqueta">
                    Email
                    <input
                        type="email"
                        className="entrada"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@admin.com"
                    />
                </label>

                <label className="etiqueta">
                    Contraseña
                    <input
                        type="password"
                        className="entrada"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        placeholder="••••••"
                    />
                </label>

                {error && <p className="error">{error}</p>}

                <button className="boton boton--primario" type="submit">
                    Entrar
                </button>

                <p className="detalle__campo">
                    <Link to="/" className="boton--enlace">Volver al portfolio</Link>
                </p>
            </form>
        </div>
    );
}

export default LoginAdmin;
