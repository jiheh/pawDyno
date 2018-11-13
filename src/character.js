import {
  NUM_PLAYERS,
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  renderGameObject
} from './index';

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

class BodyPart {
  constructor(imageSrc, height, width, rotation, anchorX, anchorY, position) {
    this.imageSrc = imageSrc;
    this.rotation = rotation;
    this.anchorX = anchorX;
    this.anchorY = anchorY;
    this.height = height;
    this.width = width;
    this.x = (VIEWPORT_WIDTH / NUM_PLAYERS * position) * .75 + (width / 2);
    this.y = VIEWPORT_HEIGHT - height;
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
    let body = new BodyPart(`images/character${idx}/body.svg`, 160, 60, 0, .5, .5, idx + 1);
    let lArm = new BodyPart(`images/character${idx}/leg.svg`, 90, 13, -.3, 0, 1, idx + 1);
    let rArm = new BodyPart(`images/character${idx}/leg.svg`, 90, 13, .3, 1, 1, idx + 1);
    let lLeg = new BodyPart(`images/character${idx}/leg.svg`, 90, 13, -2.5, 0, 0, idx + 1);
    let rLeg = new BodyPart(`images/character${idx}/leg.svg`, 90, 13, 2.5, 1, 0, idx + 1);

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
