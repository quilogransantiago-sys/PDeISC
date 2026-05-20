// modules/nodosManager.js
// Clase o funciones para manejar los nodos <a> y registrar cambios

export class NodosManager {
    constructor(contenedorId, logListId) {
        this.contenedor = document.getElementById(contenedorId);
        this.logList = document.getElementById(logListId);
        this.enlaces = []; // arreglo para guardar referencia a los nodos creados
    }

    // Agregar entrada al registro visual
    agregarLog(mensaje) {
        if (!this.logList) return;
        const li = document.createElement('li');
        li.textContent = `[${new Date().toLocaleTimeString()}] ${mensaje}`;
        this.logList.appendChild(li);
        // Auto scroll al final
        this.logList.parentElement.scrollTop = this.logList.parentElement.scrollHeight;
    }

    // Crear un nuevo enlace
    crearEnlace(texto, href, target = '_self') {
        const a = document.createElement('a');
        a.textContent = texto;
        a.href = href;
        a.target = target;
        a.classList.add('enlace-creado');
        this.contenedor.appendChild(a);
        this.enlaces.push(a);
        this.agregarLog(`✅ Creado: "${texto}" → ${href}`);
        return a;
    }

    // Modificar un atributo de todos los enlaces (o de uno específico)
    modificarAtributoGlobal(atributo, nuevoValor, descripcion) {
        if (this.enlaces.length === 0) {
            this.agregarLog(`⚠️ No hay enlaces para modificar. Primero créalos.`);
            return;
        }
        let cambios = 0;
        this.enlaces.forEach((enlace, idx) => {
            const valorAnterior = enlace[atributo];
            if (valorAnterior !== nuevoValor) {
                enlace[atributo] = nuevoValor;
                cambios++;
                this.agregarLog(`🔧 Modificado ${atributo} de "${enlace.textContent}": "${valorAnterior}" → "${nuevoValor}"`);
            }
        });
        if (cambios === 0) {
            this.agregarLog(`ℹ️ No hubo cambios en ${atributo} (ya estaba en "${nuevoValor}")`);
        } else {
            this.agregarLog(`📌 ${descripcion} (${cambios} enlace(s) modificado(s))`);
        }
    }

    // Método específico para modificar texto
    modificarTextoGlobal(sufijo) {
        if (this.enlaces.length === 0) {
            this.agregarLog(`⚠️ No hay enlaces para modificar texto.`);
            return;
        }
        this.enlaces.forEach(enlace => {
            const original = enlace.textContent;
            const nuevo = original + sufijo;
            enlace.textContent = nuevo;
            this.agregarLog(`✏️ Texto cambiado: "${original}" → "${nuevo}"`);
        });
        this.agregarLog(`📌 Texto de todos los enlaces modificado (se agregó "${sufijo}")`);
    }
}