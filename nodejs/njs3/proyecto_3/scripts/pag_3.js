import { iniciarFocusBlur } from '/modules/evento3_focusblur.js';

document.addEventListener('DOMContentLoaded', () => {
    iniciarFocusBlur(['nombre', 'email'], 'mensajeFocus');
});