'use strict';

import './style.css';
import Trianglify from 'trianglify';
import {Players, Player} from './player';
import Wall from './wall';

// Global Variables
export const VIEWPORT_HEIGHT = window.innerHeight;
export const VIEWPORT_WIDTH = window.innerWidth;

var app = new PIXI.Application(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
document.body.appendChild(app.view);
generateBackground();

let holdInput = '';
let wall = {};
let players = new Players();
players.draw();

// Socket
let socket = io.connect();

socket.on('wall setup', data => setupContainers(data));
socket.on('player setup', data => setupPlayers(data));
socket.on('game start', data => startGame(data));
socket.on('game state', data => mainLoop(data));

// Game Logic
function setupContainers(data) {
  wall = new Wall(data.wall);
  players.updateContainer(wall.height, wall.y);
}

function setupPlayers(data) {
  players.updatePlayers(data.players);
}

function startGame(data) {
  wall.draw();
  document.addEventListener('keydown', event => handleKeydown(event));
}

function mainLoop(data) {
  players.updatePlayers(data.players);
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
  app.stage.addChild(gameObject);
}

function generateBackground() {
  let pattern = Trianglify({
    height: VIEWPORT_HEIGHT,
    width: VIEWPORT_WIDTH,
    cell_size: 100,
    x_colors: 'Greys'
  });
  
  let texture = PIXI.Texture.fromCanvas(pattern.canvas());

  let mesh = new PIXI.mesh.Mesh(texture);
  mesh.height = VIEWPORT_HEIGHT;
  mesh.width = VIEWPORT_WIDTH;

  renderGameObject(mesh);
}
