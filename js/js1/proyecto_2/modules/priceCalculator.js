/**
 * priceCalculator.js - Catálogo y lógica de precios
 */

export const modelCatalog = [
    { id: "11", name: "iPhone 11", basePrice: 200, baseStorage: 64 },
    { id: "11pro", name: "iPhone 11 Pro", basePrice: 260, baseStorage: 64 },
    { id: "11promax", name: "iPhone 11 Pro Max", basePrice: 300, baseStorage: 64 },
    { id: "12mini", name: "iPhone 12 mini", basePrice: 220, baseStorage: 64 },
    { id: "12", name: "iPhone 12", basePrice: 280, baseStorage: 64 },
    { id: "12pro", name: "iPhone 12 Pro", basePrice: 350, baseStorage: 64 },
    { id: "12promax", name: "iPhone 12 Pro Max", basePrice: 400, baseStorage: 64 },
    { id: "13mini", name: "iPhone 13 mini", basePrice: 300, baseStorage: 128 },
    { id: "13", name: "iPhone 13", basePrice: 380, baseStorage: 128 },
    { id: "13pro", name: "iPhone 13 Pro", basePrice: 480, baseStorage: 128 },
    { id: "13promax", name: "iPhone 13 Pro Max", basePrice: 550, baseStorage: 128 },
    { id: "14", name: "iPhone 14", basePrice: 450, baseStorage: 128 },
    { id: "14plus", name: "iPhone 14 Plus", basePrice: 500, baseStorage: 128 },
    { id: "14pro", name: "iPhone 14 Pro", basePrice: 580, baseStorage: 128 },
    { id: "14promax", name: "iPhone 14 Pro Max", basePrice: 650, baseStorage: 128 },
    { id: "15", name: "iPhone 15", basePrice: 550, baseStorage: 128 },
    { id: "15plus", name: "iPhone 15 Plus", basePrice: 600, baseStorage: 128 },
    { id: "15pro", name: "iPhone 15 Pro", basePrice: 750, baseStorage: 128 },
    { id: "15promax", name: "iPhone 15 Pro Max", basePrice: 850, baseStorage: 128 },
    { id: "16e", name: "iPhone 16e", basePrice: 600, baseStorage: 128 },
    { id: "16", name: "iPhone 16", basePrice: 750, baseStorage: 128 },
    { id: "16plus", name: "iPhone 16 Plus", basePrice: 800, baseStorage: 128 },
    { id: "16pro", name: "iPhone 16 Pro", basePrice: 1000, baseStorage: 128 },
    { id: "16promax", name: "iPhone 16 Pro Max", basePrice: 1200, baseStorage: 128 },
    { id: "17e", name: "iPhone 17e", basePrice: 650, baseStorage: 256 },
    { id: "17", name: "iPhone 17", basePrice: 850, baseStorage: 256 },
    { id: "17air", name: "iPhone 17 Air", basePrice: 1000, baseStorage: 256 },
    { id: "17pro", name: "iPhone 17 Pro", basePrice: 1300, baseStorage: 256 },
    { id: "17promax", name: "iPhone 17 Pro Max", basePrice: 1500, baseStorage: 256 }
];

export function getModelById(modelId) {
    return modelCatalog.find(m => m.id === modelId);
}

export function getStorageExtra(baseStorage, selectedStorage) {
    if (selectedStorage <= baseStorage) return 0;
    const diffGB = selectedStorage - baseStorage;
    const steps = diffGB / 64;
    return steps * 30;
}

export function getConditionMultiplier(condition) {
    switch (condition) {
        case 'sealed': return 1.18;
        case 'gradeA': return 1.0;
        case 'gradeB': return 0.9;
        case 'gradeC': return 0.65;
        default: return 1.0;
    }
}

export function getBatteryAdjustment(batteryValue) {
    const val = parseInt(batteryValue);
    if (val === 100) return 40;
    if (val === 95) return 0;
    if (val === 87) return -30;
    if (val === 82) return -60;
    if (val === 70) return -100;
    return 0;
}

export function calculateTotalPrice(params) {
    const { modelId, saleType, quantity, selectedStorage, condition, batteryValue } = params;
    const model = getModelById(modelId);
    if (!model) return { total: 0, error: "Modelo no válido" };

    // Mayorista: mínimo 4 unidades
    if (saleType === 'wholesale' && quantity < 4) {
        return { total: 0, error: "Mayorista requiere al menos 4 unidades" };
    }

    let basePrice = model.basePrice;
    const storageExtra = getStorageExtra(model.baseStorage, selectedStorage);
    let priceAfterStorage = basePrice + storageExtra;

    let margin = saleType === 'retail' ? 0.30 : 0.10;
    const priceWithMargin = priceAfterStorage * (1 + margin);
    const condMultiplier = getConditionMultiplier(condition);
    const priceAfterCondition = priceWithMargin * condMultiplier;
    const batteryAdj = getBatteryAdjustment(batteryValue);
    const priceAfterBattery = priceAfterCondition + batteryAdj;
    const total = priceAfterBattery * quantity;

    const breakdown = {
        basePrice,
        storageExtra,
        marginPercent: margin * 100,
        conditionMultiplier: condMultiplier,
        batteryAdjust: batteryAdj,
        quantity,
        unitFinal: priceAfterBattery,
        total
    };
    return { total, breakdown, error: null };
}
