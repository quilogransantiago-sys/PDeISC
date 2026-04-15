// modules/clima.js
// Módulo funcional que obtiene la temperatura actual de Mar del Plata usando Open-Meteo API

// Coordenadas de Mar del Plata (aproximadas)
const LAT = -38.0055;
const LON = -57.5426;

// Función que obtiene el clima actual desde la API
async function obtenerClimaReal() {
    try {
        // Llamada a la API de Open-Meteo (sin key, gratuita)
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&timezone=auto`;
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        const climaActual = datos.current_weather;

        // La API devuelve temperatura en °C, velocidad del viento, etc.
        return {
            ciudad: "Mar del Plata",
            temperatura: climaActual.temperature,
            viento: climaActual.windspeed,
            codigoClima: climaActual.weathercode,
            // Podemos traducir el código de clima a texto
            estado: traducirClima(climaActual.weathercode)
        };
    } catch (error) {
        console.error("Error al obtener el clima:", error.message);
        // En caso de error, devolvemos datos simulados para no romper la app
        return {
            ciudad: "Mar del Plata",
            temperatura: 20,
            viento: 10,
            codigoClima: 0,
            estado: "no disponible (error de conexión)"
        };
    }
}

// Función auxiliar para traducir el código de clima de Open-Meteo
function traducirClima(codigo) {
    // Códigos comunes: 0 = despejado, 1 = mayormente despejado, 2 = parcialmente nublado, 3 = nublado, 45 = niebla, 51 = llovizna, etc.
    const mapa = {
        0: "Despejado",
        1: "Mayormente despejado",
        2: "Parcialmente nublado",
        3: "Nublado",
        45: "Niebla",
        51: "Llovizna ligera",
        61: "Lluvia moderada",
        71: "Nevada ligera",
        80: "Lluvia intensa"
    };
    return mapa[codigo] || "Clima variable";
}

// Función que indica si hace calor (más de 25°C)
function esCaluroso(temp) {
    return temp > 25;
}

export { obtenerClimaReal, esCaluroso };