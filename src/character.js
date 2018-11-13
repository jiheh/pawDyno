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
    this.index = 0;
  }

  move(targetX, targetY) {
    let targetLimb = this.leftArm;
    if (targetX > (this.body.x + 1/2 * this.body.width)) {
      targetLimb = this.rightArm;
    }

    let limb;
    if (this.index % 4 === 0) {
      limb=this.leftArm;     
    }
    else if (this.index % 4 === 1) {
      limb=this.rightArm;     
    }
    else if (this.index % 4 === 2) {
      limb=this.leftLeg;     
    }
    else if (this.index % 4 === 3) {
      limb=this.rightLeg;     
    }

    limb.x = targetX;
    limb.y = targetY;
    moveBody(this);

    this.index++;
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

function moveBody(character) {
  let paws = ['leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
  let x = 0;
  let y = 0;

  paws.forEach(paw => x += character[paw].x);
  paws.forEach(paw => y += character[paw].y);

  character.body.x = x / 4;
  character.body.y = y /4;
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

let characterContainers = [];
console.log("characterContainers", characterContainers);
// Functions to render the character sprites
export function renderCharacters(characters) {
  characters.forEach(c => {
    let container = new PIXI.Container();

    characterToSprites(c).forEach(s => {
      // renderGameObject(s);
      container.addChild(s);
    });

    characterContainers.push(container);
  });

  characterContainers.forEach(c => renderGameObject(c));
}

export function updateCharacterSprites(characters) {
  characterContainers.forEach((container, indx) => {
    updateBodyPartSprites(container, characters[indx]);
  });
}

function updateBodyPartSprites(container, character) {
  container.children.forEach(bodypart => {
    bodypart.x = character[bodypart.name].x;
    bodypart.y = character[bodypart.name].y;
  })
}


function characterToSprites(character) {
  let bodyParts = ['body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];

  return bodyParts.map(bp => {
    return bodyPartToSprite(character[bp], bp);
  }).reverse();
}

function bodyPartToSprite(part, partName) {
  let sprite = PIXI.Sprite.fromImage(part.imageSrc);

  sprite.name = partName;
  sprite.height = part.height;
  sprite.width = part.width;
  sprite.x = part.x;
  sprite.y = part.y;

  return sprite;
}
