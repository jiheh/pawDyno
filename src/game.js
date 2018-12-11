import Trianglify from 'trianglify';
import {VIEWPORT_HEIGHT, VIEWPORT_WIDTH} from './index';
import {Wall, WallHighlights} from './wall';
import {Players} from './player';

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
    this.wallHighlights;
    this.backgroundMesh;
    this.instructions;
    // this.children : [Players, Wall, backgroundMesh, instructions]
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
		mesh.height = this.boardHeight;
    this.backgroundMesh = mesh;
  }

  createPlayers() {
    let players = new Players();
    this.setupChildContainer(players);
    this.players = players;
  }

  createWall(wallData) {
    let wall = new Wall(wallData);
    let wallHighlights = new WallHighlights(wallData);
    this.setupChildContainer(wall);
    this.setupChildContainer(wallHighlights);
    this.wall = wall;
    this.wallHighlights = wallHighlights;
  }

  setupChildContainer(child) {
    child.y = this.yPos;
    this.stage.addChild(child);
  }

  // Game Update
  updatePlayers(newPlayers, socket) {
    this.players.updatePlayers(newPlayers, socket);
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
		let player = this.players.children.find(c => c.id === socket.id);

    if (player.isAlive) {
      if (player.topPawY > -this.yPos + VIEWPORT_HEIGHT) {
  			socket.emit('player lost');
        console.log('you lost!');
  		}
    }
	}

	handleKeydown(event, socket){
		console.log('******')
		console.log(this.players.children)
		console.log(socket.id)
		let player = this.players.children.find(c => c.id === socket.id);
		console.log(player.isAlive)
		if(player.isAlive){
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
			this.wallHighlights.createHighlights(this.holdInput);
		}
	}

  // Game End
	gameOver(playerId, players) {
    if (players[playerId].isAlive) {
      console.log('you won')
    } else {
      console.log('you lost but we\'re telling you again because the game is over');
    }

    let playersRanking = [];
    Object.keys(players).forEach(id => {
      let player = Object.assign(players[id], {id: id});
      playersRanking.push(player);
    });

    playersRanking = playersRanking
      .sort((p1, p2) => p1.body.y - p2.body.y)
      .map((player, idx) => {
        return `Rank${idx + 1}: ${player.id === playerId ? 'YOU' : 'NOT YOU'}`
      });

    console.log(playersRanking);
	}

  // createTextSprite(spriteText) {
  //   let text = new PIXI.Text(spriteText, {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
  //   text.x = VIEWPORT_WIDTH / 2;
  //   text.y = this.yPos + (VIEWPORT_HEIGHT / 2);
  //   this.stage.addChild(text);
  //   console.log(text)
  // }
}
