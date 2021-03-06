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
var waitingRoom = [];

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

temp_name = ''

app.get('/room', function(req, res) {
  var queries = req.query;
  var name = temp_name;
  // TO DO add error if temp_name is still empty to prevent users from joining rooms without first entering in their name
  var room = queries.room
  res.render(__dirname + '/views/index.njk', {roomname: room, name: name});
  io.emit()
});

http.listen(1111, function() {
  console.log('listening at localhost:1111');
});

io.on('connection', function(socket) {
    // saving the id for this session, hmmmm, maybe we need to have session 
    // variables or something
    var user_id = socket.id

    socket.on('connect room', function(info) {
        if (info.room === 'waitingroom') {
            // TODO: add error catching here
        }
        joinRoom(info, user_id, socket, io);
    });


    // TODO: make this work
    socket.on('connect waiting', function(info) {
        console.log('waiting room connection');
        waitingRoom.push({"id": user_id});
        socket.join('waitingroom');
        console.log('waiting room: ' + util.inspect(waitingRoom, false, null));
    });
    socket.on('waiting add name', function(name) {
        waitingRoom[_.findIndex(waitingRoom, {id: user_id})]['name'] = name;
        temp_name = name;
        console.log('waiting room: ' + util.inspect(waitingRoom, false, null));
    })

    socket.on('disconnect', function() {
        console.log(user_id + ' disconnected from a page');
        if (_.findIndex(waitingRoom, {id: user_id}) == -1) {
            for (i = 0; i < rooms.length; i++) {
                room = rooms[i];
                if (_.findIndex(room.users, {id: user_id}) != -1) {
                    console.log("AHHHHHH");
                    console.log(room);
                    room.users.splice(_.findIndex(room.users, {id: user_id}), 1);
                    if (room.users.length == 0) {
                        rooms.splice(i, 1);
                    } 
                }
            }
            people.splice(_.findIndex(people, {id: user_id}), 1);
            try {
                users = rooms[_.findIndex(rooms, {roomname: socket.room})].users;
                io.to(socket.room).emit('user left', {"user": socket.name, 
                                                      "users": users});
            }   catch(err) {
                io.to(socket.room).emit('user left', {"user": socket.name});
            }
            socket.leave(socket.room);
        } else {
            waitingRoom.splice(_.findIndex(waitingRoom, {id: user_id}), 1);
            socket.leave('waitingroom');
        }
    });

    socket.on('move', function(square, move) {
        io.to(socket.room).emit('moved', square, move);
    });

    socket.on('chat message', function(msg) {
        io.to(socket.room).emit('chat recieved', msg, socket.name);
    });
});

function joinRoom(info, user_id, socket, io) {
    info = JSON.parse(info);

    console.log('connection info: ' + util.inspect(info, false, null));
    socket.name = info.name;
    socket.room = info.room;

    var index = _.findIndex((people), {id: socket.id});
    if (index == -1) {
        people.push(new Person(socket.id, socket.name, socket.room));
    } else (people[index].rooms.push(socket.room));

    socket.join(socket.room);
    if (!_.findWhere(rooms, {roomname: socket.room})) {
        rooms.push(new Room(socket.room));
    }
    users = rooms[_.findIndex(rooms, {roomname: socket.room})].users;
    users.push({"id": socket.id, "name": socket.name});
    console.log('people: ' + util.inspect(people, false, null));
    console.log('rooms: ' + util.inspect(rooms, false, null));
    io.to(socket.room).emit('user joined', {"user": socket.name, 
                                            "room": socket.room, 
                                            "users": users});
}
