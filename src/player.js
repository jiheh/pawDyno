import {VIEWPORT_HEIGHT, VIEWPORT_WIDTH, renderGameObject} from './index';
import {GlowFilter} from '@pixi/filter-glow';

const PLAYER_SPRITE_HEIGHT = 110;
const PLAYER_SPRITE_WIDTH = 52;
const PAW_SPRITE_HEIGHT = 20;
const PAW_SPRITE_WIDTH = 20;

export class Players extends PIXI.Container {
  constructor() {
    super();
    this.players = {};
  }

  addPlayers(newPlayersObj) {
    console.log(newPlayersObj)
    let newPlayerIds = Object.keys(newPlayersObj);

    newPlayerIds.forEach(playerId => {
      if (!this.players[playerId]) {
        let player = newPlayersObj[playerId];
        this.players[playerId] = player;
        this.addChild(new Player(playerId, player));
      } else {
        this.updatePlayer(playerId, newPlayersObj[playerId]);
      }
    });
  }

  removePlayers(newPlayersObj) {
    let oldPlayerIds = Object.keys(this.players);

    oldPlayerIds.forEach(playerId => {
      if (!newPlayersObj[playerId]) {
        delete this.players[playerId];

        let oldContainer = this.children.find(c => c.id === playerId);
        this.removeChild(oldContainer);
      } else {
        this.updatePlayer(playerId, newPlayersObj[playerId]);
      }
    });
  }

  updatePlayers(newPlayersObj) {
    let playerIds = Object.keys(newPlayersObj);
    playerIds.forEach(playerId => this.updatePlayer(playerId, newPlayersObj[playerId]));
  }

  updatePlayer(playerId, player) {
    this.players[playerId] = player;
    let playerContainer = this.children.find(c => c.id === playerId);

    let sprites = {};
    playerContainer.children.forEach(sprite => {
      sprites[sprite.name] = sprite;
    });

    playerContainer.setSpritePosition(sprites[player.body.name], player.body);
    player.paws.forEach(paw => {
      playerContainer.setSpritePosition(sprites[paw.name], paw);
    })
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
    this.setSpritePosition(sprite, part);

    this.addChild(sprite);
  }

  setSpritePosition(sprite, part) {
    if (part.x) sprite.x = part.x * VIEWPORT_WIDTH;
    else this.setDefaultPositionX(sprite);

    if (part.y) sprite.y = part.y * VIEWPORT_HEIGHT;
    else this.setDefaultPositionY(sprite);
  }

  setDefaultPositionX(sprite) {
    let bodyX = this.body.x * VIEWPORT_WIDTH;

    if (sprite.name === 'leftArm') {
      sprite.x = bodyX - PLAYER_SPRITE_WIDTH / 4.25;
    } else if (sprite.name === 'rightArm') {
      sprite.x = bodyX + PLAYER_SPRITE_WIDTH * .9;
    } else if (sprite.name === 'leftLeg') {
      sprite.x = bodyX - PLAYER_SPRITE_WIDTH / 4.25;
    } else if (sprite.name === 'rightLeg') {
      sprite.x = bodyX + PLAYER_SPRITE_WIDTH * .9;
    }
  }

  setDefaultPositionY(sprite) {
    let bodyY = this.body.y * VIEWPORT_HEIGHT;

    if (sprite.name === 'leftArm') {
      sprite.y = bodyY + PLAYER_SPRITE_HEIGHT / 4;
    } else if (sprite.name === 'rightArm') {
      sprite.y = bodyY + PLAYER_SPRITE_HEIGHT / 4;
    } else if (sprite.name === 'leftLeg') {
      sprite.y = bodyY + PLAYER_SPRITE_HEIGHT / 1.5;
    } else if (sprite.name === 'rightLeg') {
      sprite.y = bodyY + PLAYER_SPRITE_HEIGHT / 1.5;
    }
  }
}

// Update Character Sprites
// export function moveCharacterSprites(characters) {
//   characterContainers.forEach((container, idx) => {
//     let character = characters[idx];
//
//     container.children.forEach(partSprite => {
//       partSprite.x = character[partSprite.name].x;
//       partSprite.y = character[partSprite.name].y;
//       partSprite.filters = character[partSprite.name] === character.currentPaw ? [ new GlowFilter(2, 2, 0, 0xFFFFFF, .1) ] : [];
//     });
//   });
// }
