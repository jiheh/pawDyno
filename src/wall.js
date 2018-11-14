import {WIDTH, GAMEBOARD_HEIGHT, START_TOP_YPOS} from './index';
let small_words = require('./small_words.json')

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

export class Wall{
	constructor(){
		this.top_ypos = START_TOP_YPOS 
		this.small_words = shuffle(small_words)

		// creating holds
		this.holds = []
		let num_holds_x = Math.floor(WIDTH / CHARACTER_REACH)
		let num_holds_y = Math.floor(GAMEBOARD_HEIGHT / CHARACTER_REACH)
		for(let xpos=0;xpos<num_holds_x;xpos++){
			for(let ypos=0;ypos<num_holds_y;ypos++){
				if(this.shouldDropHold(ypos, num_holds_y)){
					this.holds.push({
						'x': xpos * CHARACTER_REACH + (Math.random() - 0.5) * WIGGLE
						, 'y': ypos * CHARACTER_REACH + (Math.random() - 0.5) * WIGGLE
						, 'label': this.small_words[(xpos * num_holds_y + ypos)]
					})
				}
			}
		}

		// adding text to holds
		for(let hold of this.holds){
			let text = new PIXI.Text(hold.label, {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
			text.x = hold.x
			text.y = hold.y - START_TOP_YPOS
			hold.text = text
		}
	}

	shouldDropHold(ypos, num_holds_y){
		let shouldDrop
		if(ypos < num_holds_y / 2){
			shouldDrop = Math.random() < 0.3
		} else {
			shouldDrop = Math.random() < 0.7
		}
		return shouldDrop
	}

	render () {
		for(let hold of this.holds){
			hold.text.y = hold.y - this.top_ypos
		}
	}

	shift(){
		this.top_ypos -= 10
	}
}

