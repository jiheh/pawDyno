const Wall = require("./wall");
const Player = require("./player");

const FPS = 60;
const LOBBY_TIMER = 20000;

const TOTAL_WALL_SCALE = 10;

class Game {
  constructor(id) {
    this.wall = {};
    this.players = {};
    this.socketToCharacterId = {};

    this.updateFn;
    this.id = id;
    this.inPlay = false;
    this.isOver = false;
  }

  // Player Setup
  setupPlayer(io, socket) {
    socket.emit("setup env", {totalWallScale: TOTAL_WALL_SCALE});

    if (!this.socketToCharacterId.hasOwnProperty(socket.id)) {
      let playersCount = Object.keys(this.socketToCharacterId).length + 1;
      this.socketToCharacterId[socket.id] = playersCount % 2 == 1 ? 0 : 1;
    }

    this.players[socket.id] = new Player(socket, this.socketToCharacterId[socket.id]);
    this.setPlayerStartPos(io);
  }

  markPlayerReady(io, socketId) {
    this.players[socketId].isReady = true;
    io.to(this.id).emit("setup players", {players: this.getPlayersData()});

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
    delete this.socketToCharacterId[socket.id];
    this.setPlayerStartPos(io);
  }

  setPlayerStartPos(io) {
    let playerIds = Object.keys(this.players);

    playerIds.forEach((playerId, idx) => {
      let player = this.players[playerId];
      player.setStartPosition(idx, playerIds.length, TOTAL_WALL_SCALE);
    });

    let playersData = this.getPlayersData();
    for (let playerId of Object.keys(playersData)) {
      playersData[playerId].isAlive = true;
    }
    io.to(this.id).emit("setup players", {players: playersData});
  }

  // Game Setup
  startTimer(io) {
    let backendTimerFn = setTimeout(() => {
      if (!this.inPlay) this.startGame(io);
    }, LOBBY_TIMER);

    let timeLeft = LOBBY_TIMER;
    let timerFn = setInterval(() => {
      if (this.inPlay || timeLeft <= 0) {
        clearTimeout(backendTimerFn);
        clearInterval(timerFn);
      }

      io.to(this.id).emit("lobby timer", timeLeft);
      timeLeft -= 1000;
    }, 1000);
  }

  startGame(io) {
    this.inPlay = true;
    this.wall = new Wall(TOTAL_WALL_SCALE);
    io.to(this.id).emit("game start", {wall: this.wall});
    this.updateFn = this.broadcastState(io);
  }

  resetGame(io) {
    if (this.inPlay) {
      this.inPlay = false;
      this.isOver = false;
      this.walls = {};

      Object.keys(this.players).forEach((playerId) => {
        this.setupPlayer(io, this.players[playerId].socket);
      });

      this.startTimer(io);
    }
  }

  // Game Update
  broadcastState(io) {
    return setInterval(() => this.emitGameState(io), 1000 / FPS);
  }

  emitGameState(io) {
    let gameState = {
      players: this.getPlayersData(),
      isOver: this.isOver
    };
    io.to(this.id).emit("game state", gameState);
  }

  getPlayersData() {
    let playersData = {};
    Object.keys(this.players).forEach((playerId) => {
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
    if (this.players[socketId].isAlive) {
      this.players[socketId].isAlive = false;

      let allPlayersLost = true;

      for (let playerId in this.players) {
        if (this.players[playerId].isAlive) {
          allPlayersLost = false;
          break;
        }
      }

      if (allPlayersLost) this.endGame(io);
    }
  }

  // Game End
  endGame(io) {
    this.isOver = true;
    this.emitGameState(io);

    io.to(this.id).emit("game end", {players: this.getPlayersData()});
    clearInterval(this.updateFn);

    setTimeout(() => {
      this.resetGame(io);
    }, 5000);
  }
}

module.exports = Game;
