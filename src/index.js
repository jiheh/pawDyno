'use strict';

require('./style.css');

import {initializeCharacters, renderCharacters} from './character';
import {initializeWall} from './wall';

export const WIDTH = window.innerWidth;
export const VIEWPORT_HEIGHT = window.innerHeight;
export const NUM_PLAYERS = 4;
export const GAMEBOARD_HEIGHT = VIEWPORT_HEIGHT * 2;
const START_YPOS = GAMEBOARD_HEIGHT - VIEWPORT_HEIGHT;

var app = new PIXI.Application({
  width: WIDTH,
  height: VIEWPORT_HEIGHT,
  backgroundColor:  0x555555
});

function renderWall (min_ypos) {
  let wall = initializeWall();

	for(let hold of wall){
		let text = new PIXI.Text(hold.label, {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
		text.x = hold.x
		text.y = hold.y - min_ypos
		app.stage.addChild(text)
  }
}

export function renderGameObject(gameObject) {
  app.stage.addChild(gameObject);
}

// Game Setup
function startGame() {
  document.body.appendChild(app.view);
<<<<<<< HEAD

  renderWall();

  let characters = initializeCharacters(NUM_PLAYERS);
  renderCharacters(characters);

=======
  renderWall(START_YPOS);
>>>>>>> Recalculate y position based on initial viewport window
  mainLoop();
}

// Game Loop
function mainLoop() {
  requestAnimationFrame(mainLoop);
}

// Initialize Game
startGame();
