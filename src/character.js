import {
  NUM_PLAYERS,
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  renderGameObject
} from './index';

const characterHeight = 110;
const characterWidth = 52;
const pawHeight = 20;
const pawWidth = 20;

class Character {
  constructor(body, leftArm, rightArm, leftLeg, rightLeg) {
    this.body = body;
    this.leftArm = leftArm;
    this.rightArm = rightArm;
    this.leftLeg = leftLeg;
    this.rightLeg = rightLeg;
  }

  move(targetX, targetY) {
    let targetLimb = this.leftArm;
    if (targetX > (this.body.x + 1/2 * this.body.width)) {
      targetLimb = this.rightArm;
    }

    moveBody(this, targetX, targetY);

    if (targetLimb === this.leftArm) {
      moveLeftLeg(this, targetX, targetY);
      moveLeftArm(this, targetX, targetY);
    } else {
      moveRightLeg(this, targetX, targetY);
      moveRightArm(this, targetX, targetY);
    }
  }
}

class CharacterPart {
  constructor(imageSrc, height, width, x, y) {
    this.imageSrc = imageSrc;
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
  }
}

function moveBody(character, targetX, targetY) {

}

function moveLeftArm(character, targetX, targetY) {

}

function moveRightArm(character, targetX, targetY) {

}

function moveLeftLeg(character, targetX, targetY) {

}

function moveRightLeg(character, targetX, targetY) {

}

// Functions to initialize characters
export function initializeCharacters(numPlayers) {
  let characters = new Array(numPlayers).fill(null);

  // TODO: Better calculations for (x, y) of parts
  return characters.map((_, idx) => {
    let bodyX = VIEWPORT_WIDTH / NUM_PLAYERS * (idx + 1) * .75 + (characterWidth / 2);
    let bodyY = VIEWPORT_HEIGHT - characterHeight;

    let body = new CharacterPart(`images/character${idx}/body.svg`, characterHeight, characterWidth, bodyX, bodyY);
    let lArm = new CharacterPart(`images/character${idx}/paw.svg`, pawHeight, pawWidth, bodyX - characterWidth / 4.25, bodyY + characterHeight / 4);
    let rArm = new CharacterPart(`images/character${idx}/paw.svg`, pawHeight, pawWidth, bodyX + characterWidth * .9, bodyY + characterHeight / 4);
    let lLeg = new CharacterPart(`images/character${idx}/paw.svg`, pawHeight, pawWidth, bodyX - characterWidth / 4.25, bodyY + characterHeight / 1.5);
    let rLeg = new CharacterPart(`images/character${idx}/paw.svg`, pawHeight, pawWidth, bodyX + characterWidth * .9, bodyY + characterHeight / 1.5);

    return new Character(body, lArm, rArm, lLeg, rLeg);
  });
}

// Functions to render the character sprites
export function renderCharacters(characters) {
  characters.forEach(c => {
    let characterSprites = characterToSprites(c);
    characterSprites.forEach(s => renderGameObject(s));
  });
}

function characterToSprites(character) {
  let bodyParts = Object.keys(character);

  return bodyParts.map(bp => {
    return bodyPartToSprite(character[bp]);
  }).reverse();
}

function bodyPartToSprite(part) {
  let sprite = PIXI.Sprite.fromImage(part.imageSrc);

  sprite.height = part.height;
  sprite.width = part.width;
  sprite.x = part.x;
  sprite.y = part.y;

  return sprite;
}
