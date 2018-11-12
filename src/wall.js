import {VIEWPORT_WIDTH, VIEWPORT_HEIGHT} from './index';
let small_words = require('./small_words.json')
small_words = shuffle(small_words)

const CHARACTER_REACH = 80
const WIGGLE = 25

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

export function initializeWall(){
	let wall = []
	let num_holds_x = Math.floor(VIEWPORT_WIDTH / CHARACTER_REACH)
	let num_holds_y = Math.floor(VIEWPORT_HEIGHT / CHARACTER_REACH)
	for(let xpos=0;xpos<num_holds_x;xpos++){
		for(let ypos=0;ypos<num_holds_y;ypos++){
			if(shouldDropHold(ypos, num_holds_y)){
				wall.push({
					'x': xpos * CHARACTER_REACH + (Math.random() - 0.5) * WIGGLE
					, 'y': ypos * CHARACTER_REACH + (Math.random() - 0.5) * WIGGLE
					, 'label': small_words[(xpos * num_holds_y + ypos)]
				})
			}
		}
	}
	return wall
}

function shouldDropHold(ypos, num_holds_y){
	let shouldDrop
	if(ypos < num_holds_y / 2){
		shouldDrop = Math.random() < 0.3
	} else {
		shouldDrop = Math.random() < 0.7
	}
	return shouldDrop
}
