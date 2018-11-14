class Character {
  constructor(body, leftArm, rightArm, leftLeg, rightLeg) {
    this.body = body;
    this.leftArm = leftArm;
    this.rightArm = rightArm;
    this.leftLeg = leftLeg;
    this.rightLeg = rightLeg;
    this.currentPaw = leftArm;
  }

  move(targetX, targetY) {
    this.currentPaw.x = targetX;
    this.currentPaw.y = targetY;
    this.updateBody();

    let nextPaw = this.leftArm;
    if (this.currentPaw === this.leftArm) {
      nextPaw = this.rightArm;
    } else if (this.currentPaw === this.rightArm) {
      nextPaw = this.leftLeg;
    } else if (this.currentPaw === this.leftLeg) {
      nextPaw = this.rightLeg;
    }

    this.currentPaw = nextPaw;
  }

  updateBody() {
    let paws = ['leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
    this.body.x = paws.reduce((sumX, paw) => sumX += this[paw].x, 0) / 4;
    this.body.y = paws.reduce((sumY, paw) => sumY += this[paw].y, 0) / 4;
  }
}

class CharacterPart {
  constructor(height, width, x, y) {
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
  }
}

function createNewCharacter() {
  part = new CharacterPart(0,0,0,0);
  return new Character(
    Object.assign(part),
    Object.assign(part),
    Object.assign(part),
    Object.assign(part),
    Object.assign(part))
}

module.exports = {createNewCharacter};
