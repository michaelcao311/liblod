var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var nunjucks = require('nunjucks');
var io = require('socket.io')(http);

var rooms = [];
var users = [];


nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(express.static(__dirname + '/views'));
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
  rooms.push(room);
  users.push(name);


  // res.send("name: " + name + "<br>room: " + room)
  res.render(__dirname + '/views/index.njk', {roomname: room, username: name});
})

http.listen(1111, function() {
  console.log('listening at localhost:1111');
});

// io.use(function(socket, next) {
//   console.log('name: ', socket.handshake.query);
//   next();
// });

io.on('connection', function(socket) {
  var id = socket.id;

  console.log('blob');
  socket.on('chat message', function(msg) {
    console.log(msg);
    io.emit('chat recieved', msg);
  });
  socket.on('disconnect', function(){
    console.log('blod disconnected');
  });
});


