'use strict';

require('./style.css');

import {initializeCharacters, renderCharacters} from './character';
import {Wall} from './wall';

export const WIDTH = window.innerWidth;
export const VIEWPORT_HEIGHT = window.innerHeight;
export const NUM_PLAYERS = 4;
export const GAMEBOARD_HEIGHT = VIEWPORT_HEIGHT * 2;
export const START_TOP_YPOS = GAMEBOARD_HEIGHT - VIEWPORT_HEIGHT;
let top_ypos = START_TOP_YPOS;
let wall;

var app = new PIXI.Application({
  width: WIDTH,
  height: VIEWPORT_HEIGHT,
  backgroundColor:  0x555555
});

var socket = io.connect('http://localhost:3000');
socket.on('connect', function(){
	console.log('hello!');
})
socket.on('something', function (data) {
	console.log(data)
})
socket.on('news', function (data) {
	console.log(data);
	socket.emit('my other event', { my: 'data' });
});


export function renderGameObject(gameObject) {
  app.stage.addChild(gameObject);
}

// Game Setup
function startGame() {
  document.body.appendChild(app.view);

  let characters = initializeCharacters(NUM_PLAYERS);
  renderCharacters(characters);

  wall = new Wall();
	for(let hold of wall.holds){
		app.stage.addChild(hold.text)
	}
  mainLoop();
}

// Game Loop
function mainLoop() {
  wall.render();
	wall.shift()
  if(wall.top_ypos > 0) {
    requestAnimationFrame(mainLoop);
  }
}

// Initialize Game
startGame();
