"use strict";

import "./style.css";
import Game from "./game";
import * as PIXI from "pixi.js";

// Global Variables
export const VIEWPORT_HEIGHT = window.innerHeight;
export const VIEWPORT_WIDTH = window.innerWidth;

let pixiApp;
let game;
let eventListenerFn;

// Socket
// All listeners on index.js, all emitters on game.js
let socket = io.connect();

socket.on("setup env", (data) => setupEnvironment(data));
socket.on("setup players", (data) => setupPlayers(data, socket));
socket.on("lobby timer", (data) => console.log("New game starts in " + data / 1000));

socket.on("game start", (data) => startGame(data));
socket.on("game state", (data) => mainLoop(data));
socket.on("game end", (data) => endGame(data));

// Game Logic
function setupEnvironment(data) {
  if (game) {
    document.body.removeChild(pixiApp.view);
    document.removeEventListener("keydown", eventListenerFn);
    game.pixiApp.stage.children.forEach((child) => child.removeChildren());
  }

  pixiApp = new PIXI.Application({resizeTo: window});
  game = new Game(pixiApp, data.totalWallScale);
  document.body.appendChild(pixiApp.view);
}

function setupPlayers(data, socket) {
  game.updatePlayers(data.players, socket);
}

function startGame(data) {
  game.createWall(data.wall);

  eventListenerFn = (event) => game.handleKeydown(event, socket);
  document.addEventListener("keydown", eventListenerFn);
}

function mainLoop(data) {
  game.updatePlayers(data.players);
  game.updateYPos(socket);
  game.checkPlayerStatus(socket);
}

function endGame(data) {
  game.gameOver(socket.id, data.players);
}
