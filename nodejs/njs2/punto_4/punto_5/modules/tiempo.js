// Obtiene clima automático vía wttr.in
export async function obtenerClima() {
    const res = await fetch('https://wttr.in?format=j1');
    if (!res.ok) throw new Error('Error al obtener clima');
    const data = await res.json();
    const temp = data.current_condition[0].temp_C;
    const desc = data.current_condition[0].weatherDesc[0].value;
    return { temp, desc };
}