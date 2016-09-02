var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

var io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/blod.html', function (err) {
    if (err) console.log(err);
    else 
      console.log('jtb');
  });
});

app.get('/reg', function(req, res) {
  var queries = req.query;
  var name = queries.name;
  var room = queries.room;
  res.send("name: " + name + "<br>room: " + room)
})

http.listen(1111, function() {
  console.log('listening at localhost:1111');
});

io.on('connection', function(socket) {
  console.log('blob');
})
