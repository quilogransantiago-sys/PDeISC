// Claves para cada almacenamiento
const LS_KEY = 'ventas_localStorage';
const SS_KEY = 'ventas_sessionStorage';

// --- localStorage ---
export function obtenerVentasLocal() {
    const data = localStorage.getItem(LS_KEY);
    return data ? JSON.parse(data) : [];
}
function guardarVentasLocal(ventas) {
    localStorage.setItem(LS_KEY, JSON.stringify(ventas));
}
export function agregarVentaLocal(venta) {
    const ventas = obtenerVentasLocal();
    const nueva = { id: Date.now(), ...venta, metodo: 'localStorage' };
    ventas.push(nueva);
    guardarVentasLocal(ventas);
    return nueva;
}
export function actualizarVentaLocal(id, datos) {
    let ventas = obtenerVentasLocal();
    const index = ventas.findIndex(v => v.id == id);
    if (index === -1) return null;
    ventas[index] = { ...ventas[index], ...datos, metodo: 'localStorage' };
    guardarVentasLocal(ventas);
    return ventas[index];
}
export function eliminarVentaLocal(id) {
    let ventas = obtenerVentasLocal();
    const filtradas = ventas.filter(v => v.id != id);
    if (filtradas.length === ventas.length) return false;
    guardarVentasLocal(filtradas);
    return true;
}

// --- sessionStorage ---
export function obtenerVentasSession() {
    const data = sessionStorage.getItem(SS_KEY);
    return data ? JSON.parse(data) : [];
}
function guardarVentasSession(ventas) {
    sessionStorage.setItem(SS_KEY, JSON.stringify(ventas));
}
export function agregarVentaSession(venta) {
    const ventas = obtenerVentasSession();
    const nueva = { id: Date.now(), ...venta, metodo: 'sessionStorage' };
    ventas.push(nueva);
    guardarVentasSession(ventas);
    return nueva;
}
export function actualizarVentaSession(id, datos) {
    let ventas = obtenerVentasSession();
    const index = ventas.findIndex(v => v.id == id);
    if (index === -1) return null;
    ventas[index] = { ...ventas[index], ...datos, metodo: 'sessionStorage' };
    guardarVentasSession(ventas);
    return ventas[index];
}
export function eliminarVentaSession(id) {
    let ventas = obtenerVentasSession();
    const filtradas = ventas.filter(v => v.id != id);
    if (filtradas.length === ventas.length) return false;
    guardarVentasSession(filtradas);
    return true;
}

// --- Memoria (array global, NO persiste) ---
let memoriaVentas = [];  // Este array se reinicia al recargar
export function obtenerVentasMemoria() {
    return [...memoriaVentas];
}
export function agregarVentaMemoria(venta) {
    const nueva = { id: Date.now(), ...venta, metodo: 'memoria' };
    memoriaVentas.push(nueva);
    return nueva;
}
export function actualizarVentaMemoria(id, datos) {
    const index = memoriaVentas.findIndex(v => v.id == id);
    if (index === -1) return null;
    memoriaVentas[index] = { ...memoriaVentas[index], ...datos, metodo: 'memoria' };
    return memoriaVentas[index];
}
export function eliminarVentaMemoria(id) {
    const filtradas = memoriaVentas.filter(v => v.id != id);
    if (filtradas.length === memoriaVentas.length) return false;
    memoriaVentas = filtradas;
    return true;
}

// --- Obtener todas las ventas (unión de los tres métodos) ---
export function obtenerTodasLasVentas() {
    const local = obtenerVentasLocal();
    const session = obtenerVentasSession();
    const memoria = obtenerVentasMemoria();
    return [...local, ...session, ...memoria];
}

// Para editar/eliminar necesitamos saber de qué método proviene cada venta
export function eliminarVentaPorId(id, metodo) {
    if (metodo === 'localStorage') return eliminarVentaLocal(id);
    if (metodo === 'sessionStorage') return eliminarVentaSession(id);
    if (metodo === 'memoria') return eliminarVentaMemoria(id);
    return false;
}
export function actualizarVentaPorId(id, metodo, datos) {
    if (metodo === 'localStorage') return actualizarVentaLocal(id, datos);
    if (metodo === 'sessionStorage') return actualizarVentaSession(id, datos);
    if (metodo === 'memoria') return actualizarVentaMemoria(id, datos);
    return null;
}
export function obtenerVentaPorId(id, metodo) {
    if (metodo === 'localStorage') return obtenerVentasLocal().find(v => v.id == id);
    if (metodo === 'sessionStorage') return obtenerVentasSession().find(v => v.id == id);
    if (metodo === 'memoria') return obtenerVentasMemoria().find(v => v.id == id);
    return null;
}