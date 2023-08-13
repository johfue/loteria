const express = require("express");
const app = express();//var app = app;
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.urlencoded({ extended: false }));





// Import the mongoose module
const mongoose = require("mongoose");

const server = '127.0.0.1:27017';
const database = 'Loteria';
class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(`mongodb://${server}/${database}`)
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

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

const User = mongoose.model('User', userSchema);
const newUser = new User({
  name: 'Elena John',
  email: 'elena.john@example.com',
  age: 22,
});

newUser.save()
.then(() => {
  console.log('Save User at MongoDB');
})
.catch((error) => {
  console.error(error);
});

const GameSchema = mongoose.Schema({
  room_number: { type: Number, required: true, maxLength: 6 },
  win_condition: { type: String, enum: ["diagonal", "column", "row", "corner", "center", "BlackOut",] },
  current_card: { type: Number },
  banned_names: { type: Array },
});
const Game = mongoose.model('Game', GameSchema);


app.get("/:room([0-9]{6})", async (request, response) => {
  const user = new User(request.body);
  try {
    console.log("logged" + request.body);
    await user.save();
    // response.send(user);
    response.sendfile(__dirname + '/public/index.html');

  } catch (error) {
    response.status(500).send(error);
  }
});

// app.post('/game', function (req, res) {
//   console.log(req.body);
//   res.send(req.body);
// });


app.post("/game", async (request, response) => {
  console.log("dinged");
  const game = new Game(request.body);
  try {
    console.log("logged" + request.body);
    await game.save();
    // response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }

});





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

// app.get('/:room([0-9]{6})', function(req, res){
//     console.log("roomed");
//     res.sendfile(__dirname + '/public/index.html');
    
//     const data = new PlayerSchema ({
//         deck:"ngfgr",
//     });
    
//     const val = data.save();

// });

//Other routes here
app.get('*', function(req, res){
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
                
                
                
                
                
                
                
                
                
      const game = new Game({room_number:r});
      console.log("logged" + r);
      game.save();
                
      // Check if Genre with same name already exists.
      const gameExists = game.findOne({ room_number: r }).exec();
      if (genreExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(genre.url);
      }
                
                
                
                
                
                
                
                
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

        for (const prop in socket.rooms) {
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

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});
