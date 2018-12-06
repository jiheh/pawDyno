const Wall = require('./wall');
const Player = require('./player');

const FPS = 30;
const LOBBY_TIMER = 30000;

// All measurements are in decimals and represent the % from the top of the
// screen (Y) or from the left of the screen (X)
const BOARD_HEIGHT_PERCENT = 10;
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

  markPlayerReady(io, socketId) {
    this.players[socketId].isReady = true;
    io.to(this.id).emit('setup players', {players: this.getPlayersData()});

    let allPlayersReady = true;
    for (let playerId of Object.keys(this.players)) {
      if (!this.players[playerId].isReady) {
        allPlayersReady = false;
        break;
      }
    }

    if (allPlayersReady) this.startGame(io);
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
  startTimer(io) {
    let backendTimerFn = setTimeout(() => {if (!this.inPlay) this.startGame(io)}, LOBBY_TIMER);

    let timeLeft = LOBBY_TIMER;
    let timerFn = setInterval(() => {
      if (this.inPlay || timeLeft <= 0) {
        clearTimeout(backendTimerFn);
        clearInterval(timerFn);
      }

      io.to(this.id).emit('lobby timer', timeLeft);
      timeLeft -= 1000;
    }, 1000);
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
      });

      this.startTimer(io);
    }
  }

  // Game Update
  broadcastState(io) {
		return setInterval(() => {
				let gameState = {
					// yPosPercent: this.yPosPercent,
					players: this.getPlayersData()
				};
				io.to(this.id).emit('game state', gameState)
			}
			, 1000 / FPS);
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
    io.to(this.id).emit('game end', {players: this.getPlayersData()});

    clearInterval(this.updateFn);
		this.resetGame(io)
	}
}

module.exports = Game;
