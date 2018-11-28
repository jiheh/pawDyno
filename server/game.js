const Wall = require('./wall');
const Player = require('./player');

const FPS = 30;
const LOBBY_TIMER = 3000;

// All measurements are in decimals and represent the % from the top of the
// screen (Y) or from the left of the screen (X)
const BOARD_HEIGHT_PERCENT = 1.5;
const VIEW_HEIGHT_PERCENT = 1;
const VIEW_WIDTH_PERCENT = 1;

class Game {
  constructor() {
    this.heightPercent = VIEW_HEIGHT_PERCENT * BOARD_HEIGHT_PERCENT;
    this.widthPercent = VIEW_WIDTH_PERCENT;
		this.yPosPercent = (VIEW_HEIGHT_PERCENT / BOARD_HEIGHT_PERCENT) - VIEW_HEIGHT_PERCENT; // Max == 0

    this.wall = {};
    this.players = {};

    this.updateFn;
  }

  // Player Setup
  setupPlayer(io, socket) {
    socket.emit('setup env', {heightPercent: this.heightPercent, yPosPercent: this.yPosPercent});

    this.players[socket.id] = new Player();
    this.setPlayerStartPos(io);
  }

  removePlayer(io, socket) {
    delete this.players[socket.id];
    this.setPlayerStartPos(io);
  }

  setPlayerStartPos(io) {
    let playerIds = Object.keys(this.players);

    playerIds.forEach((playerId, idx) => {
      let player = this.players[playerId];
      player.setStartPosition(idx, playerIds.length, this.heightPercent, this.widthPercent);
    });

    io.emit('setup players', {players: this.players});
  }

  // Game Setup
  createLobby(io) {
    setTimeout(() => this.startGame(io), LOBBY_TIMER);
  }

  startGame(io) {
    this.wall = new Wall(this.heightPercent, this.widthPercent);
    io.emit('game start', {wall: this.wall});
    this.updateFn = this.broadcastState(io);
  }

  // Game Update
  broadcastState(io) {
    let gameState = {
      // yPosPercent: this.yPosPercent,
      players: this.players
    };

    setInterval(() => io.emit('game state', gameState), 1000 / FPS);
  }

  movePlayer(holdInput, socket) {
    let hold = this.wall.holds[holdInput];

    if (hold) {
      let player = this.players[socket.id];
      player.movePaw(hold);
    }
  }

  markPlayerLost(io, socketId) {
    this.players[socketId].isAlive = false;

    let playerIds = Object.keys(this.players);
    let allPlayersLost = true;

    for (let playerId in this.players) {
      if (this.players[playerId].isAlive) {
        allPlayersLost = false;
        break;
      }
    }

    if (allPlayersLost) this.sendWonLost(io);
  }

	// Game End
	sendWonLost(io) {
    let scoreboard = {};
    Object.keys(this.players).forEach(playerId => {
      scoreboard[playerId] = this.players[playerId].isAlive;
    });

    io.emit('game end', {scoreboard: scoreboard});
    clearInterval(this.updateFn);
	}
}

module.exports = Game;
