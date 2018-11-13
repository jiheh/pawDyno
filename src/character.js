import { NUM_PLAYERS, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, renderGameObject } from './index';

// Global variables
const characterHeight = 110;
const characterWidth = 52;
const pawHeight = 20;
const pawWidth = 20;

// A list of containers for each character. Each container has a body and the four paws as children.
let characterContainers = [];

class Character {
  constructor(body, leftArm, rightArm, leftLeg, rightLeg) {
    this.body = body;
    this.leftArm = leftArm;
    this.rightArm = rightArm;
    this.leftLeg = leftLeg;
    this.rightLeg = rightLeg;
    this.moves = 0;
  }

  move(targetX, targetY) {
    let paw = this.leftArm;

    if (this.moves % 4 === 1) {
      paw = this.rightArm;
    } else if (this.moves % 4 === 2) {
      paw = this.leftLeg;
    } else if (this.moves % 4 === 3) {
      paw = this.rightLeg;
    }

    paw.x = targetX;
    paw.y = targetY;

    this.updateBody();
    this.moves++;
  }

  updateBody() {
    let paws = ['leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
    this.body.x = paws.reduce((sumX, paw) => sumX += this[paw].x, 0) / 4;
    this.body.y = paws.reduce((sumY, paw) => sumY += this[paw].y, 0) / 4;
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

// Initialize Character Instances
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

// Draw Character Sprites
export function drawCharacterSprites(characters) {
  let characterParts = ['leftArm', 'rightArm', 'leftLeg', 'rightLeg', 'body'];

  characters.forEach(character => {
    let container = new PIXI.Container();

    characterParts
      .map(partName => createSprite(character[partName], partName))
      .forEach(sprite => container.addChild(sprite));

    characterContainers.push(container);
  });

  characterContainers.forEach(c => renderGameObject(c));
}

function createSprite(part, partName) {
  let sprite = PIXI.Sprite.fromImage(part.imageSrc);
  sprite.name = partName;
  sprite.height = part.height;
  sprite.width = part.width;
  sprite.x = part.x;
  sprite.y = part.y;

  return sprite;
}

// Update Character Sprite Rendering
export function moveCharacterSprites(characters) {
  characterContainers.forEach((container, idx) => {
    let character = characters[idx];

    container.children.forEach(partSprite => {
      partSprite.x = character[partSprite.name].x;
      partSprite.y = character[partSprite.name].y;
    });
  });
}
