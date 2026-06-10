// scripts/main.js - Controlador principal con edición y cambio de método de almacenaje
import { modelos, calcularPrecio } from '../modules/priceCalculator.js';
import {
    obtenerTodasLasVentas, agregarVentaLocal, agregarVentaSession, agregarVentaMemoria,
    eliminarVentaPorId, actualizarVentaPorId, obtenerVentaPorId
} from '../modules/dataManager.js';
import { validarNombre, validarEmail, validarDNI, validarCantidad } from '../modules/validators.js';

const form = document.getElementById('formVenta');
const listaDiv = document.getElementById('listaVentas');
const modeloSelect = document.getElementById('modelo');
const almacenamientoSelect = document.getElementById('almacenamiento');
const condicionSelect = document.getElementById('condicion');
const tipoClienteSelect = document.getElementById('tipoCliente');
const gradoSelect = document.getElementById('grado');
const bateriaSelect = document.getElementById('bateria');
const cantidadInput = document.getElementById('cantidad');
const precioUnidadSpan = document.getElementById('precioUnidad');
const precioTotalSpan = document.getElementById('precioTotal');
const btnCancelar = document.getElementById('btnCancelarEdicion');
let editando = { id: null, metodo: null };

function cargarModelos() {
    modeloSelect.innerHTML = '';
    Object.keys(modelos).forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m.toUpperCase();
        modeloSelect.appendChild(opt);
    });
    actualizarAlmacenamiento();
}
function actualizarAlmacenamiento() {
    const modeloKey = modeloSelect.value;
    const modelo = modelos[modeloKey];
    if (!modelo) return;
    almacenamientoSelect.innerHTML = '';
    for (let gb = modelo.minGB; gb <= modelo.maxGB; gb *= 2) {
        const opt = document.createElement('option');
        opt.value = gb;
        let extra = '';
        if (gb > modelo.minGB) extra = gb === 128 ? ' (+$30)' : (gb === 256 ? ' (+$60)' : ' (+$120)');
        opt.textContent = `${gb} GB${extra}`;
        almacenamientoSelect.appendChild(opt);
    }
}
function actualizarPrecios() {
    const params = {
        modeloKey: modeloSelect.value,
        condicion: condicionSelect.value,
        tipoCliente: tipoClienteSelect.value,
        grado: gradoSelect.value,
        almacenamientoGB: parseInt(almacenamientoSelect.value),
        bateriaPorcentaje: bateriaSelect.value,
        cantidad: parseInt(cantidadInput.value) || 1
    };
    const { precioUnidad, precioTotal } = calcularPrecio(params);
    precioUnidadSpan.textContent = `$${precioUnidad}`;
    precioTotalSpan.textContent = `$${precioTotal}`;
}
function mostrarMensaje(msg, tipo) {
    const div = document.getElementById('mensajeGlobal');
    div.textContent = msg;
    div.className = `mensaje-global ${tipo}`;
    div.style.display = 'block';
    setTimeout(() => div.style.display = 'none', 3000);
}
function validarFormulario() {
    let valido = true;
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const dni = document.getElementById('dni').value;
    const cantidad = cantidadInput.value;
    const tipo = tipoClienteSelect.value;
    document.querySelectorAll('.error').forEach(e => e.style.display = 'none');
    if (!validarNombre(nombre)) { document.getElementById('error-nombre').style.display = 'block'; valido = false; }
    if (!validarEmail(email)) { document.getElementById('error-email').style.display = 'block'; valido = false; }
    if (!validarDNI(dni)) { document.getElementById('error-dni').style.display = 'block'; valido = false; }
    if (!validarCantidad(cantidad, tipo)) {
        document.getElementById('error-cantidad').innerText = tipo === 'mayorista' ? 'Mínimo 3 unidades para mayorista' : 'Cantidad inválida';
        document.getElementById('error-cantidad').style.display = 'block';
        valido = false;
    }
    return valido;
}
function obtenerDatosFormulario() {
    return {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        dni: document.getElementById('dni').value,
        tipoCliente: tipoClienteSelect.value,
        condicion: condicionSelect.value,
        grado: gradoSelect.value,
        modelo: modeloSelect.value,
        almacenamiento: almacenamientoSelect.value,
        bateria: bateriaSelect.value,
        cantidad: cantidadInput.value,
        precioUnidad: precioUnidadSpan.textContent,
        precioTotal: precioTotalSpan.textContent
    };
}
function renderizarLista() {
    const todas = obtenerTodasLasVentas();
    if (todas.length === 0) {
        listaDiv.innerHTML = '<p>No hay ventas registradas</p>';
        return;
    }
    listaDiv.innerHTML = todas.map(v => `
        <div class="tarjeta-venta">
            <div>
                <strong>${v.nombre}</strong> - ${v.modelo} (${v.cantidad} und) - ${v.precioTotal}
                <span class="metodo-badge ${v.metodo}">${v.metodo === 'localStorage' ? '💾 Local' : v.metodo === 'sessionStorage' ? '🔄 Sesión' : '🧠 Memoria'}</span>
            </div>
            <div>
                <button class="editar" data-id="${v.id}" data-metodo="${v.metodo}">Editar</button>
                <button class="eliminar" data-id="${v.id}" data-metodo="${v.metodo}">Eliminar</button>
            </div>
        </div>
    `).join('');
    document.querySelectorAll('.editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id;
            const metodo = btn.dataset.metodo;
            const venta = obtenerVentaPorId(id, metodo);
            if (venta) {
                document.getElementById('nombre').value = venta.nombre;
                document.getElementById('email').value = venta.email;
                document.getElementById('dni').value = venta.dni;
                tipoClienteSelect.value = venta.tipoCliente;
                condicionSelect.value = venta.condicion;
                gradoSelect.value = venta.grado;
                modeloSelect.value = venta.modelo;
                actualizarAlmacenamiento();
                almacenamientoSelect.value = venta.almacenamiento;
                bateriaSelect.value = venta.bateria;
                cantidadInput.value = venta.cantidad;
                editando.id = id;
                editando.metodo = metodo;
                btnCancelar.style.display = 'inline-block';
                actualizarPrecios();
            }
        });
    });
    document.querySelectorAll('.eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id;
            const metodo = btn.dataset.metodo;
            if (eliminarVentaPorId(id, metodo)) {
                renderizarLista();
                mostrarMensaje('Venta eliminada', 'exito');
                if (editando.id == id) { editando = { id: null, metodo: null }; btnCancelar.style.display = 'none'; form.reset(); actualizarPrecios(); }
            } else mostrarMensaje('Error al eliminar', 'error');
        });
    });
}
function actualizarVisibilidadCampos() {
    const esUsado = condicionSelect.value === 'usado';
    document.getElementById('campoGrado').style.display = esUsado ? 'block' : 'none';
    document.getElementById('campoBateria').style.display = esUsado ? 'block' : 'none';
}
// Función genérica para guardar según método (permite cambiar de método al editar)
function guardarVenta(metodo, agregarFn, nombreMetodo) {
    if (!validarFormulario()) return;
    const datos = obtenerDatosFormulario();

    if (editando.id) {
        // Eliminar la venta original (del método antiguo)
        eliminarVentaPorId(editando.id, editando.metodo);
        // Crear nueva venta en el método seleccionado (con los datos actualizados)
        agregarFn(datos);
        mostrarMensaje(`Venta actualizada y movida a ${nombreMetodo}`, 'exito');
        editando = { id: null, metodo: null };
        btnCancelar.style.display = 'none';
    } else {
        agregarFn(datos);
        mostrarMensaje(`Venta guardada en ${nombreMetodo}`, 'exito');
    }
    form.reset();
    actualizarPrecios();
    renderizarLista();
}
// Asignar eventos a los 3 botones
document.getElementById('guardarLocalStorage').onclick = () => guardarVenta('localStorage', agregarVentaLocal, 'localStorage');
document.getElementById('guardarSessionStorage').onclick = () => guardarVenta('sessionStorage', agregarVentaSession, 'sessionStorage');
document.getElementById('guardarMemoria').onclick = () => guardarVenta('memoria', agregarVentaMemoria, 'memoria');
btnCancelar.addEventListener('click', () => {
    editando = { id: null, metodo: null };
    btnCancelar.style.display = 'none';
    form.reset();
    actualizarPrecios();
});
// Eventos de cambio para recalcular precios y visibilidad
modeloSelect.addEventListener('change', () => { actualizarAlmacenamiento(); actualizarPrecios(); });
condicionSelect.addEventListener('change', () => { actualizarVisibilidadCampos(); actualizarPrecios(); });
tipoClienteSelect.addEventListener('change', () => actualizarPrecios());
gradoSelect.addEventListener('change', () => actualizarPrecios());
almacenamientoSelect.addEventListener('change', () => actualizarPrecios());
bateriaSelect.addEventListener('change', () => actualizarPrecios());
cantidadInput.addEventListener('input', () => actualizarPrecios());
actualizarVisibilidadCampos();
cargarModelos();
renderizarLista();
actualizarPrecios();

// Modo oscuro
const btnTema = document.getElementById('btnTema');
btnTema.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const esOscuro = document.documentElement.classList.contains('dark');
    localStorage.setItem('tema', esOscuro ? 'oscuro' : 'claro');
    btnTema.innerHTML = esOscuro ? '☀️ Claro' : '🌙 Oscuro';
});
if (document.documentElement.classList.contains('dark')) btnTema.innerHTML = '☀️ Claro';