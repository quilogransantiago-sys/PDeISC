/**
 * main.js - Controlador principal
 * Importa módulos de precios y almacenamiento.
 * Maneja validaciones, cálculo dinámico, y modo oscuro.
 */

import { modelCatalog, calculateTotalPrice } from '/modules/priceCalculator.js';
import * as cookieStorage from '/modules/storage-cookies.js';
import * as localStorageMod from '/modules/storage-local.js';
import * as sessionStorageMod from '/modules/storage-session.js';
import * as indexedDBStorage from '/modules/storage-indexeddb.js';

// -------------------------------
// Elementos DOM
// -------------------------------
const modelSelect = document.getElementById('model');
const saleType = document.getElementById('saleType');
const quantityInput = document.getElementById('quantity');
const storageSelect = document.getElementById('storage');
const conditionSelect = document.getElementById('condition');
const batterySelect = document.getElementById('battery');
const colorSelect = document.getElementById('color');
const totalSpan = document.getElementById('totalPrice');
const breakdownDiv = document.getElementById('priceBreakdown');
const quantityErrorDiv = document.getElementById('quantityError');

// Campos de cliente y sus errores
const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const dniInput = document.getElementById('dni');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const dniError = document.getElementById('dniError');

// Elementos de listado
const cookieListDiv = document.getElementById('cookieList');
const localListDiv = document.getElementById('localList');
const sessionListDiv = document.getElementById('sessionList');
const indexedListDiv = document.getElementById('indexedList');

// Botones
const saveCookieBtn = document.getElementById('saveCookieBtn');
const saveLocalBtn = document.getElementById('saveLocalBtn');
const saveSessionBtn = document.getElementById('saveSessionBtn');
const saveIndexedBtn = document.getElementById('saveIndexedBtn');
const clearCookiesBtn = document.getElementById('clearCookiesBtn');
const clearLocalBtn = document.getElementById('clearLocalBtn');
const clearSessionBtn = document.getElementById('clearSessionBtn');
const clearIndexedBtn = document.getElementById('clearIndexedBtn');
const themeToggle = document.getElementById('themeToggle');

// -------------------------------
// 1. Validaciones
// -------------------------------
function validateName() {
    const value = fullnameInput.value.trim();
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!value) {
        nameError.textContent = 'El nombre es obligatorio.';
        return false;
    }
    if (!regex.test(value)) {
        nameError.textContent = 'Solo letras y espacios.';
        return false;
    }
    nameError.textContent = '';
    return true;
}

function validateEmail() {
    const value = emailInput.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
        emailError.textContent = 'El correo es obligatorio.';
        return false;
    }
    if (!regex.test(value)) {
        emailError.textContent = 'Correo inválido (ej: nombre@dominio.com).';
        return false;
    }
    emailError.textContent = '';
    return true;
}

function validateDNI() {
    const value = dniInput.value.trim();
    const regex = /^\d+$/;
    if (!value) {
        dniError.textContent = 'El DNI es obligatorio.';
        return false;
    }
    if (!regex.test(value)) {
        dniError.textContent = 'Solo números, sin puntos.';
        return false;
    }
    dniError.textContent = '';
    return true;
}

function validateQuantity() {
    const qty = parseInt(quantityInput.value);
    const type = saleType.value;
    if (type === 'wholesale' && qty < 4) {
        quantityErrorDiv.textContent = '⚠️ Mayorista requiere mínimo 4 unidades.';
        return false;
    }
    if (qty < 1) {
        quantityErrorDiv.textContent = 'Cantidad mínima 1.';
        return false;
    }
    quantityErrorDiv.textContent = '';
    return true;
}

function isFormValid() {
    const nameOk = validateName();
    const emailOk = validateEmail();
    const dniOk = validateDNI();
    const qtyOk = validateQuantity();
    return nameOk && emailOk && dniOk && qtyOk;
}

// -------------------------------
// 2. Cargar modelos en el select
// -------------------------------
function populateModels() {
    if (!modelSelect) return;
    modelSelect.innerHTML = '';
    console.log('Cargando modelos:', modelCatalog.length); // Debug
    modelCatalog.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = `${model.name} - $${model.basePrice} (base ${model.baseStorage}GB)`;
        modelSelect.appendChild(option);
    });
    if (modelSelect.options.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'Error: no hay modelos';
        modelSelect.appendChild(option);
    }
}

// -------------------------------
// 3. Obtener datos del formulario y actualizar precio
// -------------------------------
function getCurrentFormData() {
    return {
        modelId: modelSelect.value,
        saleType: saleType.value,
        quantity: parseInt(quantityInput.value) || 1,
        selectedStorage: parseInt(storageSelect.value),
        condition: conditionSelect.value,
        batteryValue: batterySelect.value,
        color: colorSelect.value
    };
}

function updatePriceDisplay() {
    // Primero validar cantidad para mostrar error visual
    const qtyValid = validateQuantity();
    const params = getCurrentFormData();

    if (!qtyValid) {
        totalSpan.textContent = '0.00';
        breakdownDiv.innerHTML = '<span class="error-message">Cantidad no válida para el tipo de venta.</span>';
        return;
    }

    const { total, breakdown, error } = calculateTotalPrice(params);
    if (error) {
        totalSpan.textContent = 'Error';
        breakdownDiv.innerHTML = `<span class="error-message">${error}</span>`;
        return;
    }

    totalSpan.textContent = total.toFixed(2);
    breakdownDiv.innerHTML = `
        <div>💰 Precio base: $${breakdown.basePrice}</div>
        <div>💾 Extra capacidad: $${breakdown.storageExtra}</div>
        <div>📈 Margen (${breakdown.marginPercent}%): $${((breakdown.basePrice + breakdown.storageExtra) * breakdown.marginPercent / 100).toFixed(2)}</div>
        <div>🔧 Condición (x${breakdown.conditionMultiplier.toFixed(2)})</div>
        <div>🔋 Ajuste batería: $${breakdown.batteryAdjust}</div>
        <div>📦 Cantidad: ${breakdown.quantity} x $${breakdown.unitFinal.toFixed(2)}</div>
    `;
}

// -------------------------------
// 4. Construir objeto cotización
// -------------------------------
function buildQuoteObject() {
    if (!isFormValid()) return null;
    const params = getCurrentFormData();
    const { total, breakdown, error } = calculateTotalPrice(params);
    if (error) return null;

    const modelObj = modelCatalog.find(m => m.id === params.modelId);
    return {
        timestamp: new Date().toISOString(),
        cliente: {
            fullname: fullnameInput.value.trim(),
            email: emailInput.value.trim(),
            dni: dniInput.value.trim()
        },
        producto: {
            modelo: modelObj ? modelObj.name : params.modelId,
            capacidadGB: params.selectedStorage,
            condicion: conditionSelect.options[conditionSelect.selectedIndex]?.text,
            bateria: batterySelect.options[batterySelect.selectedIndex]?.text,
            color: colorSelect.value
        },
        venta: {
            tipo: saleType.value === 'retail' ? 'Minorista' : 'Mayorista',
            cantidad: params.quantity
        },
        totalUSD: total
    };
}

// -------------------------------
// 5. Guardar y mostrar mensajes (sin alert)
// -------------------------------
function showMessage(msg, isError = false) {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = msg;
    msgDiv.style.position = 'fixed';
    msgDiv.style.bottom = '1rem';
    msgDiv.style.right = '1rem';
    msgDiv.style.backgroundColor = isError ? '#dc2626' : '#10b981';
    msgDiv.style.color = 'white';
    msgDiv.style.padding = '0.5rem 1rem';
    msgDiv.style.borderRadius = '0.5rem';
    msgDiv.style.zIndex = '1000';
    document.body.appendChild(msgDiv);
    setTimeout(() => msgDiv.remove(), 2500);
}

async function saveCurrentTo(method) {
    if (!isFormValid()) {
        showMessage('Corrige los errores del formulario antes de guardar.', true);
        return;
    }
    const quote = buildQuoteObject();
    if (!quote) {
        showMessage('No se puede guardar la cotización (error en datos).', true);
        return;
    }

    if (method === 'cookie') cookieStorage.addQuote(quote);
    else if (method === 'local') localStorageMod.addQuote(quote);
    else if (method === 'session') sessionStorageMod.addQuote(quote);
    else if (method === 'indexed') await indexedDBStorage.addQuote(quote);

    refreshAllStorageLists();
    showMessage('Cotización guardada correctamente');
}

// -------------------------------
// 6. Refrescar listas de almacenamiento
// -------------------------------
async function refreshAllStorageLists() {
    const cookieQuotes = cookieStorage.getQuotes();
    cookieListDiv.innerHTML = cookieQuotes.length ? cookieQuotes.map(q => `<div>${new Date(q.timestamp).toLocaleString()} - ${q.cliente.fullname} - $${q.totalUSD}</div>`).join('') : 'No hay datos';

    const localQuotes = localStorageMod.getQuotes();
    localListDiv.innerHTML = localQuotes.length ? localQuotes.map(q => `<div>${new Date(q.timestamp).toLocaleString()} - ${q.cliente.fullname} - $${q.totalUSD}</div>`).join('') : 'No hay datos';

    const sessionQuotes = sessionStorageMod.getQuotes();
    sessionListDiv.innerHTML = sessionQuotes.length ? sessionQuotes.map(q => `<div>${new Date(q.timestamp).toLocaleString()} - ${q.cliente.fullname} - $${q.totalUSD}</div>`).join('') : 'No hay datos';

    try {
        const indexedQuotes = await indexedDBStorage.getQuotes();
        indexedListDiv.innerHTML = indexedQuotes.length ? indexedQuotes.map(q => `<div>${new Date(q.timestamp).toLocaleString()} - ${q.cliente.fullname} - $${q.totalUSD}</div>`).join('') : 'No hay datos';
    } catch (e) {
        indexedListDiv.innerHTML = 'Error cargando IndexedDB';
    }
}

// -------------------------------
// 7. Borrar datos
// -------------------------------
function clearCookie() { cookieStorage.clearQuotes(); refreshAllStorageLists(); showMessage('Cookies borradas'); }
function clearLocal() { localStorageMod.clearQuotes(); refreshAllStorageLists(); showMessage('localStorage borrado'); }
function clearSession() { sessionStorageMod.clearQuotes(); refreshAllStorageLists(); showMessage('sessionStorage borrado'); }
async function clearIndexed() { await indexedDBStorage.clearQuotes(); refreshAllStorageLists(); showMessage('IndexedDB borrado'); }

// -------------------------------
// 8. Modo oscuro/claro (corregido)
// -------------------------------
function initTheme() {
    const isDark = document.documentElement.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '☀️ Modo claro' : '🌙 Modo oscuro';
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        const nowDark = document.documentElement.classList.contains('dark-mode');
        localStorage.setItem('theme', nowDark ? 'dark' : 'light');
        themeToggle.textContent = nowDark ? '☀️ Modo claro' : '🌙 Modo oscuro';
    });
}

// -------------------------------
// 9. Eventos e inicialización
// -------------------------------
function attachEvents() {
    const inputs = ['model', 'saleType', 'quantity', 'storage', 'condition', 'battery', 'color'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updatePriceDisplay);
    });
    fullnameInput.addEventListener('input', () => { validateName(); updatePriceDisplay(); });
    emailInput.addEventListener('input', () => { validateEmail(); updatePriceDisplay(); });
    dniInput.addEventListener('input', () => { validateDNI(); updatePriceDisplay(); });
    quantityInput.addEventListener('input', () => { validateQuantity(); updatePriceDisplay(); });
    saleType.addEventListener('change', () => { validateQuantity(); updatePriceDisplay(); });

    saveCookieBtn.addEventListener('click', () => saveCurrentTo('cookie'));
    saveLocalBtn.addEventListener('click', () => saveCurrentTo('local'));
    saveSessionBtn.addEventListener('click', () => saveCurrentTo('session'));
    saveIndexedBtn.addEventListener('click', () => saveCurrentTo('indexed'));

    clearCookiesBtn.addEventListener('click', clearCookie);
    clearLocalBtn.addEventListener('click', clearLocal);
    clearSessionBtn.addEventListener('click', clearSession);
    clearIndexedBtn.addEventListener('click', clearIndexed);
}

async function init() {
    populateModels();
    attachEvents();
    initTheme();
    updatePriceDisplay();
    await refreshAllStorageLists();
}

init();