// modules/formHandler.js
export class FormHandler {
    constructor(formId, resultadoPanelId, datosMostradosId) {
        this.form = document.getElementById(formId);
        this.resultadoPanel = document.getElementById(resultadoPanelId);
        this.datosMostrados = document.getElementById(datosMostradosId);
        if (!this.form || !this.resultadoPanel || !this.datosMostrados) {
            throw new Error('Elementos necesarios no encontrados');
        }
    }

    // Obtener valores del formulario
    obtenerDatos() {
        const nombre = this.form.querySelector('#nombre').value.trim();
        const sexo = this.form.querySelector('input[name="sexo"]:checked')?.value || '';
        const pais = this.form.querySelector('#pais').value;
        const intereses = Array.from(this.form.querySelectorAll('input[name="intereses"]:checked')).map(cb => cb.value);
        const edad = this.form.querySelector('#edad').value;
        const email = this.form.querySelector('#email').value.trim();

        return { nombre, sexo, pais, intereses, edad, email };
    }

    // Validar campos obligatorios
    validarDatos(datos) {
        const errores = [];
        if (!datos.nombre) errores.push('Nombre completo es obligatorio');
        if (!datos.sexo) errores.push('Debe seleccionar un sexo');
        if (!datos.pais) errores.push('Debe seleccionar un país');
        if (!datos.edad) errores.push('Edad es obligatoria');
        if (!datos.email) errores.push('Correo electrónico es obligatorio');
        if (datos.edad && (datos.edad < 1 || datos.edad > 120)) errores.push('Edad debe estar entre 1 y 120');
        if (datos.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) errores.push('Email no válido');
        return errores;
    }

    // Mostrar datos en el panel
    mostrarDatos(datos) {
        const interesesTexto = datos.intereses.length ? datos.intereses.join(', ') : 'Ninguno';
        const html = `
            <p><strong>Nombre:</strong> ${this.escapeHTML(datos.nombre)}</p>
            <p><strong>Sexo:</strong> ${this.escapeHTML(datos.sexo)}</p>
            <p><strong>País:</strong> ${this.escapeHTML(datos.pais)}</p>
            <p><strong>Intereses:</strong> ${this.escapeHTML(interesesTexto)}</p>
            <p><strong>Edad:</strong> ${this.escapeHTML(datos.edad)}</p>
            <p><strong>Email:</strong> ${this.escapeHTML(datos.email)}</p>
        `;
        this.datosMostrados.innerHTML = html;
        this.resultadoPanel.style.display = 'block';
        // Scroll suave hacia el panel
        this.resultadoPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Mostrar errores (alerta simple, se podría mejorar con un div de errores)
    mostrarErrores(errores) {
        alert('Errores en el formulario:\n' + errores.join('\n'));
    }

    // Método auxiliar para evitar inyección HTML
    escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function (m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    // Manejar el envío del formulario
    manejarSubmit(event) {
        event.preventDefault();
        const datos = this.obtenerDatos();
        const errores = this.validarDatos(datos);
        if (errores.length > 0) {
            this.mostrarErrores(errores);
            return;
        }
        this.mostrarDatos(datos);
        // Opcional: resetear formulario o mantenerlo
        // this.form.reset();
    }

    // Cerrar panel de resultados
    cerrarPanel() {
        this.resultadoPanel.style.display = 'none';
    }
}