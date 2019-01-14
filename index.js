const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/', function(req, res) {
  res.render('chatroom');
});

let users = [];

io.on('connection', function(socket) {

  socket.on('add user', (username) => {
    socket.username = username;
    users.push(username);
    io.emit('user list', users);
    io.emit('chat message', '- ' + socket.username + ' has joined GitChatApp -');
  });

  socket.on('chat message', function(msg) {
    let currentdate = new Date();
    let time = currentdate.getHours() + ':' + currentdate.getMinutes();
    io.emit('chat message', `${socket.username} [${time}]: ${msg}`);
  });

  socket.on('disconnect', function() {
    users = users.filter(user => user !== socket.username);
    io.emit('user list', users);
    io.emit('chat message', '- ' + socket.username + ' has left GitChatApp -');
  });
});

http.listen(3000, function() {
  console.log('listening on 3000');
});
