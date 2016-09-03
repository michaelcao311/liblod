var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var nunjucks = require('nunjucks');
var io = require('socket.io')(http);

var rooms = new Map();
var users = [];
var namespaces = [];
// console.log(1, rooms);

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/home.html', function (err) {
    if (err) console.log(err);
    else console.log('jtb');
  });
});

app.get('/inbetween', function (req, res) {
  if (!rooms.has(req.query.room)) {
    makeNsp(req.query.room);
  }
  res.redirect('/reg?room=' + req.query.room + '&name=' + req.query.name);
});

app.get('/reg', function (req, res) {
  var queries = req.query;
  var name = queries.name;
  var room = queries.room;
  var room_names = [];
  rooms[room].push(name);
  users.push(name);
  for(var k in rooms) room_names.push(k);

  console.log('namespaces: ' + namespaces[0]);
  console.log('roomnames: ', room_names);
  console.log('users: ', users);

  // res.send("name: " + name + "<br>room: " + room)
  res.render(__dirname + '/views/index.njk', {roomname: room, username: name});
})

http.listen(1111, function() {
  console.log('listening at localhost:1111');
});

// io.use(function(socket, next) {
//   // console.log('query: ', socket.handshake.query);
//   next();
// });
// io.use(function(socket, next) {
//   var rName = socket.handshake.query.roomname;
//   var uName = socket.handshake.query.name;
//   // console.log('rooms: ' + rooms)

//   rooms[rName].push(uName);
//   } 

//   console.log('namespaces: ' + namespaces);
// });

// io.on('connection', function(socket) {
//   var id = socket.id;

//   console.log('blob');
//   socket.on('chat message', function(msg) {
//     console.log(msg);
//     io.emit('chat recieved', msg);
//   });
//   socket.on('disconnect', function(){
//     console.log('blod disconnected');
//   });
// });

var makeNsp = function(name) {
  // console.log('rooms: ' + rooms);
  var nsp = io.of('/' + name);
  nsp.on('connection', function(socket){
    console.log('someone connected to ' + name);
    console.log('users: ' + rooms[name]);
    socket.on('chat message', function(msg) {
      // console.log(msg);
      nsp.emit('chat recieved', msg);
    });
    socket.on('disconnect', function() {
      console.log('someone disconnected');
    });
  });
  console.log('namespace made: ' + name);
  namespaces.push(nsp);
  rooms[name] = new Array();
}
