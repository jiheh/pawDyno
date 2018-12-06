'use strict';

import './style.css';
import Game from './game';
import Wall from './wall';

// Global Variables
export const VIEWPORT_HEIGHT = window.innerHeight;
export const VIEWPORT_WIDTH = window.innerWidth;

let game;
let eventListenerFn;

// Socket
// All listeners on index.js, all emitters on game.js
let socket = io.connect();

socket.on('setup env', data => setupEnvironment(data));
socket.on('setup players', data => setupPlayers(data, socket));
socket.on('lobby timer', data => console.log(data));

socket.on('game start', data => startGame(data));
socket.on('game state', data => mainLoop(data));
socket.on('game end', data => endGame(data));

// Game Logic
function setupEnvironment(data) {
  if (game) {
    document.body.removeChild(game.view);
    document.removeEventListener('keydown', eventListenerFn);
    game.stage.children.forEach(child => child.removeChildren());
  }

  game = new Game(data.heightPercent, data.yPosPercent);
  document.body.appendChild(game.view);
}

function setupPlayers(data, socket) {
  game.updatePlayers(data.players, socket);
}

function startGame(data) {
  game.createWall(data.wall);

  eventListenerFn = (event) => game.handleKeydown(event, socket);
  document.addEventListener('keydown', eventListenerFn);
}

function mainLoop(data) {
  game.updatePlayers(data.players);
	game.updateYPos(socket);
	game.checkPlayerStatus(socket);
}

function endGame(data) {
  game.gameOver(socket.id, data.players);
}
