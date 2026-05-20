let personas = [
    { nombre: "Ana", edad: 25 },
    { nombre: "Luis", edad: 30 },
    { nombre: "Eva", edad: 22 }
];
console.log("Lista de personas:");
personas.forEach(persona => {
    console.log(`${persona.nombre} tiene ${persona.edad} años.`);
});