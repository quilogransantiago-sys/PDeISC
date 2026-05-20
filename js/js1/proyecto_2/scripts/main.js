import SaleManager from '/modules/saleManager.js';
import { iphoneModels, getColorsForModel, getCapacitiesForModel, getModelById } from '/modules/iphoneData.js';

// Inicializar gestor de ventas
const saleManager = new SaleManager();

// Elementos DOM
const modelSelect = document.getElementById('model');
const colorSelect = document.getElementById('color');
const capacitySelect = document.getElementById('capacity');
const saleTypeSelect = document.getElementById('saleType');
const quantityInput = document.getElementById('quantity');
const conditionSelect = document.getElementById('condition');
const warrantyInput = document.getElementById('warranty');
const totalPriceInput = document.getElementById('totalPrice');
const notesTextarea = document.getElementById('notes');
const salesListDiv = document.getElementById('sales-list');
const themeToggle = document.getElementById('theme-toggle');
const lsCountSpan = document.getElementById('ls-count');
const ssCountSpan = document.getElementById('ss-count');
const cookieCountSpan = document.getElementById('cookie-count');

// Cargar modelos en el select
function populateModels() {
    modelSelect.innerHTML = '<option value="">Seleccionar</option>';
    iphoneModels.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = `${model.name} (${model.releaseYear}) - Desde $${model.basePrice}`;
        modelSelect.appendChild(option);
    });
}

// Actualizar colores según modelo seleccionado
function updateColors() {
    const modelId = modelSelect.value;
    colorSelect.innerHTML = '<option value="">Seleccionar color</option>';
    colorSelect.disabled = !modelId;
    if (!modelId) return;
    const colors = getColorsForModel(modelId);
    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        colorSelect.appendChild(option);
    });
}

// Actualizar capacidades según modelo
function updateCapacities() {
    const modelId = modelSelect.value;
    capacitySelect.innerHTML = '<option value="">Seleccionar capacidad</option>';
    capacitySelect.disabled = !modelId;
    if (!modelId) return;
    const capacities = getCapacitiesForModel(modelId);
    capacities.forEach(cap => {
        const option = document.createElement('option');
        option.value = cap;
        option.textContent = cap;
        capacitySelect.appendChild(option);
    });
}

// Calcular garantía por defecto según condición y modelo
function setDefaultWarranty() {
    const condition = conditionSelect.value;
    const modelId = modelSelect.value;
    if (!condition) return;
    if (condition === 'nuevo') {
        warrantyInput.value = 12;
    } else {
        warrantyInput.value = 6;
    }
    // Si es modelo muy reciente (año >= 2023) y nuevo, garantía 24 meses
    if (condition === 'nuevo' && modelId) {
        const model = getModelById(modelId);
        if (model && model.releaseYear >= 2023) warrantyInput.value = 24;
    }
}

// Calcular precio total en tiempo real
function calculateTotalPrice() {
    const modelId = modelSelect.value;
    const saleType = saleTypeSelect.value;
    const quantity = parseInt(quantityInput.value);
    const condition = conditionSelect.value;

    if (!modelId || !saleType || isNaN(quantity) || quantity <= 0 || !condition) {
        totalPriceInput.value = '';
        return;
    }

    const model = getModelById(modelId);
    if (!model) return;

    let unitPrice = model.basePrice;
    // Aplicar markup para minorista
    if (saleType === 'minorista') {
        unitPrice = unitPrice * 1.30; // +30%
    }
    // Ajuste por condición: reacondicionado tiene 20% de descuento sobre el precio final
    if (condition === 'reacondicionado') {
        unitPrice = unitPrice * 0.80;
    }
    const total = unitPrice * quantity;
    totalPriceInput.value = total.toFixed(2);
}

// Validar cantidad según tipo de venta
function validateQuantity() {
    const saleType = saleTypeSelect.value;
    let qty = parseInt(quantityInput.value);
    const errorSpan = document.getElementById('quantity-error');
    if (!saleType) return true;
    if (saleType === 'mayorista') {
        if (isNaN(qty) || qty < 10) {
            errorSpan.textContent = 'Mayorista requiere mínimo 10 unidades.';
            return false;
        } else {
            errorSpan.textContent = '';
            return true;
        }
    } else {
        if (isNaN(qty) || qty < 1) {
            errorSpan.textContent = 'Cantidad mínima 1.';
            return false;
        } else {
            errorSpan.textContent = '';
            return true;
        }
    }
}

// Validación completa antes de enviar
function validateForm() {
    let isValid = true;
    // Limpiar errores previos
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    if (!modelSelect.value) {
        document.getElementById('model-error').textContent = 'Seleccione un modelo.';
        isValid = false;
    }
    if (!colorSelect.value) {
        document.getElementById('color-error').textContent = 'Seleccione un color válido para el modelo.';
        isValid = false;
    }
    if (!capacitySelect.value) {
        document.getElementById('capacity-error').textContent = 'Seleccione capacidad.';
        isValid = false;
    }
    if (!saleTypeSelect.value) {
        document.getElementById('saleType-error').textContent = 'Seleccione tipo de venta.';
        isValid = false;
    }
    if (!validateQuantity()) isValid = false;
    if (!conditionSelect.value) {
        document.getElementById('condition-error').textContent = 'Seleccione condición.';
        isValid = false;
    }
    const warranty = parseInt(warrantyInput.value);
    if (isNaN(warranty) || warranty < 0 || warranty > 24) {
        document.getElementById('warranty-error').textContent = 'Garantía entre 0 y 24 meses.';
        isValid = false;
    }
    if (!totalPriceInput.value || parseFloat(totalPriceInput.value) <= 0) {
        // Si no hay precio, recalcular
        calculateTotalPrice();
        if (!totalPriceInput.value) isValid = false;
    }
    return isValid;
}

// Obtener objeto de venta actual
function getCurrentSale() {
    const model = getModelById(modelSelect.value);
    return {
        model: model.name,
        modelId: modelSelect.value,
        color: colorSelect.value,
        capacity: capacitySelect.value,
        saleType: saleTypeSelect.value,
        quantity: parseInt(quantityInput.value),
        condition: conditionSelect.value,
        warranty: parseInt(warrantyInput.value),
        totalPrice: parseFloat(totalPriceInput.value),
        notes: notesTextarea.value.trim(),
        unitPrice: (parseFloat(totalPriceInput.value) / parseInt(quantityInput.value)).toFixed(2),
        date: new Date().toLocaleString()
    };
}

// Actualizar lista de ventas en UI
function updateSalesList() {
    const sales = saleManager.getAll();
    if (sales.length === 0) {
        salesListDiv.innerHTML = '<p class="empty-message">No hay ventas registradas.</p>';
    } else {
        salesListDiv.innerHTML = sales.map(sale => `
      <div class="item-card" data-id="${sale.id}">
        <p class="item-name">${escapeHtml(sale.model)} - ${sale.capacity} - ${escapeHtml(sale.color)}</p>
        <p>Venta: ${sale.saleType === 'minorista' ? 'Minorista' : 'Mayorista'} | Cantidad: ${sale.quantity} | Total: $${sale.totalPrice}</p>
        <p>Condición: ${sale.condition === 'nuevo' ? 'Nuevo' : 'Reacondicionado'} | Garantía: ${sale.warranty} meses</p>
        <p>Precio unitario: $${sale.unitPrice} | Fecha: ${sale.date}</p>
        ${sale.notes ? `<p>Notas: ${escapeHtml(sale.notes)}</p>` : ''}
        <button class="delete-btn" data-id="${sale.id}">Eliminar venta</button>
      </div>
    `).join('');
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                saleManager.remove(parseInt(btn.dataset.id));
                updateSalesList();
                updateCounters();
            });
        });
    }
}

function updateCounters() {
    const counts = saleManager.getCounts();
    lsCountSpan.textContent = counts.localStorage;
    ssCountSpan.textContent = counts.sessionStorage;
    cookieCountSpan.textContent = counts.cookies;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
}

// Eventos dinámicos
modelSelect.addEventListener('change', () => {
    updateColors();
    updateCapacities();
    setDefaultWarranty();
    calculateTotalPrice();
});
colorSelect.addEventListener('change', calculateTotalPrice);
capacitySelect.addEventListener('change', calculateTotalPrice);
saleTypeSelect.addEventListener('change', () => {
    validateQuantity();
    calculateTotalPrice();
});
quantityInput.addEventListener('input', () => {
    validateQuantity();
    calculateTotalPrice();
});
conditionSelect.addEventListener('change', () => {
    setDefaultWarranty();
    calculateTotalPrice();
});
warrantyInput.addEventListener('input', () => {
    let val = parseInt(warrantyInput.value);
    if (isNaN(val)) warrantyInput.value = 0;
    if (val < 0) warrantyInput.value = 0;
    if (val > 24) warrantyInput.value = 24;
});

// Envío del formulario
document.getElementById('sale-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
        const sale = getCurrentSale();
        saleManager.add(sale);
        updateSalesList();
        updateCounters();
        // Reiniciar campos opcionales pero mantener selecciones
        notesTextarea.value = '';
        quantityInput.value = 1;
        // Recalcular precio
        calculateTotalPrice();
        // Limpiar errores
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }
});

document.getElementById('clear-all').addEventListener('click', () => {
    if (confirm('¿Eliminar todas las ventas registradas?')) {
        saleManager.clearAll();
        updateSalesList();
        updateCounters();
    }
});

document.getElementById('load-ls').addEventListener('click', () => {
    saleManager.loadFromLocalStorage();
    updateSalesList();
    updateCounters();
});
document.getElementById('load-ss').addEventListener('click', () => {
    saleManager.loadFromSessionStorage();
    updateSalesList();
    updateCounters();
});
document.getElementById('load-cookie').addEventListener('click', () => {
    saleManager.loadFromCookies();
    updateSalesList();
    updateCounters();
});

// Tema oscuro
function applyTheme() {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
        document.documentElement.classList.add('dark-theme');
        themeToggle.textContent = 'Modo claro';
    } else {
        document.documentElement.classList.remove('dark-theme');
        themeToggle.textContent = 'Modo oscuro';
    }
}
function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark-theme');
    if (isDark) {
        document.documentElement.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = 'Modo oscuro';
    } else {
        document.documentElement.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = 'Modo claro';
    }
}
themeToggle.addEventListener('click', toggleTheme);
applyTheme();

// Inicializar todo
populateModels();
updateColors();
updateCapacities();
setDefaultWarranty();
updateSalesList();
updateCounters();
calculateTotalPrice();