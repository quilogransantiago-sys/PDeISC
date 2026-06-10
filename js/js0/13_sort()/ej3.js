let personas = [
    { nombre: "Ana", edad: 30 },
    { nombre: "Luis", edad: 25 },
    { nombre: "Eva", edad: 35 }
];
personas.sort((a, b) => a.edad - b.edad);
console.log("Ordenados por edad:");
personas.forEach(p => console.log(`${p.nombre} - ${p.edad} años`));