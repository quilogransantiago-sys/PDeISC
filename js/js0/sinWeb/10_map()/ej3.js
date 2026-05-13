let precios = [100, 200, 350];
let conIVA = precios.map(precio => precio * 1.21);
console.log("Precios originales:", precios);
console.log("Con IVA:", conIVA.map(p => p.toFixed(2))); // toFixed para dos decimales