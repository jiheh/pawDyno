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
  constructor(id) {
    this.heightPercent = VIEW_HEIGHT_PERCENT * BOARD_HEIGHT_PERCENT;
    this.widthPercent = VIEW_WIDTH_PERCENT;
		this.yPosPercent = (VIEW_HEIGHT_PERCENT / BOARD_HEIGHT_PERCENT) - VIEW_HEIGHT_PERCENT; // Max == 0

    this.wall = {};
    this.players = {};

    this.updateFn;
		this.id = id;
		this.inPlay = false;
  }

  // Player Setup
  setupPlayer(io, socket) {
    socket.emit('setup env', {heightPercent: this.heightPercent, yPosPercent: this.yPosPercent});
    this.players[socket.id] = new Player(socket);
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

    io.to(this.id).emit('setup players', {players: this.getPlayersData()});
  }

  // Game Setup
  createLobby(io) {
    setTimeout(() => this.startGame(io), LOBBY_TIMER);
  }

  startGame(io) {
		this.inPlay = true;
    this.wall = new Wall(this.heightPercent, this.widthPercent);
    io.to(this.id).emit('game start', {wall: this.wall});
    this.updateFn = this.broadcastState(io);
  }

  resetGame(io) {
    if (this.inPlay) {
      this.inPlay = false;
      this.walls = {};

      Object.keys(this.players).forEach(playerId => {
        this.setupPlayer(io, this.players[playerId].socket);
      })

      this.createLobby(io);
    }
  }

  // Game Update
  broadcastState(io) {
    let gameState = {
      // yPosPercent: this.yPosPercent,
      players: this.getPlayersData()
    };

    return setInterval(() => io.to(this.id).emit('game state', gameState), 1000 / FPS);
  }

  getPlayersData() {
    let playersData = {};
    Object.keys(this.players).forEach(playerId => {
      playersData[playerId] = this.players[playerId].getData();
    });
    return playersData;
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

    if (allPlayersLost) this.endGame(io);
  }

	// Game End
	endGame(io) {
    let scoreboard = {};
    Object.keys(this.players).forEach(playerId => {
      scoreboard[playerId] = this.players[playerId].isAlive;
    });

    io.to(this.id).emit('game end', {scoreboard: scoreboard});

    clearInterval(this.updateFn);
    setTimeout(() => this.resetGame(io), LOBBY_TIMER);
	}
}

module.exports = Game;
