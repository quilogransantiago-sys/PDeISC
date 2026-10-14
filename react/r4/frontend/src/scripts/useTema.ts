// useTema: hook para alternar entre tema claro y oscuro.
import { useEffect, useState } from "react";

export function useTema() {
    const [tema, setTema] = useState<"claro" | "oscuro">(() => {
        return localStorage.getItem("tema") === "oscuro" ? "oscuro" : "claro";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-tema", tema);
        localStorage.setItem("tema", tema);
    }, [tema]);

    const alternarTema = () => setTema((t) => (t === "claro" ? "oscuro" : "claro"));

    return { tema, alternarTema };
}
