// Componente raíz: arma la pantalla usando el componente Contador.
// Dependencias: ./components/Contador, ./App.css
import Contador from "./components/Contador";
import "./App.css";

function App() {
    return (
        <main className="contenedor">
            <Contador />
        </main>
    );
}

export default App;

