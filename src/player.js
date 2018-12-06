import {VIEWPORT_HEIGHT, VIEWPORT_WIDTH} from './index';

const PLAYER_SPRITE_HEIGHT = 110;
const PLAYER_SPRITE_WIDTH = 52;
const PAW_SPRITE_HEIGHT = 20;
const PAW_SPRITE_WIDTH = 20;
const READY_BUTTON_HEIGHT = 46;
const READY_BUTTON_WIDTH = 153;


export class Players extends PIXI.Container {
  constructor() {
    super();
    this.players = {}; // the backend player instances
    // this.children contains the frontent player instances
  }

  // Socket only passed in during initial setup
  updatePlayers(players, socket) {
    // data
    this.players = players;

    // display objects
    this.removeChildren();
    Object.keys(players).forEach(playerId => {
      this.addChild(new Player(playerId, players[playerId], socket));
    });
  }
}

export class Player extends PIXI.Container {
  constructor(playerId, data, socket) {
    super();
    this.id = playerId;
    this.isReady = data.isReady;
    this.body = data.body;
    this.paws = data.paws;
    this.currentPawIdx = data.currentPawIdx;
    this.isAlive = data.isAlive;
		this.topPawY;

    this.createPlayerSprites(socket);
  }

  createPlayerSprites(socket) {
    this.createPlayerPartSprite(this.body, `images/character0/body.svg`, PLAYER_SPRITE_HEIGHT, PLAYER_SPRITE_WIDTH);

    this.paws.forEach(paw => {
      this.createPlayerPartSprite(paw, `images/character0/paw.svg`, PAW_SPRITE_HEIGHT, PAW_SPRITE_WIDTH);
    });

    if (socket) this.createReadyButton(socket);
  }

  createPlayerPartSprite(part, imgSrc, height, width) {
    let sprite = PIXI.Sprite.fromImage(imgSrc);

    sprite.name = part.name;
    sprite.height = height;
    sprite.width = width;
    sprite.x = part.x ? (part.x * VIEWPORT_WIDTH) : this.calcDefaultX(sprite);
    sprite.y = part.y ? (part.y * VIEWPORT_HEIGHT) : this.calcDefaultY(sprite);


		if(!this.topPawY || sprite.y < this.topPawY){
			this.topPawY = sprite.y;
		}
    this.addChild(sprite);
  }

  createReadyButton(socket) {
    // Green Ready Button
    let buttonTexture = PIXI.Texture.fromImage('images/readyButton/readyButton.svg');
    let buttonTextureDown = PIXI.Texture.fromImage('images/readyButton/readyButtonDown.svg');

    let readyButton = new PIXI.Sprite(buttonTextureDown);
    readyButton.buttonMode = true;
    readyButton.interactive = true;

    readyButton.height = READY_BUTTON_HEIGHT;
    readyButton.width = READY_BUTTON_WIDTH;
    readyButton.x = this.calcDefaultX(readyButton) - (READY_BUTTON_WIDTH / 3);
    readyButton.y = this.calcDefaultY(readyButton) - (READY_BUTTON_HEIGHT * 1.2);

    if (socket.id === this.id) {
      if (!this.isReady) {
        readyButton.texture = buttonTexture;
        readyButton.on('pointerdown', function() {
          this.texture = buttonTextureDown;
          this.isReady = true;
          socket.emit('player ready');
        });
      }

      this.addChild(readyButton);
    } else if (this.isReady) {
      this.addChild(readyButton);
    }
  }

  calcDefaultX(sprite) {
    let bodyX = this.body.x * VIEWPORT_WIDTH;
    let spriteX = bodyX;

    if (sprite.name === 'leftArm') spriteX = bodyX - PLAYER_SPRITE_WIDTH / 4.25;
    else if (sprite.name === 'rightArm') spriteX = bodyX + PLAYER_SPRITE_WIDTH * .9;
    else if (sprite.name === 'leftLeg') spriteX = bodyX - PLAYER_SPRITE_WIDTH / 4.25;
    else if (sprite.name === 'rightLeg') spriteX = bodyX + PLAYER_SPRITE_WIDTH * .9;

    return spriteX;
  }

  calcDefaultY(sprite) {
    let bodyY = this.body.y * VIEWPORT_HEIGHT;
    let spriteY = bodyY;

    if (sprite.name === 'leftArm') spriteY = bodyY + PLAYER_SPRITE_HEIGHT / 4;
    else if (sprite.name === 'rightArm') spriteY = bodyY + PLAYER_SPRITE_HEIGHT / 4;
    else if (sprite.name === 'leftLeg') spriteY = bodyY + PLAYER_SPRITE_HEIGHT / 1.5;
    else if (sprite.name === 'rightLeg') spriteY = bodyY + PLAYER_SPRITE_HEIGHT / 1.5;

    return spriteY;
  }
}
