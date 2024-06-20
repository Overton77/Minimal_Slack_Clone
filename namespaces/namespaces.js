const express = require("express");
const socketio = require("socket.io");

const app = express();

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(8001);

const io = socketio(expressServer);

io.of("/").on("connection", (socket) => {
  socket.join("chat");
  io.of("/").to("chat").emit("welcomeToChatRoom", { message: "hey" });
  io.of("/")
    .to("chat")
    .to("chat2")
    .to("adminChat")
    .emit("welcomeToChatRoom", {});
  console.log(`${socket.id} has connected`);

  socket.on("newMessageToServer", (dataFromClient) => {
    console.log("DATA :", dataFromClient);

    io.of("/").emit("newMessageToClients", { text: dataFromClient.text });
  });
});

io.of("/admin").on("connection", (socket) => {
  console.log(socket.id, "Has joined admin");

  socket.join("adminChat");
  io.of("/admin").emit("adminServerMessage", {
    name: "John",
    height: 100,
  });

  io.of("/admin").to("adminChat").emit("chatMessageAdmin", { name: "john" });

  socket.on("adminMessage", (data) => {
    console.log(data.admin);
  });
});
