'use strict';

import './style.css';
import Game from './game';
import Wall from './wall';

// Global Variables
export const VIEWPORT_HEIGHT = window.innerHeight;
export const VIEWPORT_WIDTH = window.innerWidth;

let game;

// Socket
let socket = io.connect();

socket.on('setup env', data => setupEnvironment(data));
socket.on('setup players', data => setupPlayers(data));

socket.on('game start', data => startGame(data));
socket.on('game state', data => mainLoop(data));
socket.on('game end', data => endGame(data));

// Game Logic
function setupEnvironment(data) {
  game = new Game(data.heightPercent, data.yPosPercent);
  document.body.appendChild(game.view);
}

function setupPlayers(data) {
  game.updatePlayers(data.players);
}

function startGame(data) {
  game.createWall(data.wall);
  document.addEventListener('keydown', event => game.handleKeydown(event, socket));
}

function mainLoop(data) {
  game.updatePlayers(data.players);
	game.updateYPos(socket);
	game.checkPlayerStatus(socket)
}

function endGame(data) {
  game.gameOver(data.playerWon);
}
