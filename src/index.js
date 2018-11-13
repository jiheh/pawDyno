'use strict';

require('./style.css');
import {initializeCharacters, drawCharacterSprites, moveCharacterSprites} from './character';
import {drawWall, initializeWall} from './wall';

// Global variables
export const VIEWPORT_WIDTH = window.innerWidth;
export const VIEWPORT_HEIGHT = window.innerHeight;
export const NUM_PLAYERS = 4;

let characters = [];
let wall = [];

var app = new PIXI.Application({
  width: VIEWPORT_WIDTH,
  height: VIEWPORT_HEIGHT,
  backgroundColor: 0x555555
});
document.body.appendChild(app.view);


// Game Setup
function startGame() {
  wall = initializeWall();
  drawWall(wall);

  characters = initializeCharacters(NUM_PLAYERS);
  drawCharacterSprites(characters);

  // TODO: character movement hardcoded to character 0 for now
  document.addEventListener('keydown', event => moveCharacter(characters[0], event));
  mainLoop();
}

// Game Loop and Logic
function mainLoop() {
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
