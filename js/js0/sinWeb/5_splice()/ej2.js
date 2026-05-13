let nombres = ['Ana', 'Carlos', 'Luisa'];
console.log("Original:", nombres);
// splice(1, 0, "Nuevo") → posición 1, elimina 0, inserta "Nuevo"
nombres.splice(1, 0, "Pedro");
console.log("Después de insertar:", nombres);