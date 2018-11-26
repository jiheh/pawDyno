'use strict';

require('./style.css');
import {Players, Player} from './player';
import Wall from './wall';

// Global variables
export const VIEWPORT_HEIGHT = window.innerHeight;
export const VIEWPORT_WIDTH = window.innerWidth;

var app = new PIXI.Application({
  width: VIEWPORT_WIDTH,
  height: VIEWPORT_HEIGHT,
  backgroundColor: 0x555555
});
document.body.appendChild(app.view);

let holdInput = ''
let wall = {};
let players = new Players();
players.draw();

// Socket
let socket = io.connect();

socket.on('player joined', data => {
  players.addPlayers(data.players);
});
socket.on('player disconnected', data => {
  console.log(data.players)
  players.removePlayers(data.players);
});

socket.on('start game', data => {
  startGame(data.wall);
});

socket.on('game state', data => {
  players.updatePlayers(data.players);
});

// Game Setup
function startGame(wallData) {
  // TODO: character movement hardcoded to character 0 and only looking for one letter label
  document.addEventListener('keydown', event => handleKeydown(event));
  wall = new Wall(wallData);
  wall.draw();

  mainLoop();
}

// Game Loop and Logic
function mainLoop() {
  if (wall.y < 0) {
    wall.y += 10;
  }
  requestAnimationFrame(mainLoop);
}

// function moveCharacter(character, event) {
//   let key = event.key;
//   let hold = wall.filter(hold => hold.label === key)[0];
//
//   if (hold) {
//     character.move(hold.x, hold.y);
//   }
// }

// Helper Functions

function handleKeydown(event){
	if(event.keyCode === 13){ // enter
		if(wall.holds[holdInput]){
			socket.emit('movePaw', holdInput)
		}
		holdInput = ''
	}else if(event.keyCode === 8){ // backspace
		if(holdInput.length > 0){
			holdInput = holdInput.slice(0, -1)
		}
	}else if(event.key.length === 1){
		holdInput += event.key;
	}
	console.log(holdInput)
}

export function renderGameObject(gameObject) {
  app.stage.addChild(gameObject);
}
