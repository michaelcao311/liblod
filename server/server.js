var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

var io = require('socket.io')(http);
// namespace just for a specific chat room
var chat = io.of('/reg');

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/home.html', function (err) {
    if (err) console.log(err);
    else 
      console.log('jtb');
  });
});

app.get('/reg', function(req, res) {
  var queries = req.query;
  var name = queries.name;
  var room = queries.room;
    // res.send("name: " + name + "<br>room: " + room)
    res.sendFile(__dirname + '/reg.html');
})

http.listen(1111, function() {
  console.log('listening at localhost:1111');
});

// Code for the Chat Room
var numUsers = 0
chat.on('connection', function(socket) {
    numUsers += 1;
    socket.on('connect room', function(msg) {
        console.log('user connected to the room');
        console.log(numUsers);
        console.log('blob: ' + numUsers + ' users online');
        // Eventually replace these with the username
        chat.emit('user joined', 'user joined the chat');
    });
    socket.on('disconnect', function(){
         console.log('blod disconnected from chat');
         numUsers -= 1;
         // eventually replace these with the username
         chat.emit('user left', 'user left the chat');
    });
    socket.on('chat message', function(msg) {
        console.log(msg);
        chat.emit('chat recieved', msg);
    });
});


io.on('connection', function(socket) {
    socket.on('disconnect', function(){
         console.log('blod disconnected from a page');
    });
});
