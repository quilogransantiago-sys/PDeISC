// Componente raíz: arma la pantalla usando el componente ListaTareas.
// Dependencias: ./components/ListaTareas, ./App.css
import ListaTareas from "./components/ListaTareas";
import "./App.css";

function App() {
    return (
        <main className="contenedor">
            <ListaTareas />
        </main>
    );
}

export default App;

