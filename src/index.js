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
  document.addEventListener('keydown', event => handleKeydown(event));
}

function mainLoop(data) {
  game.updatePlayers(data.players);
}

// Helper Functions
function handleKeydown(event){
	if (event.keyCode === 13) { // enter
		if (wall.holds[holdInput]) {
			socket.emit('movePaw', holdInput);
		}
		holdInput = '';
	} else if (event.keyCode === 8){ // backspace
		if (holdInput.length > 0) {
			holdInput = holdInput.slice(0, -1);
		}
	} else if (event.key.length === 1){
		holdInput += event.key;
	}
}

export function renderGameObject(gameObject) {
  game.stage.addChild(gameObject);
}
