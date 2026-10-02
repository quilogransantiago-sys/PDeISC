// App: componente raíz del portfolio.
// Propósito: definir las rutas: "/" (portfolio público) y "/admin" (panel).
// Dependencias: react-router-dom, AuthContext, las páginas.
import { Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import LoginAdmin from "./pages/LoginAdmin";
import AdminPanel from "./pages/AdminPanel";

function App() {
    const { autenticado } = useAuth();

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            {/* /admin muestra el panel si está autenticado; si no, el login. */}
            <Route
                path="/admin"
                element={autenticado ? <AdminPanel /> : <LoginAdmin />}
            />
        </Routes>
    );
}

export default App;

