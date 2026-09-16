// Creacion: página con un formulario para crear O editar una tarea.
// Propósito: capturar título y descripción. Si hay un id en la URL (modo edición),
// carga la tarea y la actualiza; si no, crea una tarea nueva.
// Dependencias: react (useState), react-router-dom (useNavigate, useParams, Link),
//               tipo Tarea.
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Tarea } from "../modules/datosTareas";

// Datos que recibe la página por props: la lista y las funciones de alta/edición.
interface PropsCreacion {
    tareas: Tarea[];
    agregarTarea: (tarea: Tarea) => void;
    actualizarTarea: (tarea: Tarea) => void;
}

function Creacion({ tareas, agregarTarea, actualizarTarea }: PropsCreacion) {
    // Hook para navegar programáticamente después de guardar.
    const navigate = useNavigate();

    // useParams lee el "id" de la URL. En /crear no existe (undefined);
    // en /editar/:id trae el id de la tarea a editar.
    const { id } = useParams();

    // Busca la tarea a editar (solo en modo edición). Si no hay id, es undefined.
    const tareaEditar = id
        ? tareas.find((tarea) => tarea.id === Number(id))
        : undefined;

    // true si estamos editando una tarea existente.
    const esEdicion = Boolean(tareaEditar);

    // Estados del formulario (inputs controlados).
    // Se inicializan con los datos de la tarea a editar, o vacíos si es alta.
    const [titulo, setTitulo] = useState(tareaEditar?.titulo ?? "");
    const [descripcion, setDescripcion] = useState(
        tareaEditar?.descripcion ?? ""
    );

    // Estado auxiliar: mensaje de error visible en pantalla (sin alert()).
    const [error, setError] = useState("");

    // Se ejecuta al enviar el formulario.
    const manejarEnvio = (evento: React.FormEvent<HTMLFormElement>) => {
        // Evita la recarga de la página (comportamiento por defecto).
        evento.preventDefault();

        // Validación: el título no puede estar vacío.
        if (titulo.trim() === "") {
            setError("Escribí un título para la tarea.");
            return;
        }

        if (esEdicion && tareaEditar) {
            // CASO EDICIÓN: se actualiza la tarea conservando id, fecha y estado.
            actualizarTarea({
                ...tareaEditar,
                titulo: titulo.trim(),
                descripcion: descripcion.trim(),
            });
        } else {
            // CASO ALTA: se crea una tarea nueva (siempre incompleta).
            const nuevaTarea: Tarea = {
                id: Date.now(),
                titulo: titulo.trim(),
                descripcion: descripcion.trim(),
                fecha: new Date().toISOString().slice(0, 10), // fecha actual (YYYY-MM-DD)
                completada: false,
            };
            agregarTarea(nuevaTarea);
        }

        // Navega a la página de inicio para ver el resultado.
        navigate("/");
    };

    return (
        // Contenedor centrado vertical y horizontalmente, restando la altura
        // del header sticky para que no genere scroll.
        <div className="flex min-h-[calc(100vh-60px)] items-center justify-center px-4 py-8">
            <div className="w-full max-w-2xl">
                {/* Formulario dentro de una tarjeta con sombra. */}
                <form
                    onSubmit={manejarEnvio}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                    {/* Campo de título. */}
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Título
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Título de la tarea"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </label>

                    {/* Campo de descripción: textarea grande para ver mucho texto sin scroll. */}
                    <label className="mb-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Descripción
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Descripción de la tarea"
                            rows={8}
                            className="mt-1 block w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </label>

                    {/* Mensaje de error visible en pantalla (sin alert()). */}
                    {error && (
                        <p className="mb-4 text-sm text-red-600">{error}</p>
                    )}

                    {/* Botones. */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            {esEdicion ? "Guardar cambios" : "Guardar"}
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                // En edición vuelve al detalle; en creación, al inicio.
                                navigate(esEdicion ? `/tarea/${id}` : "/")
                            }
                            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                            Atrás
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Creacion;
