'use strict';

require('./style.css');

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 	0x4fbdf2
});
document.body.appendChild(app.view);

// Create a container for every animal
let dogBody = PIXI.Sprite.fromImage('images/dogBody.svg');
let dogLeftArm = PIXI.Sprite.fromImage('images/leg.svg');
let dogRightArm = PIXI.Sprite.fromImage('images/leg.svg');
let dogLeftLeg = PIXI.Sprite.fromImage('images/leg.svg');
let dogRightLeg = PIXI.Sprite.fromImage('images/leg.svg');

dogBody.width = 60.71;
dogBody.height = 164.6;
dogBody.x = app.screen.width / 2 - dogBody.width;
dogBody.y = app.screen.height - dogBody.height;

dogLeftArm.anchor.set(1);
dogLeftArm.rotation += -.3;
dogLeftArm.height = 89.8;
dogLeftArm.width = 13.1;
dogLeftArm.x = dogBody.x + dogLeftArm.width / 4;
dogLeftArm.y = dogBody.y + 100;

dogRightArm.rotation = .3;
dogRightArm.x = dogBody.x + dogBody.width - 8;
dogRightArm.y = dogBody.y + 30;

// dogLeftLeg.rotation = .3;
// dogLeftLeg.x = 150;
// dogLeftLeg.y = 150;
//
// dogRightLeg.rotation = .3;
// dogRightLeg.x = 200;
// dogRightLeg.y = 200;

app.stage.addChild(dogBody);
app.stage.addChild(dogLeftArm);
app.stage.addChild(dogRightArm);
// app.stage.addChild(dogLeftLeg);
// app.stage.addChild(dogRightLeg);

let xScale = 1;
let yScale = 1;

let targetX = 100;
let targetY = 100;

xScale = (dogLeftArm.x - targetX) / dogLeftArm.width;
yScale = (dogLeftArm.y - targetY) / dogLeftArm.height;

mainLoop();

function mainLoop() {
  if (dogLeftArm.scale.y < yScale) {
    dogLeftArm.scale.y += .1;
  }

  requestAnimationFrame(mainLoop);
}
