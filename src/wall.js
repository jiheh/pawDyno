import {VIEWPORT_HEIGHT, VIEWPORT_WIDTH} from "./index";
import {GlowFilter} from "@pixi/filter-glow";
import * as PIXI from "pixi.js";

export class Wall extends PIXI.Container {
  constructor(data) {
    super();
    this.holds = data.holds;

    this.createHoldSprites();
  }

  createHoldSprites() {
    for (let holdLabel of Object.keys(this.holds)) {
      let hold = this.holds[holdLabel];

      let baseText = new PIXI.Text(hold.label, {
        fontFamily: "Arial",
        fontSize: 20,
        fontWeight: "bold",
        fill: "black",
        align: "center",
        stroke: "white",
        strokeThickness: 5
      });
      baseText.position.set(hold.x * VIEWPORT_WIDTH, hold.y * VIEWPORT_HEIGHT);
      this.addChild(baseText);
    }
  }
}

export class WallHighlights extends PIXI.Container {
  constructor(data) {
    super();
    this.holds = data.holds;
  }

  createHighlights(holdInput) {
    this.removeChildren();
    if (holdInput.length === 0) {
      return;
    }
    for (let holdLabel of Object.keys(this.holds)) {
      let hold = this.holds[holdLabel];

      if (hold.label.slice(0, holdInput.length) === holdInput) {
        let highlightText = new PIXI.Text(holdInput, {
          fontFamily: "Arial",
          fontSize: 20,
          fontWeight: "bold",
          fill: "black",
          align: "center",
          stroke: "white",
          strokeThickness: 5
        });
        highlightText.filters = [new GlowFilter(2, 2, 0, 0xffffff, 0.1)];
        highlightText.position.set(hold.x * VIEWPORT_WIDTH, hold.y * VIEWPORT_HEIGHT);
        this.addChild(highlightText);
      }
    }
  }
}
