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
    
    // gets all the tic tac toe buttons
    var buttons = jQuery('button[id^="sq"]');
    // current move (X is default first move)
    var current = 'X'
    $(buttons).on('click', function(event) {
        var square = $(this);
        console.log(square.text());
        if (square.text() == ' ') {
            console.log(square.attr('id'));
            square.text(current);
            if (current == 'X') {
                socket.emit('move', square.attr('id'), current);
                square.removeClass('btn-success');
                // red button
                square.addClass('btn-danger');
                // switch players
                current = 'O';
            } else {
                socket.emit('move', square.attr('id'), current);
                square.removeClass('btn-success');
                square.addClass('btn-warning');
                current = 'X';
            }
        }
    });
    socket.on('moved', function(button, move) {
        console.log("EHHHHHHH");
        search_for = '#' + button;
        console.log("search for " + search_for);
        // get the jquery square from the ID, and then we can mess with it
        square = $(search_for)
        square.text(move);
        if (move == 'X') {
            square.removeClass('btn-success');
            square.addClass('btn-danger');
            // have to continue to update the move
            current = 'O';
        }
        else {
            square.removeClass('btn-success');
            square.addClass('btn-warning');
            current = 'X';
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
