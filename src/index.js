'use strict';

require('./style.css');

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor:  0x4fbdf2
});
document.body.appendChild(app.view);

var bunny = PIXI.Sprite.fromImage('images/BunnyBody.svg')
bunny.x = 500;
bunny.y = 100;
bunny.height = 200
bunny.width = 100

var bunny_larm = PIXI.Sprite.fromImage('images/LArm.svg')
bunny_larm.x = bunny.x + bunny.width/4;
bunny_larm.y = bunny.y + bunny.height/1.5;
bunny_larm.anchor.x=1
bunny_larm.anchor.y = 1

var bunny_rarm = PIXI.Sprite.fromImage('images/RArm.svg')
bunny_rarm.x = bunny.x + bunny.width/1.5;
bunny_rarm.y = bunny.y + bunny.height/1.5;
bunny_rarm.anchor.x=0
bunny_rarm.anchor.y = 1

var bunny_leg = PIXI.Sprite.fromImage('images/BunnyLegs.svg')
bunny_leg.x = bunny.x;
bunny_leg.y = bunny.y + bunny.height;


app.stage.addChild(bunny);
app.stage.addChild(bunny_larm);
app.stage.addChild(bunny_rarm)
app.stage.addChild(bunny_leg);

/*app.ticker.add(function(delta) {
  bunny_larm.scale.y += delta*.01
  bunny_larm.scale.x += delta *.01

})*/