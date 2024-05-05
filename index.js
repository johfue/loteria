const express = require("express");
const app = express();//var app = app;
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const { body, validationResult } = require("express-validator");
app.use(express.urlencoded({ extended: false }));

// Import the mongoose module
const mongoose = require("mongoose");

const server = '127.0.0.1:27017';
const database = 'Loteria';
const username = "loteriUser";
const password = "a1r3t0l";


class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
    //   .connect(`mongodb://${server}/${database}`)
     .connect(`mongodb://${username}:${password}@${server}/${database}`)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error('Database connection failed');
      });
  }
}

module.exports = new Database();

// const Schema = mongoose.Schema;

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   age: Number,
// });

// const User = mongoose.model('User', userSchema);
// const newUser = new User({
//   name: 'Elena John',
//   email: 'elena.john@example.com',
//   age: 22,
// });

// newUser.save()
// .then(() => {
//   console.log('Save User at MongoDB');
// })
// .catch((error) => {
//   console.error(error);
// });

const GameSchema = mongoose.Schema({
  room_number: { type: Number, required: true, maxLength: 6 },
  win_condition: { type: String, enum: ["diagonal", "column", "row", "corner", "center", "BlackOut",] },
  current_card: { type: Number },
  banned_names: { type: Array },
});
const Game = mongoose.model('Game', GameSchema);
// const newGame = new Game({
//   room_number: 123456,
// });

// newGame.save();


app.get("/:room([0-9]{6})", async (request, response) => {
  const game = new Game({curent_card:request.params, room_number:123321});
    await game.save();
      response.sendfile(__dirname + '/public/index.html');

//   try {
//     console.log("logged" + request.body);
//     await game.save();
//     // response.send(user);
//     // response.sendfile(__dirname + '/public/index.html');

//   } catch (error) {
//     response.status(500).send(error);
//   }
});

// app.post('/game', function (req, res) {
//   console.log(req.body);
//   res.send(req.body);
// });


// app.post("/game", async (request, response) => {
//   const game = new Game(request.body);
//   try {
//     await game.save();
//     // response.send(user);
//   } catch (error) {
//     response.status(500).send(error);
//   }

// });





// const PlayerSchema = new mongoose.Schema({
//   nickname: { type: String, required: true, maxLength: 8 },
//   room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
//   board: { type: Number },
//   beans: { type: Array },

// });

// module.exports = mongoose.model("Player", PlayerSchema);


// app.post("/player",async(req,res)=>{

//     console.log("posted");

//     const data = new PlayerSchema ({
//         nickname:req.body.wrewrw,
//     });
    
//     const val = await data.save();
// });






app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
});



io.on('connection', (socket) => {
    
    console.log('a user connected');
    

    socket.on('new room', async => {
        let roomNumber = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
        const gameExists = await Game.findOne({ room_number: r }).exec();
        
        if (gameExists) {
            r = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
            io.to(socket.id).emit('room clear', roomNumber);

            //Should return error and ask them to try again
        }
        else {
            const game = new Game({room_number:roomNumber});
            await game.save();
            socket.join(roomNumber);
            io.to(socket.id).emit('room clear', roomNumber);
        }
    });
    
    // socket.on('new room', async (r) => {

    //   const gameExists = await Game.findOne({ room_number: r }).exec();
    //   if (gameExists) {
    //         r = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
    //         console.log(gameExists);
    //         //Should return error and ask them to try again
    //   } else {
    //         const game = new Game({room_number:r});
    //         await game.save();
    //         socket.join(r);
    //         io.to(socket.id).emit('room clear', r);
    //     }
    // });
    
    socket.on('room check', async (room) => {
        const gameExists = await Game.findOne({ room_number: room }).exec();
        if (gameExists) {
            io.to(socket.id).emit('room join', true, false);
            socket.join(room);

            io.sockets.adapter.rooms.get(room).size;
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

      const nameIsBanned = await Game.findOne({ room_number: r, banned_names: { $all: [n] } }).exec();
      if (nameIsBanned) {
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
    socket.on('announce win', (board, roomNumber) => {
        socket.to(roomNumber).emit('check win', board, socket.id);
    });
    socket.on('board checked', (bool, id, roomNumber) => {
        io.to(id).emit('win checked', bool);
    });
    socket.on('remove player', async (nickname, id, roomNumber) => {
        io.to(id).emit('kick out');
     await Game.findOneAndUpdate(
         { room_number: roomNumber},
            {
                $addToSet: {
                    banned_names: nickname
                }
         }).exec();
    });
    socket.on("disconnecting", (reason) => {

        for (const prop in socket.rooms) {
            if (prop.length == 6) {
                io.to(prop).emit('player left', socket.id);
                console.log(prop + ": " + io.sockets.adapter.rooms[prop].length);

                setTimeout(function() {
                
                    if ( !(io.sockets.adapter.rooms[prop]) ) {
                        Game.deleteOne({ room_number: prop }).exec();
                        console.log("deleted game");
                    }
                }, 30000);
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

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});
