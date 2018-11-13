'use strict';

require('./style.css');

import {initializeCharacters, renderCharacters} from './character';
import {initializeWall} from './wall';

export const NUM_PLAYERS = 4;
export const WIDTH = 640;
export const VIEWPORT_HEIGHT = 480;
export const GAMEBOARD_HEIGHT = 960;
const START_TOP_YPOS = GAMEBOARD_HEIGHT - VIEWPORT_HEIGHT;
let top_ypos = START_TOP_YPOS;
let wall;

var app = new PIXI.Application({
  width: WIDTH,
  height: VIEWPORT_HEIGHT,
  backgroundColor:  0x555555
});

function renderWall (top_ypos) {
	for(let hold of wall){
		hold.text.y = hold.y - top_ypos
  }
}

function addHoldsToStage () {
  for(let hold of wall){
    let text = new PIXI.Text(hold.label, {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
    text.x = hold.x
    text.y = hold.y - START_TOP_YPOS
    app.stage.addChild(text)
    hold.text = text
  }
}

export function renderGameObject(gameObject) {
  app.stage.addChild(gameObject);
}

// Game Setup
function startGame() {
  document.body.appendChild(app.view);

  let characters = initializeCharacters(NUM_PLAYERS);
  renderCharacters(characters);

  wall = initializeWall();
  addHoldsToStage();
  mainLoop();
}

// Game Loop
function mainLoop() {
  renderWall(top_ypos);
  if(top_ypos > 0) {
    top_ypos = top_ypos - 10;
    requestAnimationFrame(mainLoop);
  }
}

// Initialize Game
startGame();
