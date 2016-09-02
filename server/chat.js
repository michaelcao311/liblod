$(document).ready(function() {
    var socket = io('/reg')
    socket.emit('connect room', 'uhh');

    $('form').submit(function(){
        socket.emit('chat message', $('#txt').val());
        console.log('yo');
        $('#txt').val('');
        return false;
    });

    socket.on('chat recieved', function(msg) {
        console.log('here');
        log(msg);    
    });

    socket.on('user left', function(msg) {
        log(msg);   
    });

    socket.on('user joined', function(msg) {
        log(msg);

    });

    function log(msg) {
        $('#chat_result').append($('<li>').text(msg));
    }
});
