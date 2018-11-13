import {
  NUM_PLAYERS,
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  renderGameObject
} from './index';

const characterHeight = 160;
const characterWidth = 60;

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
  constructor(imageSrc, height, width, rotation, anchorX, anchorY, x, y) {
    this.imageSrc = imageSrc;
    this.height = height;
    this.width = width;
    this.rotation = rotation;
    this.anchorX = anchorX;
    this.anchorY = anchorY;
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

  return characters.map((_, idx) => {
    let bodyX = VIEWPORT_WIDTH / NUM_PLAYERS * (idx + 1) * .75 + (characterWidth / 2);
    let bodyY = VIEWPORT_HEIGHT - characterHeight / 2;

    let body = new CharacterPart(`images/character${idx}/body.svg`, characterHeight, characterWidth, 0, .5, .5, bodyX, bodyY);
    let lArm = new CharacterPart(`images/character${idx}/leg.svg`, 90, 13, -.75, 0, 1, bodyX, bodyY);
    let rArm = new CharacterPart(`images/character${idx}/leg.svg`, 90, 13, .75, 1, 1, bodyX, bodyY);
    let lLeg = new CharacterPart(`images/character${idx}/leg.svg`, 90, 13, -2.45, 1, 1, bodyX, bodyY);
    let rLeg = new CharacterPart(`images/character${idx}/leg.svg`, 90, 13, 2.45, 0, 1, bodyX, bodyY);

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
  });
}

function bodyPartToSprite(part) {
  let sprite = PIXI.Sprite.fromImage(part.imageSrc);

  sprite.height = part.height;
  sprite.width = part.width;
  sprite.x = part.x;
  sprite.y = part.y;
  sprite.rotation += part.rotation;
  sprite.anchor.set(part.anchorX, part.anchorY);

  return sprite;
}
