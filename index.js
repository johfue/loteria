var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
// var path = require('path');

// app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static('public'));
// app.use(express.static(path.resolve(__dirname, 'public')));


app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
  console.log('a user connected');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

app.listen(3000);


// http.listen(3000, () => {
//   console.log('listening on *:3000');
// });
