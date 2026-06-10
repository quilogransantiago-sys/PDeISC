let productos = [
    { nombre: "Camisa", precio: 25 },
    { nombre: "Pantalón", precio: 40 },
    { nombre: "Zapatos", precio: 60 }
];
let total = productos.reduce((acum, item) => acum + item.precio, 0);
console.log("Total de precios:", total);