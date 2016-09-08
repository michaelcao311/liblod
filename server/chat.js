$(document).ready(function() {
    $('#playtictactoe').attr('disabled', false);

    $('form').submit(function(){
        socket.emit('chat message', $('#txt').val());
        $('#txt').val('');
        return false;
    });

    $('#playtictactoe').click(function() {
        socket.emit('play game', 'tictactoe');
        $('#playtictactoe').attr('disabled', true); 
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
