// ==============================
// iphoneData.js
// Contiene la información oficial de modelos, colores, capacidades y precios base (USD)
// ==============================

export const iphoneModels = [
    { id: "iphone_2g", name: "iPhone 2G", releaseYear: 2007, colors: ["Negro"], capacities: ["4GB", "8GB"], basePrice: 499 },
    { id: "iphone_3g", name: "iPhone 3G", releaseYear: 2008, colors: ["Negro", "Blanco"], capacities: ["8GB", "16GB"], basePrice: 599 },
    { id: "iphone_3gs", name: "iPhone 3GS", releaseYear: 2009, colors: ["Negro", "Blanco"], capacities: ["16GB", "32GB"], basePrice: 599 },
    { id: "iphone_4", name: "iPhone 4", releaseYear: 2010, colors: ["Negro", "Blanco"], capacities: ["16GB", "32GB"], basePrice: 649 },
    { id: "iphone_4s", name: "iPhone 4S", releaseYear: 2011, colors: ["Negro", "Blanco"], capacities: ["16GB", "32GB", "64GB"], basePrice: 649 },
    { id: "iphone_5", name: "iPhone 5", releaseYear: 2012, colors: ["Gris espacial", "Plateado"], capacities: ["16GB", "32GB", "64GB"], basePrice: 649 },
    { id: "iphone_5c", name: "iPhone 5c", releaseYear: 2013, colors: ["Azul", "Verde", "Rosa", "Amarillo", "Blanco"], capacities: ["16GB", "32GB"], basePrice: 549 },
    { id: "iphone_5s", name: "iPhone 5s", releaseYear: 2013, colors: ["Gris espacial", "Plateado", "Oro"], capacities: ["16GB", "32GB", "64GB"], basePrice: 649 },
    { id: "iphone_6", name: "iPhone 6", releaseYear: 2014, colors: ["Gris espacial", "Plateado", "Oro"], capacities: ["16GB", "64GB", "128GB"], basePrice: 649 },
    { id: "iphone_6plus", name: "iPhone 6 Plus", releaseYear: 2014, colors: ["Gris espacial", "Plateado", "Oro"], capacities: ["16GB", "64GB", "128GB"], basePrice: 749 },
    { id: "iphone_6s", name: "iPhone 6s", releaseYear: 2015, colors: ["Gris espacial", "Plateado", "Oro", "Rosa dorado"], capacities: ["32GB", "128GB"], basePrice: 649 },
    { id: "iphone_6splus", name: "iPhone 6s Plus", releaseYear: 2015, colors: ["Gris espacial", "Plateado", "Oro", "Rosa dorado"], capacities: ["32GB", "128GB"], basePrice: 749 },
    { id: "iphone_se", name: "iPhone SE (1ª gen)", releaseYear: 2016, colors: ["Gris espacial", "Plateado", "Oro", "Rosa dorado"], capacities: ["32GB", "128GB"], basePrice: 399 },
    { id: "iphone_7", name: "iPhone 7", releaseYear: 2016, colors: ["Negro", "Negro mate", "Plateado", "Oro", "Rosa dorado", "Rojo"], capacities: ["32GB", "128GB", "256GB"], basePrice: 649 },
    { id: "iphone_7plus", name: "iPhone 7 Plus", releaseYear: 2016, colors: ["Negro", "Negro mate", "Plateado", "Oro", "Rosa dorado", "Rojo"], capacities: ["32GB", "128GB", "256GB"], basePrice: 769 },
    { id: "iphone_8", name: "iPhone 8", releaseYear: 2017, colors: ["Gris espacial", "Plateado", "Oro"], capacities: ["64GB", "256GB"], basePrice: 699 },
    { id: "iphone_8plus", name: "iPhone 8 Plus", releaseYear: 2017, colors: ["Gris espacial", "Plateado", "Oro"], capacities: ["64GB", "256GB"], basePrice: 799 },
    { id: "iphone_x", name: "iPhone X", releaseYear: 2017, colors: ["Gris espacial", "Plateado"], capacities: ["64GB", "256GB"], basePrice: 999 },
    { id: "iphone_xr", name: "iPhone XR", releaseYear: 2018, colors: ["Blanco", "Negro", "Azul", "Amarillo", "Coral", "Rojo"], capacities: ["64GB", "128GB", "256GB"], basePrice: 749 },
    { id: "iphone_xs", name: "iPhone XS", releaseYear: 2018, colors: ["Gris espacial", "Plateado", "Oro"], capacities: ["64GB", "256GB", "512GB"], basePrice: 999 },
    { id: "iphone_xsmax", name: "iPhone XS Max", releaseYear: 2018, colors: ["Gris espacial", "Plateado", "Oro"], capacities: ["64GB", "256GB", "512GB"], basePrice: 1099 },
    { id: "iphone_11", name: "iPhone 11", releaseYear: 2019, colors: ["Blanco", "Negro", "Verde", "Amarillo", "Púrpura", "Rojo"], capacities: ["64GB", "128GB", "256GB"], basePrice: 699 },
    { id: "iphone_11pro", name: "iPhone 11 Pro", releaseYear: 2019, colors: ["Gris espacial", "Plateado", "Oro", "Verde medianoche"], capacities: ["64GB", "256GB", "512GB"], basePrice: 999 },
    { id: "iphone_11promax", name: "iPhone 11 Pro Max", releaseYear: 2019, colors: ["Gris espacial", "Plateado", "Oro", "Verde medianoche"], capacities: ["64GB", "256GB", "512GB"], basePrice: 1099 },
    { id: "iphone_se2", name: "iPhone SE (2ª gen)", releaseYear: 2020, colors: ["Blanco", "Negro", "Rojo"], capacities: ["64GB", "128GB", "256GB"], basePrice: 399 },
    { id: "iphone_12", name: "iPhone 12", releaseYear: 2020, colors: ["Blanco", "Negro", "Azul", "Verde", "Rojo", "Púrpura"], capacities: ["64GB", "128GB", "256GB"], basePrice: 799 },
    { id: "iphone_12mini", name: "iPhone 12 mini", releaseYear: 2020, colors: ["Blanco", "Negro", "Azul", "Verde", "Rojo", "Púrpura"], capacities: ["64GB", "128GB", "256GB"], basePrice: 699 },
    { id: "iphone_12pro", name: "iPhone 12 Pro", releaseYear: 2020, colors: ["Gris espacial", "Plateado", "Oro", "Azul pacífico"], capacities: ["128GB", "256GB", "512GB"], basePrice: 999 },
    { id: "iphone_12promax", name: "iPhone 12 Pro Max", releaseYear: 2020, colors: ["Gris espacial", "Plateado", "Oro", "Azul pacífico"], capacities: ["128GB", "256GB", "512GB"], basePrice: 1099 },
    { id: "iphone_13", name: "iPhone 13", releaseYear: 2021, colors: ["Blanco", "Negro", "Azul", "Rosa", "Verde", "Rojo"], capacities: ["128GB", "256GB", "512GB"], basePrice: 799 },
    { id: "iphone_13mini", name: "iPhone 13 mini", releaseYear: 2021, colors: ["Blanco", "Negro", "Azul", "Rosa", "Verde", "Rojo"], capacities: ["128GB", "256GB", "512GB"], basePrice: 699 },
    { id: "iphone_13pro", name: "iPhone 13 Pro", releaseYear: 2021, colors: ["Gris espacial", "Plateado", "Oro", "Azul alpino", "Verde alpino"], capacities: ["128GB", "256GB", "512GB", "1TB"], basePrice: 999 },
    { id: "iphone_13promax", name: "iPhone 13 Pro Max", releaseYear: 2021, colors: ["Gris espacial", "Plateado", "Oro", "Azul alpino", "Verde alpino"], capacities: ["128GB", "256GB", "512GB", "1TB"], basePrice: 1099 },
    { id: "iphone_14", name: "iPhone 14", releaseYear: 2022, colors: ["Blanco", "Negro", "Azul", "Púrpura", "Rojo", "Amarillo"], capacities: ["128GB", "256GB", "512GB"], basePrice: 799 },
    { id: "iphone_14plus", name: "iPhone 14 Plus", releaseYear: 2022, colors: ["Blanco", "Negro", "Azul", "Púrpura", "Rojo", "Amarillo"], capacities: ["128GB", "256GB", "512GB"], basePrice: 899 },
    { id: "iphone_14pro", name: "iPhone 14 Pro", releaseYear: 2022, colors: ["Gris espacial", "Plateado", "Oro", "Púrpura oscuro"], capacities: ["128GB", "256GB", "512GB", "1TB"], basePrice: 999 },
    { id: "iphone_14promax", name: "iPhone 14 Pro Max", releaseYear: 2022, colors: ["Gris espacial", "Plateado", "Oro", "Púrpura oscuro"], capacities: ["128GB", "256GB", "512GB", "1TB"], basePrice: 1099 },
    { id: "iphone_15", name: "iPhone 15", releaseYear: 2023, colors: ["Rosa", "Amarillo", "Verde", "Azul", "Negro"], capacities: ["128GB", "256GB", "512GB"], basePrice: 799 },
    { id: "iphone_15plus", name: "iPhone 15 Plus", releaseYear: 2023, colors: ["Rosa", "Amarillo", "Verde", "Azul", "Negro"], capacities: ["128GB", "256GB", "512GB"], basePrice: 899 },
    { id: "iphone_15pro", name: "iPhone 15 Pro", releaseYear: 2023, colors: ["Titanio natural", "Titanio azul", "Titanio blanco", "Titanio negro"], capacities: ["128GB", "256GB", "512GB", "1TB"], basePrice: 999 },
    { id: "iphone_15promax", name: "iPhone 15 Pro Max", releaseYear: 2023, colors: ["Titanio natural", "Titanio azul", "Titanio blanco", "Titanio negro"], capacities: ["256GB", "512GB", "1TB"], basePrice: 1199 },
    { id: "iphone_16", name: "iPhone 16", releaseYear: 2024, colors: ["Azul", "Verde", "Rosa", "Amarillo", "Negro", "Blanco"], capacities: ["128GB", "256GB", "512GB"], basePrice: 799 },
    { id: "iphone_16plus", name: "iPhone 16 Plus", releaseYear: 2024, colors: ["Azul", "Verde", "Rosa", "Amarillo", "Negro", "Blanco"], capacities: ["128GB", "256GB", "512GB"], basePrice: 899 },
    { id: "iphone_16pro", name: "iPhone 16 Pro", releaseYear: 2024, colors: ["Titanio negro", "Titanio blanco", "Titanio gris", "Titanio dorado"], capacities: ["256GB", "512GB", "1TB"], basePrice: 1099 },
    { id: "iphone_16promax", name: "iPhone 16 Pro Max", releaseYear: 2024, colors: ["Titanio negro", "Titanio blanco", "Titanio gris", "Titanio dorado"], capacities: ["256GB", "512GB", "1TB"], basePrice: 1199 },
    { id: "iphone_17", name: "iPhone 17", releaseYear: 2025, colors: ["Azul cielo", "Verde menta", "Rosa coral", "Amarillo limón", "Gris espacial"], capacities: ["128GB", "256GB", "512GB", "1TB"], basePrice: 899 },
    { id: "iphone_17pro", name: "iPhone 17 Pro", releaseYear: 2025, colors: ["Titanio plateado", "Titanio grafito", "Titanio azul", "Titanio rojo"], capacities: ["256GB", "512GB", "1TB", "2TB"], basePrice: 1199 },
    { id: "iphone_17promax", name: "iPhone 17 Pro Max", releaseYear: 2025, colors: ["Titanio plateado", "Titanio grafito", "Titanio azul", "Titanio rojo", "Titanio dorado"], capacities: ["512GB", "1TB", "2TB"], basePrice: 1399 }
];

// Función auxiliar para obtener modelo por id
export function getModelById(modelId) {
    return iphoneModels.find(m => m.id === modelId);
}

// Obtener colores de un modelo
export function getColorsForModel(modelId) {
    const model = getModelById(modelId);
    return model ? model.colors : [];
}

// Obtener capacidades de un modelo
export function getCapacitiesForModel(modelId) {
    const model = getModelById(modelId);
    return model ? model.capacities : [];
}