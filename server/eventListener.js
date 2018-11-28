function eventListener(io, socket, game) {
  // Game Setup
  socket.on('disconnect', () => game.removePlayer(io, socket));

  // Game Update
  socket.on('move paw', (holdInput) => game.movePlayer(holdInput, socket));

  // Game End
  socket.on('player lost', () => game.sendLoser(socket))
  socket.on('game finished', () => game.sendWinner(socket))
}

module.exports = {eventListener};
