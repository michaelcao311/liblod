var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var nunjucks = require('nunjucks');
var _ = require('underscore');

const util = require('util');

var io = require('socket.io')(http);

app.use(express.static(__dirname));
// list of all the rooms
var rooms = []; 
// list of all the people currently on the app
var people = [];

function Person(id, name, firstRoom) {
    this.id = id;
    this.name = name;
    this.rooms = [firstRoom];
}

function Room(roomname) {
    this.roomname = roomname;
    this.users = [];
}

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.get('/', function (req, res) {
  console.log('rooms: ' + util.inspect(rooms, false, null));
  room_caps = {}
  for (i = 0; i < rooms.length; i++) {
      roomname = rooms[i].roomname
      room_caps[roomname] = rooms[i].users.length;
  }

  res.render(__dirname + '/views/home.njk', {renderedRooms: room_caps}
  );
});

app.get('/room', function(req, res) {
  var queries = req.query;
  var name = queries.name;
  var room = queries.room
  console.log("AHHH" + room);
  res.render(__dirname + '/views/index.njk', {roomname: room, name: name});
  io.emit()
});

http.listen(1111, function() {
  console.log('listening at localhost:1111');
});

// Code for the Chat Room
// function makeRoom(room) {
//     rooms[room] = {};
//     // namespace just for a specific chat room
//     var chat = io.of('/' + room);
//     var numUsers = 0
//     console.log("make room" + room);
//     chat.on('connection', function(socket) {
//         numUsers += 1;
//         socket.on('connect room', function(usr) {
//             socket.username = usr;
//             rooms[room][socket.id] = usr;
//             console.log('user connected to the room');
//             console.log('rooms: ' + util.inspect(rooms, false, null));
//             console.log(numUsers);
//             console.log(room + ': ' + numUsers + ' users online');
//             // Eventually replace these with the username
//             chat.emit('user joined', rooms[room][socket.id] + ' joined the chat');
//         });
//         socket.on('disconnect', function(){
//             console.log('blod disconnected from chat');
//             numUsers -= 1;
//             // eventually replace these with the username
//             chat.emit('user left', rooms[room][socket.id] + ' left the chat');
//             delete rooms[room][socket.id];
//             if (Object.keys(rooms[room]).length == 0) delete rooms[room];

//             console.log('rooms: ' + util.inspect(rooms, false, null));
//         });
//         socket.on('chat message', function(msg) {
//             console.log(msg);
//             chat.emit('chat recieved', msg, socket.username);
//         });
//         socket.on('play game', function(game) {
//             if (!('games' in rooms[room])) {
//                 rooms[room]['games'] = [];
//             }
//             switch(game) {
//                 case 'tictactoe':
//                     rooms[room]['games'].push('tictactoe');
//                     break;
//             }
//             console.log('rooms: ' + util.inspect(rooms, false, null));
//         });
//         socket.on('move', function(button, move) {
//             console.log("AHHHHHHHHHHHHHHHHHHHHHHHH");
//             chat.emit('moved', button, move);

//         });
//     });
// }

io.on('connection', function(socket) {
    // saving the id for this session, hmmmm, maybe we need to have session variables or something
    var user_id = socket.id
    socket.on('connect room', function(info) {
        info = JSON.parse(info);

        console.log('connection info: ' + util.inspect(info, false, null));
        socket.name = info.name;
        socket.room = info.room;
        people.push(new Person(socket.id, socket.name, socket.room));

        socket.join(socket.room);
        if (!_.findWhere(rooms, {roomname: socket.room})) {
            rooms.push(new Room(socket.room));
        }
        rooms[_.findIndex(rooms, {roomname: socket.room})].users.push({"id": socket.id, "name": socket.name});

        console.log('people: ' + util.inspect(people, false, null));
        console.log('rooms: ' + util.inspect(rooms, false, null));
        io.to(socket.room).emit('user joined', {"user": socket.name, "room": socket.room});
    });
    socket.on('disconnect', function(){
        console.log(user_id + ' disconnected from a page');
        for (i = 0; i < rooms.length; i++) {
            room = rooms[i];
            if (_.findIndex(room.users, {id: user_id} != -1)) {
                console.log("AHHHHHH");
                console.log(room);
                room.users.splice(_.findIndex(room.users, {id: user_id}), 1);
                if (room.users.length == 0) {
                    rooms.splice(i, 1);
                }
            }
        }
        people.splice(_.findIndex(people, {id: user_id}), 1);
        console.log('people: ' + util.inspect(people, false, null));
        console.log('rooms: ' + util.inspect(rooms, false, null));
        io.to(socket.room).emit('user left', {"user": socket.name});
        socket.leave(socket.room);
    });
});
