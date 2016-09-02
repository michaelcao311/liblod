var socket = io();

$('form').submit(function(){
    socket.emit('chat message', $('#txt').val());
    $('#txt').val('')
    return false
});
socket.on('chat recieved', function(msg) {
    $('#chat').append($('<li>').text(msg));
});

