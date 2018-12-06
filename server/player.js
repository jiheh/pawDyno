class Player {
  constructor(socket) {
    this.socket = socket;
    this.isReady = false;

    this.body = new PlayerPart('body');
    this.paws = [
      new PlayerPart('leftArm'),
      new PlayerPart('rightArm'),
      new PlayerPart('leftLeg'),
      new PlayerPart('rightLeg')
    ];
    this.currentPawIdx = 0;
		this.isAlive = true;
  }

  getData() {
    return {
      isReady: this.isReady,
      body: this.body,
      paws: this.paws,
      currentPawIdx: this.currentPawIdx,
      isAlive: this.isAlive
    }
  }

  setStartPosition(idx, numPlayers, heightPercent, widthPercent) {
    this.body.x = widthPercent / (numPlayers + 1) * (idx + 1);
    this.body.y = heightPercent - .6;
  }

  movePaw(newHold) {
    // Update paw
		if (this.isAlive && !newHold.inUse) {
      let currentPaw = this.paws[this.currentPawIdx];

      if (currentPaw.hold) currentPaw.hold.inUse = false;
      currentPaw.hold = newHold;
      newHold.inUse = true;

      currentPaw.x = newHold.x;
      currentPaw.y = newHold.y;

      // Update body
      this.body.x = this.paws.reduce((sumX, paw) => sumX += paw.x ? paw.x : this.body.x, 0) / 4;
      this.body.y = this.paws.reduce((sumY, paw) => sumY += paw.y ? paw.y : this.body.y, 0) / 4;

      // Update currentPawIdx
      this.currentPawIdx = this.currentPawIdx === 3 ? 0 : this.currentPawIdx + 1;
    }
  }
}

class PlayerPart {
  constructor(name) {
    this.name = name;
    this.x = null;
    this.y = null;
    this.hold = null;
  }
}

module.exports = Player;
