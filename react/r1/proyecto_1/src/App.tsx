// Componente raíz: arma la pantalla usando el componente Saludo.
// Dependencias: ./components/Saludo, ./App.css
import Saludo from "./components/Saludo";
import "./App.css";

function App() {
    return (
        <main>
            <Saludo />
        </main>
    );
}

export default App;