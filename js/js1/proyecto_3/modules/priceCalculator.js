// priceCalculator.js - Todas las reglas de negocio
export const modelos = {
    "11": { base: 200, minGB: 64, maxGB: 256 },
    "11 pro": { base: 260, minGB: 64, maxGB: 512 },
    "11 pro max": { base: 300, minGB: 64, maxGB: 512 },
    "12 mini": { base: 220, minGB: 64, maxGB: 256 },
    "12": { base: 280, minGB: 64, maxGB: 256 },
    "12 pro": { base: 350, minGB: 64, maxGB: 512 },
    "12 pro max": { base: 400, minGB: 64, maxGB: 512 },
    "13 mini": { base: 300, minGB: 128, maxGB: 512 },
    "13": { base: 380, minGB: 128, maxGB: 512 },
    "13 pro": { base: 480, minGB: 128, maxGB: 1024 },
    "13 pro max": { base: 550, minGB: 128, maxGB: 1024 },
    "14": { base: 450, minGB: 128, maxGB: 512 },
    "14 plus": { base: 500, minGB: 128, maxGB: 512 },
    "14 pro": { base: 580, minGB: 128, maxGB: 1024 },
    "14 pro max": { base: 650, minGB: 128, maxGB: 1024 },
    "15": { base: 550, minGB: 128, maxGB: 512 },
    "15 plus": { base: 600, minGB: 128, maxGB: 512 },
    "15 pro": { base: 750, minGB: 128, maxGB: 1024 },
    "15 pro max": { base: 850, minGB: 128, maxGB: 1024 },
    "16e": { base: 600, minGB: 128, maxGB: 512 },
    "16": { base: 750, minGB: 128, maxGB: 512 },
    "16 plus": { base: 800, minGB: 128, maxGB: 512 },
    "16 pro": { base: 1000, minGB: 128, maxGB: 1024 },
    "16 pro max": { base: 1200, minGB: 128, maxGB: 1024 }
};

export function calcularPrecio(params) {
    let { modeloKey, condicion, tipoCliente, grado, almacenamientoGB, bateriaPorcentaje, cantidad } = params;
    const modelo = modelos[modeloKey];
    if (!modelo) return 0;
    let precio = modelo.base;

    // 1. Ajuste por condición y grado
    if (condicion === 'sellado') {
        precio *= 1.175; // +17.5% (promedio 15-20%)
    } else {
        switch (grado) {
            case 'A': break;
            case 'B': precio *= 0.9; break;
            case 'C': precio *= 0.65; break;
        }
    }

    // 2. Ajuste por tipo de cliente
    if (tipoCliente === 'minorista') precio *= 1.3;
    else precio *= 1.1; // mayorista

    // 3. Ajuste por batería
    const ajustesBateria = { '100': 40, '95': 0, '87': -30, '82': -60, '50': -100 };
    precio += ajustesBateria[bateriaPorcentaje] || 0;

    // 4. Ajuste por almacenamiento extra
    const extraGB = almacenamientoGB - modelo.minGB;
    if (extraGB > 0) {
        if (almacenamientoGB === 128) precio += 30;
        else if (almacenamientoGB === 256) precio += 60;
        else if (almacenamientoGB >= 512) precio += 120;
    }

    const precioUnidad = Math.round(precio);
    const precioTotal = precioUnidad * cantidad;
    return { precioUnidad, precioTotal };
}