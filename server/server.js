var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var nunjucks = require('nunjucks');
var _ = require('underscore');

const util = require('util');

var io = require('socket.io')(http);

app.use(express.static(__dirname));
// Stores the names of all the rooms...
// Perhaps should be a map of Key: Room Name Value: List of Users
var rooms = []; 
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
  room_caps_list = []
  room_caps = {}
  for (var room in rooms) {
      room_caps[room] = Object.keys(rooms[room]).length;
  }
  room_list = Object.keys(rooms);

  res.render(__dirname + '/views/home.njk', {renderedRooms: room_caps}
  );
});

app.get('/room', function(req, res) {
  var queries = req.query;
  var name = queries.name;
  var room = queries.room
  console.log("AHHH" + room);
  // if (rooms.indexOf(room) == -1) {
  //   rooms.push(room);
  //   makeRoom(room);
  // }
  // if (!(room in rooms)) {
  //   console.log('We wanna make this ' + room);
  //   makeRoom(room);
  // }
  // res.send("name: " + name + "<br>room: " + room)
  res.render(__dirname + '/views/index.njk', {roomname: room, name: name});
  var joinInfo = {
      'room': queries.room,
      'name': queries.name
  };
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
    socket.on('connect room', function(info) {
        // console.log(info);
        info = JSON.parse(info);

        console.log('connection info: ' + util.inspect(info, false, null));
        var room = info.room;
        people.push(new Person(socket.id, info.name, room));
        console.log('people: ' + util.inspect(people, false, null));

        socket.join(info.room);
        console.log('findwhere: ' + !_.findWhere(rooms, {roomname: room}));
        if (!_.findWhere(rooms, {roomname: room})) {
            rooms.push(new Room(room));
        }

        console.log('findwhere: ' + !_.findWhere(rooms, {roomname: room}));
        console.log('rooms: ' + util.inspect(rooms, false, null));
        console.log('search: {roomname: ' + room + '}');
        console.log('indexOf: ' + _.indexOf(rooms, {roomname: room}));
        rooms[_.indexOf(rooms, {roomname: room})].users.push({"id": socket.id, "name": info.name});

    });
    socket.on('disconnect', function(){
        console.log('blod disconnected from a page');
        var person = getObjectThatHasValue(people, 'id', socket.id);
        for (let room of person[rooms]) {

        }
    });
});

function getObjectThatHasValue(object, key, value) {
    for (let item of object) {
        if (item[key] == value) return item[key];
    } return null;
}
