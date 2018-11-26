// All measurements are in decimals and represent the % from the top of the
// screen (Y) or from the left of the screen (X)

let labels = require('./small_words.json');
let shuffledLabels = shuffle(labels);

class Wall {
	constructor(boardHeightPercent, viewHeightPercent, viewWidthPercent) {
		this.heightPercent = viewHeightPercent * boardHeightPercent;
		this.yPosition = (viewHeightPercent / boardHeightPercent) - viewHeightPercent; // Max == 0
		this.holds = [];

		this.createHolds(viewWidthPercent);
	}

  createHolds(viewWidthPercent) {
		const PLAYER_REACH = .1;
		const WIGGLE = .05;

		let numHoldsY = this.heightPercent / PLAYER_REACH;
    let numHoldsX = viewWidthPercent / PLAYER_REACH;

    for (let x = 0; x < numHoldsX; x++) {
      for (let y = 0; y < numHoldsY; y++) {
        if (this.shouldDropHold(y, numHoldsY)) {
					let hold = {
            x: (x * PLAYER_REACH) + (Math.random() * WIGGLE),
            y: (y * PLAYER_REACH) + (Math.random() * WIGGLE),
            label: shuffledLabels[x * numHoldsY + y]
          };

          this.holds.push(hold);
        }
      }
    }
  }

	shouldDropHold(y, numHoldsY) {
    return y < numHoldsY / 2 ? Math.random() < 0.3 : Math.random() < 0.7;
	}

	shiftY(targetyPosition) {
		if (targetyPosition < 0 && targetyPosition > this.yPosition) {
			this.yPosition = targetyPosition;
		}
	}
}

function shuffle(array) {
	// copied from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = Wall;
