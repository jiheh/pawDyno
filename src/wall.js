import {VIEWPORT_HEIGHT, VIEWPORT_WIDTH, renderGameObject} from './index';

export default class Wall extends PIXI.Container {
	constructor(data) {
		super();
		this.y = (data.heightPercent * VIEWPORT_HEIGHT) * data.yPosition;
		this.holds = data.holds;

		this.createHoldSprites();
	}

	createHoldSprites() {
	  for (let hold of this.holds) {
			let text = new PIXI.Text(hold.label, {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
			text.position.set(hold.x * VIEWPORT_WIDTH, hold.y * VIEWPORT_HEIGHT);
			this.addChild(text);
		}
	}

	draw() {
		renderGameObject(this);
	}
}
