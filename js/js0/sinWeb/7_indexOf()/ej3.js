let ciudades = ["Barcelona", "Valencia", "Sevilla", "Bilbao"];
let indice = ciudades.indexOf("Madrid");
if (indice !== -1) {
    console.log(`Madrid está en la posición ${indice}.`);
} else {
    console.log("Madrid no se encuentra en el array de ciudades.");
}