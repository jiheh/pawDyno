const Wall = require('./wall');
const Player = require('./player');

class Game {
  constructor() {
    this.FPS = 30;
    this.LOBBY_TIMER = 3000;
    this.BOARD_HEIGHT_PERCENT = 3;

    this.viewHeightPercent = 1;
    this.viewWidthPercent = 1;

    this.wall = {};
    this.players = {};
  }

	movePlayer(holdInput, socket){
		let hold = this.wall.holds[holdInput]
		if(hold){
			let player = this.players[socket.id]
			player.movePaw(hold.x, hold.y)
		}
	}

  createPlayer(io, socket) {
    this.players[socket.id] = new Player();
    this.setPlayerStartPositions();
    io.emit('player joined', {players: this.players});
  }

  removePlayer(io, socket) {
    delete this.players[socket.id];
    console.log(Object.keys(this.players));
    this.setPlayerStartPositions();
    io.emit('player disconnected', {players: this.players});
  }

  setPlayerStartPositions() {
    let playerIds = Object.keys(this.players);

    playerIds.forEach((playerId, idx) => {
      let player = this.players[playerId];
      player.setStartPosition(idx, playerIds.length, this.viewHeightPercent, this.viewWidthPercent);
    });
  }

  createLobby(io) {
    setTimeout(() => this.start(io), this.LOBBY_TIMER);
  }

  start(io) {
    this.wall = new Wall(this.BOARD_HEIGHT_PERCENT, this.viewHeightPercent, this.viewWidthPercent);
    io.emit('start game', {wall: this.wall});
    this.broadcastState(io);
  }

  broadcastState(io) {
    let gameState = {
      wallYPosition: this.wall.yPosition,
      players: this.players
    };

    setInterval(() => io.emit('game state', gameState), 1000 / this.FPS);
  }
}

module.exports = Game;
