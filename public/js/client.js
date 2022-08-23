/**
 * client.js
 * @description Code pour le client dans l'application, il envoie des attaques au client Unity
 * @version 1.0
 * @author FG
 */

const port = 3000;
const hostname = "192.168.8.97";

let currentRoom = "Lobby";

let wrapper = document.querySelector("#container");

const client = io(`ws://${hostname}:${port}`);

//attendre la connection
client.on("connect", () => {
  client.emit("player2Connected"); //informe le serveur que le 2e joueur est connecté
  createLobby();
});

client.on("roomJoined", () => {
  createLoading();
});

client.on("onGameStarted", () => {
  onGameStarted();
});

client.on("roomFull", () => {
  onRoomFull();
});

client.on("roomNotFound", () => {
  onRoomNotFound();
});

client.on("onAttackUnlocked", (data) => {
  onAttackUnlocked(data);
});

client.on("onWin", () => {
  onGameWon();
});

client.on("onLose", () => {
  onGameLost();
});
