var express2 = require('express')();
var express = require('express');
//var app = express2;
var http = require('http').Server(express2);
var io = require('socket.io')(http);

express2.use(express.static('public'));

express2.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

var roomList =[];

io.on('connection', (socket) => {
    
    console.log('a user connected');
    
    socket.on('new room', (r) => {
        roomListCheck = roomList.length;
        while (roomList.length === roomListCheck ) {
            if (roomList.includes(r) === false) {
                roomList.push(r);
                socket.join(r);
                io.to(socket.id).emit('room clear', r);
            }
            else {
                r = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
            }
        }
    });
    
    socket.on('room check', (room) => {

        if (roomList.includes(parseInt(room, 10))) {
            io.to(socket.id).emit('room join', true);
            socket.join(room);
            // io.to(room).emit('new player', socket.id);
    
        }
        else {
            io.emit('room join', false);
        }
    });

    socket.on('new player', (roomNumber) => {
        io.to(roomNumber).emit('new player', socket.id);
    });
    socket.on('update newcomer', (winCondition, currentCard, roomNumber, id, opponentList, bool) => {
        io.to(id).emit('catch-up', winCondition, currentCard, id, opponentList, bool);
    });
    socket.on('game state', (bool, roomNumber) => {
        var gameState = bool;
        io.to(roomNumber).emit('game state', bool);
    });
    socket.on('playerBoard', (newBoard) => {
        io.emit('playerBoard', newBoard);
    });
    socket.on('win condition', (condition, roomNumber) => {
        var currentWinCondition = condition;
        io.to(roomNumber).emit('win condition', condition);
    });
    socket.on('current card', (sentCard, roomNumber) => {
        var currentCard = sentCard;
        io.to(roomNumber).emit('current card', sentCard);
    });
    socket.on('activity', (x, y, bool, roomNumber) => {
        io.to(roomNumber).emit('updateActivity', x, y, bool, socket.id);

    });
    socket.on('announce win', (board, checked, roomNumber) => {
        io.to(roomNumber).emit('check win', board, checked, socket.id);
    });
    socket.on('board checked', (bool, id) => {
        io.to(id).emit('check win', bool);
    });
});

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});


//var express = require('express');
//var app = express();
// var http = require( "http" ).createServer( app );
//var http = require('http');
//var server = http.createServer(app);
//var io = require('socket.io').listen(server);

// app.use(express.static('public'));

// app.get('/', (req, res) => {
//  res.sendFile(__dirname + '/public/index.html');
// });

//app.get('/', (req, res) => {
//    res.send('An alligator approaches!');
//});

//io.on('connection', (socket) => {
//  console.log('a user connected');
//});

//io.on('connection', (socket) => {
//  socket.on('chat message', (msg) => {
//    io.emit('chat message', msg);
//  });
//});

