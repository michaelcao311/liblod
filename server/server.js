var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

var io = require('socket.io')(http);


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/blod.html', function (err) {
    if (err) console.log(err);
    else 
      console.log('jtb');
  });
});

http.listen(1111, function() {
  console.log('listening');
});

io.on('connection', function(socket) {
  console.log('blob');
})