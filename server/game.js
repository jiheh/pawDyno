const Wall = require('./wall');
const Player = require('./player');

class Game {
  constructor() {
    this.FPS = 30;
    this.LOBBY_TIMER = 3000;
    this.BOARD_HEIGHT_PERCENT = 3;

    this.viewHeightPercent = 1;
    this.viewWidthPercent = 1;

    this.wall = new Wall(this.BOARD_HEIGHT_PERCENT, this.viewHeightPercent, this.viewWidthPercent);
    this.players = {};
  }

  // Player Setup
  setupPlayer(io, socket) {
    // Send wall to new client
    socket.emit('wall setup', {wall: this.wall});

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
      player.setStartPosition(idx, playerIds.length, this.wall.heightPercent, this.viewWidthPercent);
    });

    io.emit('player setup', {players: this.players});
  }

  // Game Setup
  createLobby(io) {
    setTimeout(() => this.start(io), this.LOBBY_TIMER);
  }

  start(io) {
    io.emit('game start');
    this.broadcastState(io);
  }

  // Game Update
  broadcastState(io) {
    let gameState = {
      yPosition: this.wall.yPosition,
      players: this.players
    };

    setInterval(() => io.emit('game state', gameState), 1000 / this.FPS);
  }

  movePlayer(holdInput, socket){
    let hold = this.wall.holds[holdInput]
    if(hold){
      let player = this.players[socket.id]
      player.movePaw(hold.x, hold.y)
    }
  }
}

module.exports = Game;
