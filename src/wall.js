import {VIEWPORT_WIDTH, VIEWPORT_HEIGHT} from './index';

const CHARACTER_REACH = 80
const WIGGLE = 25

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
					, 'label': 'abcdefghijklmnopqrstuvwxyz'[(xpos * num_holds_y + ypos) % 26]
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
