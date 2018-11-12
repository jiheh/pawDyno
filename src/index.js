'use strict';

require('./style.css');

const VIEWPORT_WIDTH = 640
const VIEWPORT_HEIGHT = 480
const CHARACTER_REACH = 80
const WIGGLE = 25

var app = new PIXI.Application({
	width: VIEWPORT_WIDTH
	, height: VIEWPORT_HEIGHT
	, backgroundColor:  0x555555
});


function initializeWall(){
	let wall = []
	let num_holds_x = VIEWPORT_WIDTH / CHARACTER_REACH
	let num_holds_y = VIEWPORT_HEIGHT / CHARACTER_REACH
	for(let xpos=0;xpos<num_holds_x;xpos++){
		for(let ypos=0;ypos<num_holds_y;ypos++){
			if(shouldDropHold(ypos, num_holds_y)){
				wall.push({
					'x': xpos * CHARACTER_REACH + (Math.random() - 0.5) * WIGGLE
					, 'y': ypos * CHARACTER_REACH + (Math.random() - 0.5) * WIGGLE
					, 'label': 'abcdefghijklmnopqrstuvwxyz'[(xpos * num_holds_y + ypos) % 26]
				})
			}
		}
	}
	return wall
}

function shouldDropHold(ypos, num_holds_y){
	let shouldDrop
	if(ypos < num_holds_y / 2){
		shouldDrop = Math.random() < 0.3
	} else {
		shouldDrop = Math.random() < 0.7
	}
	return shouldDrop
}

let wall = initializeWall()

document.body.appendChild(app.view);

// start animating
var count = 0;

app.ticker.add(function() {
  count += 0.1;

  renderWall();
});

function renderWall () {
	for(let hold of wall){
		let text = new PIXI.Text(hold.label, {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
		text.x = hold.x
		text.y = hold.y
		app.stage.addChild(text)
	}
}
