// componenteClimaCalculo.js
import { sumar, restar, multiplicar, dividir, promedio } from './modules/calculo.js';
import { obtenerClimaReal, esCaluroso } from './modules/clima.js';

// Este componente es asíncrono porque obtiene datos reales de la API
async function reporteClimaYCalculos(numA, numB, listaNumeros) {
    // Obtener clima real de Mar del Plata
    const climaInfo = await obtenerClimaReal();

    // Realizar operaciones matemáticas
    const suma = sumar(numA, numB);
    const resta = restar(numA, numB);
    const producto = multiplicar(numA, numB);
    let division;
    try {
        division = dividir(numA, numB);
    } catch (error) {
        division = error.message;
    }
    const prom = promedio(listaNumeros);
    const caluroso = esCaluroso(climaInfo.temperatura);

    // Generar reporte en texto plano (luego lo usaremos para mostrarlo en HTML)
    const mensaje = `
    ===== REPORTE INTEGRADO CON CLIMA REAL =====
    Ciudad: ${climaInfo.ciudad}
    Temperatura actual: ${climaInfo.temperatura}°C
    Estado: ${climaInfo.estado}
    Viento: ${climaInfo.viento} km/h
    ¿Caluroso? ${caluroso ? "Sí" : "No"}
    
    Operaciones con ${numA} y ${numB}:
    - Suma: ${suma}
    - Resta: ${resta}
    - Multiplicación: ${producto}
    - División: ${division}
    
    Promedio de [${listaNumeros.join(", ")}] = ${prom}
    ==============================================
    `;
    return mensaje;
}

export default reporteClimaYCalculos;