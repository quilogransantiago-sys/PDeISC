// scripts/appCliente.js
console.log("JavaScript del cliente cargado correctamente");

// Agregar interactividad básica
document.addEventListener('DOMContentLoaded', () => {
    const fechaSpan = document.getElementById('fecha');
    if (fechaSpan) {
        fechaSpan.innerText = new Date().toLocaleString();
    }

    // Agregar un botón dinámico al contenido
    const contenidoDiv = document.querySelector('.contenido');
    if (contenidoDiv && !document.getElementById('btnSaludo')) {
        const boton = document.createElement('button');
        boton.id = 'btnSaludo';
        boton.textContent = 'Saludar';
        boton.style.marginTop = '20px';
        boton.style.padding = '8px 16px';
        boton.style.cursor = 'pointer';
        boton.onclick = () => alert('¡Hola desde el servidor Node.js!');
        contenidoDiv.appendChild(boton);
    }
});