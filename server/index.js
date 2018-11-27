'use strict';

const Express = require('express');
const { resolve } = require('path');
const Game = require('./game');

const app = new Express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Global variables
let game = new Game();

// Socket
io.on('connection', function (socket) {
  if (Object.keys(game.players).length === 0) game.createLobby(io);
  game.setupPlayer(io, socket);

  socket.on('disconnect', () => game.removePlayer(io, socket));
	socket.on('movePaw', (holdInput) => game.movePlayer(holdInput, socket));
});

//Server
let port = process.env.PORT || 3000;

app.get('/', (_, res) => res.sendFile(resolve(__dirname, '..', 'public', 'index.html')));
app.set('port', port);
app.use(Express.static('public'));
server.listen(port, () => console.log(`Listening to port ${port}`))
