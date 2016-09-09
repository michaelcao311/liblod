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

    var buttons = jQuery('button[id^="sq"]');
    var current = 'X'
    $(buttons).on('click', function(event) {
        var square = $(this);
        console.log(square.text());
        if (square.text() == ' ') {
            console.log(square.attr('id'));
            square.text(current);
            if (current == 'X') {
                square.removeClass('btn-success');
                square.addClass('btn-danger');
                current = 'O';
            } else {
                square.removeClass('btn-success');
                square.addClass('btn-warning');
                current = 'X';
            }
        }
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
