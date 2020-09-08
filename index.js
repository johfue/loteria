
var express2 = require('express')();
var express = require('express');
//var app = express2;
var http = require('http').Server(express2);
var io = require('socket.io')(http);

express2.use(express.static('public'));

express2.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});