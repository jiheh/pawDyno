class Player {
  constructor() {
    this.body = new PlayerPart('body');
    this.paws = [
      new PlayerPart('leftArm'),
      new PlayerPart('rightArm'),
      new PlayerPart('leftLeg'),
      new PlayerPart('rightLeg')
    ];
    this.currentPawIdx = 0;
  }

  setStartPosition(idx, numPlayers, viewWidthPercent, viewHeightPercent) {
    this.body.x = viewWidthPercent / (numPlayers + 1) * (idx + 1);
    this.body.y = viewHeightPercent / 2;
  }

  movePaw(targetX, targetY) {
    // Update paw
    let currentPaw = this.paws[this.currentPawIdx];
    currentPaw.x = targetX;
    currentPaw.y = targetY;

    // Update body
    this.body.x = this.paws.reduce((sumX, paw) => sumX += paw.x, 0) / 4;
    this.body.y = this.paws.reduce((sumY, paw) => sumY += paw.y, 0) / 4;

    // Update currentPawIdx
    this.currentPawIdx =
      this.currentPawIdx === 3 ? 0 : this.currentPawIdx + 1;
  }
}

class PlayerPart {
  constructor(name) {
    this.name = name;
    this.x = null;
    this.y = null;
  }
}

module.exports = Player;
