'use strict';

const Express = require('express');
const { resolve } = require('path')
const { Character } = require('./character')

const app = new Express();
let port = process.env.PORT || 3000;

var server = require('http').Server(app);
var io = require('socket.io')(server);

const gameStartTimer = 3000;
let players = {};

//Socket
io.on('connection', function (socket) {
  if (Object.keys(players).length === 0) startGameTimer();

  players[socket.id] = new Character();
  socket.emit('player count', Object.keys(players).length);

  socket.on('disconnect', () => delete players[socket.id]);
});

function startGameTimer() {
  setTimeout(() => {
    io.emit('start game', {numPlayers: Object.keys(players).length})
  }, gameStartTimer);
}

//Server
app.get('/', (_, res) => res.sendFile(resolve(__dirname, '..', 'public', 'index.html')));
app.set('port', port);
app.use(Express.static('public'));
server.listen(port, () => console.log(`Listening to port ${port}`))
