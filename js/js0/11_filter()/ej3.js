let usuarios = [
    { nombre: "Ana", activo: true },
    { nombre: "Luis", activo: false },
    { nombre: "Eva", activo: true }
];
let activos = usuarios.filter(user => user.activo === true);
console.log("Usuarios activos:", activos);