'use strict';

require('./style.css');
import {initializeCharacters, drawCharacterSprites, moveCharacterSprites} from './character';
import {Wall} from './wall';

// Global variables
export const WIDTH = window.innerWidth;
export const VIEWPORT_HEIGHT = window.innerHeight;
export const NUM_PLAYERS = 4;
export const GAMEBOARD_HEIGHT = VIEWPORT_HEIGHT * 2;
export const START_TOP_YPOS = GAMEBOARD_HEIGHT - VIEWPORT_HEIGHT;
let top_ypos = START_TOP_YPOS;

let wall;
let characters = [];

var app = new PIXI.Application({
  width: WIDTH,
  height: VIEWPORT_HEIGHT,
  backgroundColor: 0x555555
});
document.body.appendChild(app.view);

// Socket
var socket = io.connect('http://localhost:3000');
socket.on('connect', function(){
  socket.emit('player joined', socket.id);

	console.log('hello!');
});
// socket.on('something', function (data) {
// 	console.log(data)
// })
// socket.on('news', function (data) {
// 	console.log(data);
// 	socket.emit('my other event', { my: 'data' });
// });

// Game Setup
function startGame() {
  // TODO: character movement hardcoded to character 0 and only looking for one letter label
  document.addEventListener('keydown', event => moveCharacter(characters[0], event));

  wall = new Wall();
  wall.draw();

  characters = initializeCharacters(NUM_PLAYERS);
  drawCharacterSprites(characters);

  mainLoop();
}

// Game Loop and Logic
function mainLoop() {
  if(wall.top_ypos > 0) {
    wall.shift()
  }

  wall.render();
  moveCharacterSprites(characters);

  requestAnimationFrame(mainLoop);
}

function moveCharacter(character, event) {
  let key = event.key;
  let hold = wall.filter(hold => hold.label === key)[0];

  if (hold) {
    character.move(hold.x, hold.y);
  }
}

// Initialize Game
startGame();

// Helper Functions
export function renderGameObject(gameObject) {
  app.stage.addChild(gameObject);
}
