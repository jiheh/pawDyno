import Trianglify from 'trianglify';
import {VIEWPORT_HEIGHT, VIEWPORT_WIDTH, renderGameObject} from './index';
import {Players, Player} from './player';
import Wall from './wall';

export default class Game extends PIXI.Application {
  constructor(heightPercent, yPosPercent) {
    super(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

    this.boardHeight = 3 * VIEWPORT_HEIGHT;
    this.yPos = -.66 * 3 * VIEWPORT_HEIGHT; // Max 0

    this.createBackground();
    this.createPlayers();

    // Rendering containers
    this.players;
    this.wall;
    this.backgroundMesh;
    // this.children : [Players, Wall, backgroundMesh]
  }

  createBackground() {
    let pattern = Trianglify({
      height: this.boardHeight,
      width: VIEWPORT_WIDTH,
      cell_size: 100,
      x_colors: 'Greys'
    });

    let texture = PIXI.Texture.fromCanvas(pattern.canvas());

    let mesh = new PIXI.mesh.Mesh(texture);
    mesh.width = VIEWPORT_WIDTH;

    this.setupChildContainer(mesh);
    this.backgroundMesh = mesh;
  }

  createPlayers() {
    let players = new Players();
    this.setupChildContainer(players);
    this.players = players;
  }

  updatePlayers(newPlayers) {
    this.players.updatePlayers(newPlayers);
  }

  createWall(wallData) {
    let wall = new Wall(wallData);
    this.setupChildContainer(wall);
    this.wall = wall;
  }

  setupChildContainer(child) {
    child.height = this.boardHeight;
    child.y = this.yPos;
    this.stage.addChild(child);
  }

  updateYPos(targetY) {
    if (targetY <= 0) {
      this.yPos = targetY;
      this.children.forEach(child => child.y = targetY);
    }
  }
}
