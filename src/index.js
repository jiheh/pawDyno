'use strict';

require('./style.css');

import {initializeCharacters, renderCharacters, updateCharacterSprites} from './character';
import {initializeWall} from './wall';

export const VIEWPORT_WIDTH = window.innerWidth;
export const VIEWPORT_HEIGHT = window.innerHeight;
export const NUM_PLAYERS = 4;
let characters = [];

var app = new PIXI.Application({
  width: VIEWPORT_WIDTH,
  height: VIEWPORT_HEIGHT,
  backgroundColor:  0x555555
});

function renderWall () {
  let wall = initializeWall();

	for(let hold of wall){
		let text = new PIXI.Text(hold.label, {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
		text.x = hold.x
		text.y = hold.y
		app.stage.addChild(text)
  }
}

export function renderGameObject(gameObject) {
  app.stage.addChild(gameObject);
}

// Game Setup
function startGame() {
  document.body.appendChild(app.view);

  renderWall();

  characters = initializeCharacters(NUM_PLAYERS);
  renderCharacters(characters);

  mainLoop();
}

// Game Loop
let tracker = 0;
function mainLoop() {
  characters[0].move(100, 100);

  if (tracker % 10 === 0) {
    updateCharacterSprites(characters);
  }

  tracker++;
  requestAnimationFrame(mainLoop);
}

// Initialize Game
startGame();
