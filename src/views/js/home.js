const socket = io();

socket.emit("greet", { text: "Hola server" });

socket.on("greeting", (data) => {
    console.log(data);
});