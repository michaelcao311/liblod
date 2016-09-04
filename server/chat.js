$(document).ready(function() {

    $('form').submit(function(){
        socket.emit('chat message', $('#txt').val());
        $('#txt').val('');
        return false;
    });

    socket.on('chat recieved', function(msg, username) {
        console.log('here');
        log(username + ": " + msg);    
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
