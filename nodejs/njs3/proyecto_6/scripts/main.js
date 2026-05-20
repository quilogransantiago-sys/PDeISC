// scripts/main.js
import { FormHandler } from '/modules/formHandler.js';

document.addEventListener('DOMContentLoaded', () => {
    const handler = new FormHandler('registroForm', 'resultadoPanel', 'datosMostrados');

    // Evento submit del formulario
    handler.form.addEventListener('submit', (e) => handler.manejarSubmit(e));

    // Botón para cerrar el panel de resultados
    const btnCerrar = document.getElementById('btnCerrarResultado');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => handler.cerrarPanel());
    }

    // Opcional: botón de reset ya funciona con type="reset"
});