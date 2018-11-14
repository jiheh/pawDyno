'use strict';

const Express = require('express');
const { resolve } = require('path')
const { createNewCharacter } = require('./character')

const app = new Express();
let port = process.env.PORT || 3000;

var server = require('http').Server(app);
var io = require('socket.io')(server);

let players = [];

function startJoinTimer() {
  
};

io.on('connection', function (socket) {
	// socket.emit('id', `socket id: ${socket.id}`);
  if(players.length === 0) {
    startJoinTimer();
  }
  players.push(createNewCharacter());

  console.log("server id", socket.id);
  console.log("popcorn")
  console.log(players);
});



  // io.emit('broadcast', /* */);
  //
  //
  // socket.emit('something', 'something else');
  // socket.emit('news', { hello: 'world' });

app.get('/', (_, res) => res.sendFile(resolve(__dirname, '..', 'public', 'index.html')));
app.set('port', port);
app.use(Express.static('public'));
//app.listen(app.get('port'), () => console.log(`Listening to port ${port}`));
server.listen(port, () => console.log(`Listening to port ${port}`))
