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

let wall = {};
let players = new Players();
players.draw();

// Socket
var socket = io.connect('http://localhost:3000');

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
  // document.addEventListener('keydown', event => moveCharacter(characters[0], event));
  wall = new Wall(wallData);
  wall.draw();

  // renderPlayerSprites(players);

  // characters = initializeCharacters(numPlayers);
  // drawCharacterSprites(characters);

  mainLoop();
}

// Game Loop and Logic
function mainLoop() {
  if (wall.y < 0) {
    wall.y += 10;
  }

  // wall.render();
  // moveCharacterSprites(players);

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
export function renderGameObject(gameObject) {
  app.stage.addChild(gameObject);
}
