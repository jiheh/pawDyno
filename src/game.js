import Trianglify from 'trianglify';
import {VIEWPORT_HEIGHT, VIEWPORT_WIDTH} from './index';
import {Players} from './player';
import Wall from './wall';

export default class Game extends PIXI.Application {
  constructor(heightPercent, yPosPercent) {
    super(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

    this.boardHeight = heightPercent * VIEWPORT_HEIGHT;
    this.yPos = heightPercent * yPosPercent * VIEWPORT_HEIGHT; // Max 0
		this.yPosDelta = 1;
		this.holdInput = '';

    this.createBackground();
    this.createPlayers();

    // Rendering containers
    this.players;
    this.wall;
    this.backgroundMesh;
    // this.children : [Players, Wall, backgroundMesh]
  }

  // Game Setup
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

  // Game Update
  updatePlayers(newPlayers) {
    this.players.updatePlayers(newPlayers);
  }

  updateYPos(socket) {
    const DELTA_MULTIPLIER = 1.002;

    // Using -5 instead of 0 to avoid overscrolling
    if (this.yPos <= -5) {
			this.yPos += this.yPosDelta;
			this.yPosDelta *= DELTA_MULTIPLIER;
      this.stage.children.forEach(child => child.y = this.yPos);
    } else {
			socket.emit('wall complete');
		}
  }

	checkPlayerStatus(socket) {
		let player = this.players.children.find(c => c.id == socket.id);

    if (player.isAlive) {
      if (player.topPawY > -this.yPos + VIEWPORT_HEIGHT) {
  			socket.emit('player lost');
        console.log('you lost!');
  		}
    }
	}

	handleKeydown(event, socket){
		if (event.keyCode === 13) { // enter
			if (this.wall.holds[this.holdInput]) {
				socket.emit('move paw', this.holdInput);
			}
			this.holdInput = '';
		} else if (event.keyCode === 8){ // backspace
			if (this.holdInput.length > 0) {
				this.holdInput = this.holdInput.slice(0, -1);
			}
		} else if (event.key.length === 1){
			this.holdInput += event.key;
		}
	}

  // Game End
	gameOver(playerId, scoreboard) {
    if (scoreboard[playerId]) {
      console.log('you won')
    } else {
      console.log('you lost but we\'re telling you again because the game is over');
    }
	}

  // createTextSprite(spriteText) {
  //   let text = new PIXI.Text(spriteText, {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
  //   text.x = VIEWPORT_WIDTH / 2;
  //   text.y = this.yPos + (VIEWPORT_HEIGHT / 2);
  //   this.stage.addChild(text);
  //   console.log(text)
  // }
}
