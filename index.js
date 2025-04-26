const express = require("express");
const app = express();//var app = app;
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const { body, validationResult } = require("express-validator");
app.use(express.urlencoded({ extended: false }));

// Import the mongoose module
// const mongoose = require("mongoose");

// const server = '127.0.0.1:27017';
// const database = 'Loteria';
// const username = "loteriUser";
// const password = "a1r3t0l";


// class Database {
//   constructor() {
//     this._connect();
//   }
//   _connect() {
//     mongoose
//     //for local env
//       .connect(`mongodb://${server}/${database}`)
//     //for production and staging env
//     //  .connect(`mongodb://${username}:${password}@${server}/${database}`)
//      //
//       .then(() => {
//         console.log('Database connection successful');
//       })
//       .catch((err) => {
//         console.error('Database connection failed');
//       });
//   }
// }

// module.exports = new Database();

// const GameSchema = mongoose.Schema({
//   room_number: { type: Number, required: true, maxLength: 6 },
//   win_condition: { type: String, enum: ["diagonal", "column", "row", "corner", "center", "BlackOut",] },
//   current_card: { type: Number },
//   banned_names: { type: Array },
// });
// const Game = mongoose.model('Game', GameSchema);

const games = {};

app.get("/:room([0-9]{6})", async (request, response) => {
//   const game = new Game({curent_card:request.params, room_number:123321});
//     await game.save();
      response.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
});


io.on('connection', (socket) => {
    
    console.log('a user connected');
    

    // socket.on('new room', async () => {
    //     let roomNumber = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
    //     const gameExists = await Game.findOne({ room_number: roomNumber }).exec();
        
    //     if (gameExists) {
    //         let roomNumber = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
    //         io.to(socket.id).emit('room clear', roomNumber);

    //         //Should return error and ask them to try again
    //     }
    //     else {
    //         const game = new Game({room_number:roomNumber});
    //         await game.save();
    //         socket.join(roomNumber);
    //         io.to(socket.id).emit('room clear', roomNumber);
    //     }
    // });
    
    socket.on('new room', async (r) => {

    //   const gameExists = await Game.findOne({ room_number: r }).exec();
    r = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
    if (games.r) {
        // if (games.some(e => e["room_number"] === r)) {
            // console.log(gameExists);
            //Should return error and ask them to try again
      } else {
            socket.join(r);
            const info = {"banned_names": []};
            // const game = new Game(r, info);
            games[r] = info;
            // games.push(game);
            io.to(socket.id).emit('room clear', r);
            console.log("active games:" + Object.keys(games).length);
        }
    });
    
    socket.on('room check', async (room) => {
        // const gameExists = await Game.findOne({ room_number: room }).exec();
        if (games[room]) {
            io.to(socket.id).emit('room join', true, false);
            socket.join(room);
            // io.sockets.adapter.rooms[room].length
            // io.sockets.adapter.rooms.get(room).size;
            //rooms.get is not a function?
        }
        else {
            io.emit('room join', false);
        }
    });
    
    socket.on('rejoin room', (room) => {
        socket.join(room);
    });
    socket.on('check nickname', async (n, r) => {
    const check = games[r]["banned_names"];
    //   const nameIsBanned = await Game.findOne({ room_number: r, banned_names: { $all: [n] } }).exec();
    if (check.some(e => e === n)) {

    // if (check[n]) {
            io.to(socket.id).emit('name clear', false);
        }
    else {
            io.to(socket.id).emit('name clear', true);
      }
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
    socket.on('deciding', (roomNumber) => {
        socket.to(roomNumber).emit('deciding', socket.id);
    });
    socket.on('ready', (roomNumber) => {
        socket.to(roomNumber).emit('ready', socket.id);
    });
    socket.on('announce win', (roomNumber) => {
        socket.to(roomNumber).emit('check win', socket.id);
    });
    socket.on('nevermind', (roomNumber) => {
        socket.to(roomNumber).emit('cancel win', socket.id);
    });
    socket.on('board checked', (bool, id, roomNumber) => {
        io.to(id).emit('win checked', bool);
    });
    socket.on('remove player', async (nickname, id, roomNumber) => {
        io.to(id).emit('kick out');
        games[roomNumber]["banned_names"].push(nickname);
    //  await Game.findOneAndUpdate(
    //      { room_number: roomNumber},
    //         {
    //             $addToSet: {
    //                 banned_names: nickname
    //             }
    //      }).exec();
    });
    
    socket.on("disconnecting", (reason) => {

        for (const prop in socket.rooms) {
            if (prop.length == 6) {
                io.to(prop).emit('player left', socket.id);
                function room() {
                    return io.sockets.adapter.rooms[prop];
                }
                if ( room().length < 2 ) {
                    setTimeout(function() {
                    if ( !(room()) ) {
                        // Game.deleteOne({ room_number: prop }).exec();
                        // games.splice(games.indexOf(games(room_number: prop), 1);

                        delete games[prop];
                        console.log("deleted game: " + prop);
                    }
                    }, 12000);
                break;
                }
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

// For live
// http.listen(3000, function() {
// For staging
http.listen(3050, function() {
//
   console.log('listening on localhost:3000');
});
