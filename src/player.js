import {VIEWPORT_HEIGHT, VIEWPORT_WIDTH, renderGameObject} from './index';
import {GlowFilter} from '@pixi/filter-glow';

const PLAYER_SPRITE_HEIGHT = 110;
const PLAYER_SPRITE_WIDTH = 52;
const PAW_SPRITE_HEIGHT = 20;
const PAW_SPRITE_WIDTH = 20;

export class Players extends PIXI.Container {
  constructor() {
    super();
    this.players = {}; // the backend player instances
    // this.children contains the frontent player instances
  }

  updateContainer(height, targetY) {
    this.height = height;
    this.y = targetY;
  }

  updatePlayers(players) {
    // data
    this.players = players;

    // display objects
    this.removeChildren();
    Object.keys(players).forEach(playerId => {
      this.addChild(new Player(playerId, players[playerId]));
    });
  }

  draw() {
    renderGameObject(this);
  }
}

export class Player extends PIXI.Container {
  constructor(playerId, data) {
    super();
    this.id = playerId;
    this.body = data.body;
    this.paws = data.paws;
    this.currentPawIdx = data.currentPawIdx;

    this.createPlayerSprites();
  }

  createPlayerSprites() {
    this.createPlayerPartSprite(this.body, `images/character0/body.svg`, PLAYER_SPRITE_HEIGHT, PLAYER_SPRITE_WIDTH);

    this.paws.forEach(paw => {
      this.createPlayerPartSprite(paw, `images/character0/paw.svg`, PAW_SPRITE_HEIGHT, PAW_SPRITE_WIDTH);
    });
  }

  createPlayerPartSprite(part, imgSrc, height, width) {
    let sprite = PIXI.Sprite.fromImage(imgSrc);

    sprite.name = part.name;
    sprite.height = height;
    sprite.width = width;
    sprite.x = part.x ? (part.x * VIEWPORT_WIDTH) : this.calcDefaultX(sprite);
    sprite.y = part.y ? (part.y * VIEWPORT_HEIGHT) : this.calcDefaultY(sprite);

    this.addChild(sprite);
  }

  calcDefaultX(sprite) {
    let bodyX = this.body.x * VIEWPORT_WIDTH;

    if (sprite.name === 'leftArm') {
      return bodyX - PLAYER_SPRITE_WIDTH / 4.25;
    } else if (sprite.name === 'rightArm') {
      return bodyX + PLAYER_SPRITE_WIDTH * .9;
    } else if (sprite.name === 'leftLeg') {
      return bodyX - PLAYER_SPRITE_WIDTH / 4.25;
    } else if (sprite.name === 'rightLeg') {
      return bodyX + PLAYER_SPRITE_WIDTH * .9;
    }
  }

  calcDefaultY(sprite) {
    let bodyY = this.body.y * VIEWPORT_HEIGHT;

    if (sprite.name === 'leftArm') {
      return bodyY + PLAYER_SPRITE_HEIGHT / 4;
    } else if (sprite.name === 'rightArm') {
      return bodyY + PLAYER_SPRITE_HEIGHT / 4;
    } else if (sprite.name === 'leftLeg') {
      return bodyY + PLAYER_SPRITE_HEIGHT / 1.5;
    } else if (sprite.name === 'rightLeg') {
      return bodyY + PLAYER_SPRITE_HEIGHT / 1.5;
    }
  }
}
