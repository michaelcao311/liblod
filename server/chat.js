$(document).ready(function() {
    console.log(room_name);
    console.log(user_name);
    
    var play1 = $('#play1');
    var play2 = $('#play2');

    $('form').submit(function(){
        socket.emit('chat message', $('#txt').val());
        $('#txt').val('');
        return false;
    });
    
    socket.emit('load players');

    socket.on('player info', function(player1, player2) {
        console.log("loading players");
        console.log(player1, player2);

        if (player1 != '') {
            activate_button(play1, player1);
        } else {
            deactivate_button(play1, 'Player 1');
        }
        if (player2 != '') {
            activate_button(play2, player2);
        } else {
            deactivate_button(play2, 'Player 2');
        }
    });

    // gets all the tic tac toe buttons
    var buttons = jQuery('button[id^="sq"]');
    // current move (X is default first move)
    var current = 'X'
    $(buttons).on('click', function(event) {
        var square = $(this);
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

    socket.on('host message', function(status, name) {
        console.log('host message status: ' + status);
        if (status === 'firstHost') {
            alert('you are the host of the room');
        } else if (status === 'hostLeft') {
            alert('the previous host has left so you are now the host');
        }
        activate_player(play1, name, 1);
    });
    
    $(play1).on('click', function(event) {
        if (play1.hasClass("activated")) {
            deactivate_player(play1, 'Player 1', 1);
        } else {
            activate_player(play1, user_name, 1);
        }
    });

    $(play2).on('click', function(event) {
        if (play2.hasClass("activated")) {
            deactivate_player(play2, 'Player 2', 2);
        } else {
            activate_player(play2, user_name, 2);
        }
    });

    function deactivate_player(element, player, num) {
        deactivate_button(element, player);
        socket.emit('player left', num);
    }

    function activate_player(element, name, num) {
        activate_button(element, name);
        socket.emit('new player', name, num);
    }

    function activate_button(element, name) {
        element.removeClass('btn-default');
        element.addClass('btn-info');
        element.addClass('activated');
        element.text(name);
    }

    function deactivate_button(element, player) {
        element.removeClass('btn-info');
        element.addClass('btn-default');
        element.removeClass('activated');
        element.text(player);
    }

    socket.on('moved', function(button, move) {
        search_for = '#' + button;
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

    socket.on('user left', function(info) {
        log(info.user + ' left');
        updateUsers(info.users);
    });

    socket.on('user joined', function(info) {
        // Jquery automatically turns JSON into JSON
        log(info.user + ' joined');
        updateUsers(info.users);
    });
    
    function updateUsers(users) {
        result = '';
        for (i = 0; i < users.length; i++) {
            result += '<li>' + users[i].name + '</li>';
        }
        $("#users").html(result);
        $("#usercount").text("Users Online: " + users.length);
    }

    function log(msg) {
        $('#chat_result').prepend($('<li>').text(msg));
    }
});
