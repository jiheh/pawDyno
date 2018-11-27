'use strict';

import './style.css';
import Game from './game';
import Wall from './wall';

// Global Variables
export const VIEWPORT_HEIGHT = window.innerHeight;
export const VIEWPORT_WIDTH = window.innerWidth;

let game;
let holdInput = '';

// Socket
let socket = io.connect();

socket.on('env setup', data => setupEnvironment(data));
socket.on('players setup', data => setupPlayers(data));
socket.on('game start', data => startGame(data));
socket.on('game state', data => mainLoop(data));
socket.on('you lost', () => game.gameOver('lose'));
socket.on('you won', () => game.gameOver('win'));

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

// Helper Functions
export function renderGameObject(gameObject) {
  game.stage.addChild(gameObject);
}
