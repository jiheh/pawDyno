'use strict';

require('./style.css');
import {initializeCharacters, drawCharacterSprites, moveCharacterSprites} from './character';
import {renderWall} from './wall';

// Global variables
export const VIEWPORT_WIDTH = window.innerWidth;
export const VIEWPORT_HEIGHT = window.innerHeight;
export const NUM_PLAYERS = 4;
let characters = [];

var app = new PIXI.Application({
  width: VIEWPORT_WIDTH,
  height: VIEWPORT_HEIGHT,
  backgroundColor: 0x555555
});
document.body.appendChild(app.view);


// Game Setup
function startGame() {
  renderWall();

  characters = initializeCharacters(NUM_PLAYERS);
  drawCharacterSprites(characters);

  mainLoop();
}

// Game Loop
function mainLoop() {
  moveCharacterSprites(characters);
  requestAnimationFrame(mainLoop);
}

// Initialize Game
startGame();
characters[0].move(100, 100);
characters[0].move(100, 150);
characters[0].move(250, 50);
characters[0].move(250, 250);

// Helper Functions
export function renderGameObject(gameObject) {
  app.stage.addChild(gameObject);
}
