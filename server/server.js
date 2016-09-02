var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

var io = require('socket.io')(http);

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

io.on('connection', function(socket) {
  console.log('blob');
    socket.on('chat message', function(msg) {
        console.log(msg);
        io.emit('chat recieved', msg);
    });
    socket.on('disconnect', function(){
         console.log('blod disconnected');
     });
});
