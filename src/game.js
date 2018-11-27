import Trianglify from 'trianglify';
import {VIEWPORT_HEIGHT, VIEWPORT_WIDTH, renderGameObject} from './index';
import {Players, Player} from './player';
import Wall from './wall';

export default class Game extends PIXI.Application {
  constructor(heightPercent, yPosPercent) {
    super(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

    this.boardHeight = heightPercent * VIEWPORT_HEIGHT;
    this.yPos = heightPercent * yPosPercent * VIEWPORT_HEIGHT; // Max 0
		this.yPosDelta = 1
		this.holdInput = ''

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

  updateYPos(socket) {
    if (this.yPos <= 0) {
			this.yPos += this.yPosDelta
			this.yPosDelta *= 1.002
      this.stage.children.forEach(child => child.y = this.yPos);
    }else{
			socket.emit('game finished')
		}
  }

	checkPlayerStatus(socket) {
		let player = this.players.children.find(c => c.id == socket.id);
		if(player.topPawY > -this.yPos + VIEWPORT_HEIGHT){
			socket.emit('player lost')
		}
	}

	handleKeydown(event, socket){
		if (event.keyCode === 13) { // enter
			if (this.wall.holds[this.holdInput]) {
				socket.emit('movePaw', this.holdInput);
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

	gameOver(type){
		console.log(type)
		if(type === 'lose'){
			console.log('you lost')
		}else if(type === 'win'){
			console.log('you won')
		}
	}
}
