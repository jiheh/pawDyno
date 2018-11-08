export class Character {
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

export class BodyPart {
  constructor(imageSrc, x, y, height, width, rotation, anchorX, anchorY) {
    this.imageSrc = imageSrc;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.rotation = rotation;
    this.anchorX = anchorX;
    this.anchorY = anchorY;
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
