'use strict';

const Express = require('express');
const { resolve } = require('path')

const app = new Express();
let port = process.env.PORT || 3000;

var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.emit('something', 'something else');
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
		console.log('hellooooooo')
    console.log(data);
  });
});

app.get('/', (_, res) => res.sendFile(resolve(__dirname, '..', 'public', 'index.html')));
app.set('port', port);
app.use(Express.static('public'));
//app.listen(app.get('port'), () => console.log(`Listening to port ${port}`));
server.listen(port, () => console.log(`Listening to port ${port}`))

