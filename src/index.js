'use strict';

require('./style.css');

const VIEWPORT_WIDTH = 640
const VIEWPORT_HEIGHT = 480

var app = new PIXI.Application({
	width: VIEWPORT_WIDTH
	, height: VIEWPORT_HEIGHT
	, backgroundColor:  0x555555
});


function initializeWall(){
	let wall = []
	for(let i=0;i<10;i++){
		wall.push({
			'x': Math.random() * VIEWPORT_WIDTH
			, 'y': Math.random() * VIEWPORT_HEIGHT
			, 'label': 'abcdefghijklmnopqrstuvwxyz'[i % 26]
		})
	}
	return wall
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
