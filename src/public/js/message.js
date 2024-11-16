const socket = io();

const mySocketId = document.getElementById("my-socket-id");
const text = document.getElementById("text");
const message = document.getElementById("message");
const btnRefresh = document.getElementById("refresh");

text.addEventListener("keyup", () => {
    if(text.value === ""){
        return;
    }
    socket.emit("newText", { text: text.value });
});

btnRefresh.addEventListener("click", () => {
    socket.emit("clearMessages");
});

socket.on("message", (data) => {
    mySocketId.innerText = socket.id;

    message.innerText = "";

    data.messages.forEach((item) => {
        message.innerHTML += `socketId: ${item.socketId},  mensaje: ${item.message} <br>`;
    });

    console.log(data);
});

// // // //

// socket.emit("greet", { text: "Hola server" });

// socket.on("greeting", (data) => {
//     console.log(data);
// });