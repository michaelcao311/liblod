var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function() {
    console.log('listening on stuff');
});

io.on('connection', function(socket) {
    console.log('blod is here');
    socket.on('disconnect', function(){
        console.log('blod disconnected');
    });
});
