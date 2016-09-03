var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var nunjucks = require('nunjucks');
var io = require('socket.io')(http);

var roomnames = new Array();
var rooms = new Map();
var users = [];
var namespaces = [];
console.log(1, rooms);

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

app.get('/reg', function(req, res) {
  var queries = req.query;
  var name = queries.name;
  var room = queries.room;
  console.log('roomnames: ', roomnames);
  console.log('users: ', users);


  // res.send("name: " + name + "<br>room: " + room)
  res.render(__dirname + '/views/index.njk', {roomname: room, username: name});
})

http.listen(1111, function() {
  console.log('listening at localhost:1111');
});

io.use(function(socket, next) {
  // console.log('query: ', socket.handshake.query);
  next();
});
io.use(function(socket, next) {
console.log(2, rooms);
  var rName = socket.handshake.query.roomname;
  var uName = socket.handshake.query.name;
  // console.log('rooms: ' + rooms)
  if (roomnames.indexOf(rName) === -1) {
  console.log(3, rooms);
    // console.log('rName: ', rName);
    // console.log('indexof: ', roomnames.indexOf(rName));
    // console.log('roomnames: ', roomnames);

    roomnames.push(rName);
    rooms[rName] = new Array();
    rooms[rName].push(uName);
    makeNsp(rName);
    console.log(4, rooms);
  } else {  
    console.log('rName: ', rName);
    // console.log('indexof: ', roomnames.indexOf(rName));
    // console.log('roomnames: ', roomnames);
    rooms[rName].push(uName);
    console.log(5, rooms);
  } 

  console.log('namespaces: ' + namespaces);
});

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

var makeNsp = function(name) {
  console.log(1);
  // console.log('rooms: ' + rooms);
  var nsp = io.of('/' + name);
  console.log(2);
  nsp.on('connection', function(socket){
    console.log('someone connected');
    nsp.on('chat message', function(msg) {
      console.log(msg);
      io.emit('chat recieved', msg);
    });
    socket.on('disconnect', function() {
      console.log('someone disconnected');
    });
  });
  console.log(nsp);
  namespaces.push(nsp);
  
}
