const express = require("express");
const socketio = require("socket.io");
const namespaces = require("./data/namespaces");
const Room = require("./classes/Room");

const app = express();

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);

const io = socketio(expressServer);

app.get("/change-ns", (req, res) => {
  namespaces[0].addRoom(new Room(0, "Deleted Articles", 0));
  // let everyone know in THIS namespace that it changed
  io.of(namespaces[0].endpoint).emit("nsChange", namespaces[0]);
  res.json(namespaces[0]);
});

io.on("connection", (socket) => {
  console.log(`${socket.id} has connected`);
  console.log("+++++++++++++++++++");
  console.log(socket.handshake);

  const userName = socket.handshake.query.userName;

  socket.emit("welcome", "Welcome to the server");

  socket.on("clientConnect", () => {
    console.log(socket.id);
    socket.emit("nsList", namespaces);
  });
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (socket) => {
    console.log(`${socket.id} has connected to ${namespace.endpoint}`);

    socket.on("joinRoom", async ({ roomTitle, nameSpaceId }, ackCallBack) => {
      const thisNs = namespaces[nameSpaceId];
      const thisRoomObj = thisNs.rooms.find(
        (room) => room.roomTitle === roomTitle
      );

      const thisRoomsHistory =
        thisRoomObj.history.length > 0 ? thisRoomObj.history : [];

      const rooms = socket.rooms;
      console.log(rooms);

      let i = 0;
      rooms.forEach((room) => {
        if (i !== 0) {
          socket.leave(room);
        }
        i++;
      });

      socket.join(roomTitle);

      const sockets = await io
        .of(namespace.endpoint)
        .in(roomTitle)
        .fetchSockets();
      const socketCount = sockets.length;
      ackCallBack({
        numUsers: socketCount,
        history: thisRoomsHistory,
      });
    });

    socket.on("newMessageToRoom", (messageObj) => {
      console.log(messageObj);

      const rooms = socket.rooms;
      const currentRoom = [...rooms][1];
      io.of(namespace.endpoint)
        .in(currentRoom)
        .emit("messageToRoom", messageObj);

      const thisNs = namespaces[messageObj.selectedNsId];

      const thisRoom = thisNs.rooms.find(
        (room) => room.roomTitle === currentRoom
      );

      console.log(thisRoom);

      thisRoom.addMessage(messageObj);

      console.log(thisRoom.history);
    });
  });
});
