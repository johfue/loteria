const express2 = require('express')();
const express = require('express');
//var app = express2;
const http = require('http').Server(express2);
const io = require('socket.io')(http);

express2.use(express.static('public'));

express2.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

express2.get('/:room([0-9]{6})', function(req, res){
    res.sendfile(__dirname + '/public/index.html');
});

//Other routes here
express2.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
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
        }
        else {
            io.emit('room join', false);
        }
    });
    socket.on('rejoin room', (room) => {
        socket.join(room);
    });
    socket.on('new player', (roomNumber, nickname, oldID) => {
        socket.to(roomNumber).emit('new player', nickname, socket.id, oldID);
    });
    socket.on('update newcomer', (gameInfo, id, deck) => {
        io.to(id).emit('catch-up', gameInfo, deck);
    });
    socket.on('game state', (bool, roomNumber) => {
        socket.to(roomNumber).emit('game state', bool);
    });
    socket.on('playerBoard', (newBoard) => {
        socket.emit('playerBoard', newBoard);
    });
    socket.on('win condition', (condition, roomNumber) => {
        socket.to(roomNumber).emit('win condition', condition);
    });
    socket.on('current card', (sentCard, roomNumber) => {
        socket.to(roomNumber).emit('current card', sentCard);
    });
    socket.on('claim board', (board, nickname, roomNumber) => {
        socket.to(roomNumber).emit('board claim', board, nickname, socket.id);
    });
    socket.on('activity', (x, y, bool, roomNumber) => {
        socket.to(roomNumber).emit('updateActivity', x, y, bool, socket.id);
    });
    socket.on('announce win', (board, roomNumber) => {
        socket.to(roomNumber).emit('check win', board, socket.id);
    });
    socket.on('board checked', (bool, id, roomNumber) => {
        io.to(id).emit('win checked', bool);
    });

    socket.on("disconnecting", (reason) => {
        console.log(socket.rooms);
        
        for (const prop in socket.rooms) {
            console.log(prop);
            if (prop.length == 6) {
                io.to(prop).emit('player left', socket.id);
                break;
            }
        }
        
    });
    socket.on('resync', (roomNumber) => {
        socket.to(roomNumber).emit('reysnc');
    });
    socket.on('sync checked', (roomNumber, nickname, oldID) => {
        socket.to(roomNumber).emit('sync checked', nickname, socket.id, oldID);
    })
});

http.listen(3050, function() {
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

