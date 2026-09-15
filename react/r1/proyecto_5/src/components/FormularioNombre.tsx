// FormularioNombre: captura el nombre de un usuario y muestra un mensaje de bienvenida.
// Dependencias: react (hook useState), ../styles/FormularioNombre.css
// Conceptos clave:
//  1) Estado (useState) para guardar lo que el usuario escribe en el input.
//  2) "Input controlado": el valor del input depende del estado, y cada tecla
//     lo actualiza con onChange. Así el estado y lo que se ve están sincronizados.
//  3) onSubmit + preventDefault(): evita que el formulario recargue la página.
import { useState } from "react";
import "./../styles/FormularioNombre.css";

function FormularioNombre() {
    // Estado del nombre: guarda el texto que escribe el usuario.
    const [nombre, setNombre] = useState("");

    // Estado "enviado": controla si ya se envió el formulario.
    // true = mostrar el mensaje de bienvenida; false = mostrar el formulario.
    const [enviado, setEnviado] = useState(false);

    // Estado auxiliar: mensaje de error visible en pantalla (sin alert()).
    const [error, setError] = useState("");

    // Se ejecuta al enviar el formulario (botón "Enviar" o tecla Enter).
    const manejarEnvio = (evento: React.FormEvent<HTMLFormElement>) => {
        // Evita que el navegador recargue la página (comportamiento por defecto).
        evento.preventDefault();

        // Validación: el nombre no puede estar vacío (solo espacios).
        if (nombre.trim() === "") {
            setError("Escribí tu nombre antes de enviar.");
            return;
        }

        // Todo ok: marca como enviado y limpia el error.
        setEnviado(true);
        setError("");
    };

    // Vuelve al formulario para escribir otro nombre.
    const volverAEditar = () => {
        setEnviado(false);
        setNombre("");
        setError("");
    };

    return (
        <section className="formulario">
            {/* Si ya se envió, muestra la bienvenida; si no, muestra el formulario. */}
            {enviado ? (
                <div className="formulario__bienvenida">
                    <h1 className="formulario__mensaje">
                        Bienvenido/a, {nombre}
                    </h1>
                    <button
                        className="formulario__boton formulario__boton--secundario"
                        onClick={volverAEditar}
                    >
                        Ingresar otro nombre
                    </button>
                </div>
            ) : (
                <form
                    className="formulario__form"
                    onSubmit={manejarEnvio}
                >
                    <h1 className="formulario__titulo">Ingresá tu nombre</h1>

                    <input
                        className="formulario__entrada"
                        type="text"
                        placeholder="Tu nombre"
                        value={nombre}
                        onChange={(evento) => setNombre(evento.target.value)}
                    />

                    {/* Mensaje de error visible en pantalla (sin alert()). */}
                    {error && <p className="formulario__error">{error}</p>}

                    <button className="formulario__boton" type="submit">
                        Enviar
                    </button>
                </form>
            )}
        </section>
    );
}

export default FormularioNombre;
