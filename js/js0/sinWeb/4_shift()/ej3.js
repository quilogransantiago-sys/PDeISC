// Usamos shift() para atender al primero de la cola
let cola = ["Cliente1", "Cliente2", "Cliente3"];
console.log("Cola inicial:", cola);
while (cola.length > 0) {
    let atendido = cola.shift();
    console.log(`Atendiendo a ${atendido}, quedan:`, cola);
}
console.log("Cola vacía:", cola);