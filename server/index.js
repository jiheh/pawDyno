'use strict';

const Express = require('express');
const { resolve } = require('path')
const { createNewCharacter } = require('./character')

const app = new Express();
let port = process.env.PORT || 3000;

var server = require('http').Server(app);
var io = require('socket.io')(server);

let players = [];
let sockets = [];


io.on('connection', function (socket) {
  sockets.push(socket);

  // Start timer and game
  if(players.length === 0) {
    setTimeout(() => socket.broadcast.emit('start game'), 20000);
  }

  players.push({id: socket.id, character: createNewCharacter()});
  socket.emit('player count', players.length);

  socket.on('disconnect', () => {
    players = players.filter(p => p.id !== socket.id)
  });
});

app.get('/', (_, res) => res.sendFile(resolve(__dirname, '..', 'public', 'index.html')));
app.set('port', port);
app.use(Express.static('public'));
//app.listen(app.get('port'), () => console.log(`Listening to port ${port}`));
server.listen(port, () => console.log(`Listening to port ${port}`))
