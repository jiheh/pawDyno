'use strict';

require('./style.css');

import {Character, BodyPart} from './character.js';
import {initializeWall} from './wall.js';

export const WIDTH = 640;
export const VIEWPORT_HEIGHT = 480;
export const GAMEBOARD_HEIGHT = 960;
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

// Game Setup
function startGame() {
  document.body.appendChild(app.view);
  renderWall(START_YPOS);
  mainLoop();
}

// Game Loop
function mainLoop() {
  requestAnimationFrame(mainLoop);
}

// Initialize Game
startGame();
