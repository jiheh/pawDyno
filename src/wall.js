import {VIEWPORT_HEIGHT, VIEWPORT_WIDTH} from './index';

export default class Wall extends PIXI.Container {
	constructor(data) {
		super();
		this.holds = data.holds;

		this.createHoldSprites();
	}

	createHoldSprites() {
	  for (let holdLabel of Object.keys(this.holds)) {
			let hold = this.holds[holdLabel]
			let text = new PIXI.Text(hold.label, {fontFamily : 'Arial', fontSize: 20, fill : 0xff1010, align : 'center'});
			text.position.set(hold.x * VIEWPORT_WIDTH, hold.y * VIEWPORT_HEIGHT);
			this.addChild(text);
		}
	}
}
