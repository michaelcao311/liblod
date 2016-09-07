var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var nunjucks = require('nunjucks');

const util = require('util');

var io = require('socket.io')(http);

app.use(express.static(__dirname));
// Stores the names of all the rooms...
// Perhaps should be a map of Key: Room Name Value: List of Users
var rooms = {}; 

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.get('/', function (req, res) {
  console.log('rooms: ' + util.inspect(rooms, false, null));
  room_list = Object.keys(rooms);

  // render part not working, neither is callback function
  res.render(__dirname + '/views/home.njk', {renderedRooms: room_list}
  //   function (err) {
  //   if (err) console.log(err);
  //   else console.log('jtb');
  // }
  );
});

app.get('/reg', function(req, res) {
  var queries = req.query;
  var name = queries.name;
  var room = queries.room
  console.log("AHHH" + room);
  // if (rooms.indexOf(room) == -1) {
  //   rooms.push(room);
  //   makeRoom(room);
  // }
  if (!(room in rooms)) {
    console.log('We wanna make this ' + room);
    makeRoom(room);
  }
  // res.send("name: " + name + "<br>room: " + room)
  res.render(__dirname + '/views/index.njk', {roomname: room, username: name});

})

http.listen(1111, function() {
  console.log('listening at localhost:1111');
});

// Code for the Chat Room
function makeRoom(room) {
    rooms[room] = {};
    // namespace just for a specific chat room
    var chat = io.of('/' + room);
    var numUsers = 0
    console.log("make room" + room);
    chat.on('connection', function(socket) {
        numUsers += 1;
        socket.on('connect room', function(usr) {
            socket.username = usr;
            rooms[room][socket.id] = usr;
            console.log('user connected to the room');
            console.log('rooms: ' + util.inspect(rooms, false, null));
            console.log(numUsers);
            console.log(room + ': ' + numUsers + ' users online');
            // Eventually replace these with the username
            chat.emit('user joined', rooms[room][socket.id] + ' joined the chat');
        });
        socket.on('disconnect', function(){
            console.log('blod disconnected from chat');
            numUsers -= 1;
            // eventually replace these with the username
            chat.emit('user left', rooms[room][socket.id] + ' left the chat');
            delete rooms[room][socket.id];
            if (Object.keys(rooms[room]).length == 0) delete rooms[room];

            console.log('rooms: ' + util.inspect(rooms, false, null));
        });
        socket.on('chat message', function(msg) {
            console.log(msg);
            chat.emit('chat recieved', msg, socket.username);
        });
    });
}

io.on('connection', function(socket) {
    socket.on('disconnect', function(){
         console.log('blod disconnected from a page');
    });
});
