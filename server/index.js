'use strict';

const Express = require('express');
const {resolve} = require('path');
const Game = require('./game');

const app = new Express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Global Variables
let game = new Game();

// Socket
// All listeners on index.js, all emitters on game.js
io.on('connection', function (socket) {
  if (Object.keys(game.players).length === 0) game.createLobby(io);
  game.setupPlayer(io, socket);
  socket.on('disconnect', () => game.removePlayer(io, socket));

  socket.on('move paw', (holdInput) => game.movePlayer(holdInput, socket));
  socket.on('player lost', () => game.markPlayerLost(io, socket.id));

  socket.on('wall complete', () => game.sendWonLost(io));
});

// Server
let port = process.env.PORT || 3000;

app.get('/', (_, res) => res.sendFile(resolve(__dirname, '..', 'public', 'index.html')));
app.set('port', port);
app.use(Express.static('public'));
server.listen(port, () => console.log(`Listening to port ${port}`))
