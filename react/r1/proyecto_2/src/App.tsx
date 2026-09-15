// Componente raíz: muestra una tarjeta de presentación de ejemplo.
// Dependencias: ./components/TarjetaPresentacion, ./App.css, ./assets/avatar.svg
import TarjetaPresentacion from "./components/TarjetaPresentacion";
import avatar from "./assets/avatar.svg";
import "./App.css";

function App() {
    return (
        <main className="contenedor">
            {/* Los datos viajan por props hacia el componente. */}
            <TarjetaPresentacion
                nombre="Santiago"
                apellido="Quilogran"
                profesion="Desarrollador Web"
                imagen={avatar}
            />
        </main>
    );
}

export default App;