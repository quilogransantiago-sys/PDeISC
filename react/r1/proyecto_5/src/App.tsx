// Componente raíz: arma la pantalla usando el componente FormularioNombre.
// Dependencias: ./components/FormularioNombre, ./App.css
import FormularioNombre from "./components/FormularioNombre";
import "./App.css";

function App() {
    return (
        <main className="contenedor">
            <FormularioNombre />
        </main>
    );
}

export default App;

