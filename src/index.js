'use strict';

require('./style.css');

import {Character, BodyPart} from './character.js';
import {initializeWall} from './wall.js';

export const VIEWPORT_WIDTH = 640;
export const VIEWPORT_HEIGHT = 480;

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

// Game Setup
function startGame() {
  document.body.appendChild(app.view);
  renderWall();
  mainLoop();
}

// Game Loop
function mainLoop() {
  // if (dogLeftArm.scale.y < yScale) {
  //   dogLeftArm.scale.y += .1;
  // }

  requestAnimationFrame(mainLoop);
}

// Initialize Game
startGame();




// Create a container for every animal
// let dogBody = PIXI.Sprite.fromImage('images/dogBody.svg');
// let dogLeftArm = PIXI.Sprite.fromImage('images/leg.svg');
// let dogRightArm = PIXI.Sprite.fromImage('images/leg.svg');
// let dogLeftLeg = PIXI.Sprite.fromImage('images/leg.svg');
// let dogRightLeg = PIXI.Sprite.fromImage('images/leg.svg');
//
// dogBody.width = 60;
// dogBody.height = 160;
// dogBody.x = app.screen.width / 2 - dogBody.width;
// dogBody.y = app.screen.height - dogBody.height;
//
// dogLeftArm.anchor.set(1);
// dogLeftArm.rotation += -.3;
// dogLeftArm.height = 89.8;
// dogLeftArm.width = 13.1;
// dogLeftArm.x = dogBody.x + dogLeftArm.width / 4;
// dogLeftArm.y = dogBody.y + 100;
//
// dogRightArm.rotation = .3;
// dogRightArm.x = dogBody.x + dogBody.width - 8;
// dogRightArm.y = dogBody.y + 30;
//
// // dogLeftLeg.rotation = .3;
// // dogLeftLeg.x = 150;
// // dogLeftLeg.y = 150;
// //
// // dogRightLeg.rotation = .3;
// // dogRightLeg.x = 200;
// // dogRightLeg.y = 200;
//
// app.stage.addChild(dogBody);
// app.stage.addChild(dogLeftArm);
// app.stage.addChild(dogRightArm);
// // app.stage.addChild(dogLeftLeg);
// // app.stage.addChild(dogRightLeg);
//
// let xScale = 1;
// let yScale = 1;
//
// let targetX = 100;
// let targetY = 100;
//
// xScale = (dogLeftArm.x - targetX) / dogLeftArm.width;
// yScale = (dogLeftArm.y - targetY) / dogLeftArm.height;
//
//
//
//
// var bunny = PIXI.Sprite.fromImage('images/BunnyBody.svg');
// bunny.x = 500;
// bunny.y = 100;
// bunny.height = 160;
// bunny.width = 60;
//
// var bunny_larm = PIXI.Sprite.fromImage('images/LArm.svg')
// bunny_larm.x = bunny.x + bunny.width/4;
// bunny_larm.y = bunny.y + bunny.height/1.5;
// bunny_larm.anchor.x=1
// bunny_larm.anchor.y = 1
//
// var bunny_rarm = PIXI.Sprite.fromImage('images/RArm.svg')
// bunny_rarm.x = bunny.x + bunny.width/1.5;
// bunny_rarm.y = bunny.y + bunny.height/1.5;
// bunny_rarm.anchor.x=0
// bunny_rarm.anchor.y = 1
//
// var bunny_leg = PIXI.Sprite.fromImage('images/BunnyLegs.svg')
// bunny_leg.x = bunny.x;
// bunny_leg.y = bunny.y + bunny.height;
//
//
// app.stage.addChild(bunny);
// app.stage.addChild(bunny_larm);
// app.stage.addChild(bunny_rarm)
// app.stage.addChild(bunny_leg);
