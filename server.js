/**
 * server.js
 * @description communication entre le client web et le client unity
 * @version 1.0
 * @author FG
 */
const socketio = require("socket.io");
const express = require("express");
const app = express();
const port = 8080;

//fichiers statiques
app.use(express.static("./public"));

//toutes les autres routes non valides retournent à la racine
app.use((req, res) => {
  res.status(404).redirect("/");
});

const server = require("http").Server(app);

server.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});

const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  //rejoins le lobby par defaut
  socket.join("lobby");

  //pour Unity
  socket.emit("callToUnity", "connectUnity");

  socket.on("tick", (data) => {
    socket.emit("onTick", { data: data });
  });

  socket.on("pause", () => {
    socket.emit("onPause");
  });

  //Client web
  socket.on("checkRoomMatch", (data) => {
    socket.leaveAll();
    //compare le nom de room aux rooms actives (créées sur Unity)
    if (getActiveRooms().indexOf(data.roomToJoin) >= 0) {
      //vérifie si la room est en attente d'un joeur 2
      if (getRoomSize(data.roomToJoin) < 2) {
        socket.join(data.roomToJoin);
        socket.emit("roomJoined");
        socket.to(data.roomToJoin).emit("callToUnity", "playerJoined");
        //garde la room en mémoire pour le serveur
        io.currentRoom = data.roomToJoin;
      } else {
        socket.emit("roomFull"); //erreur de room pleine
      }
    } else {
      socket.join("lobby");
      socket.emit("roomNotFound"); //erreur de room inexistante
    }
  });

  //Client Unity
  socket.on("JoinRoomRequest", (data) => {
    socket.leaveAll();
    if (getActiveRooms().indexOf(data) >= 0) {
      socket.emit("callToUnity", "roomFail");
    } else {
      socket.join(data);
      socket.emit("callToUnity", "roomSuccess");
    }
  });

  socket.on("webToServer", (data) => {
    socket.to(io.currentRoom).emit("callToUnity", data);
  });

  socket.on("attackUnlocked", (data) => {
    socket.to(io.currentRoom).emit("onAttackUnlocked", data);
  });

  socket.on("gameStarted", (data) => {
    socket.to(io.currentRoom).emit("onGameStarted", data);
  });

  socket.on("gameEnded", (data) => {
    switch (data) {
      case "win":
        socket.to(io.currentRoom).emit("onWin", data);
        break;
      case "lose":
        socket.to(io.currentRoom).emit("onWin", data);
        break;
    }
  });
});

function getActiveRooms() {
  // Convertir la map  des rooms en array
  const arr = Array.from(io.sockets.adapter.rooms);
  // Filter les rooms faisant aussi partie des sets (utilisateurs)
  const filtered = arr.filter((room) => !room[1].has(room[0]));
  // Retourner les noms de room
  const res = filtered.map((i) => i[0]);
  return res;
}

function getRoomSize(roomName) {
  var roomSize = io.of("/").adapter.rooms.get(roomName).size;
  return roomSize;
}
