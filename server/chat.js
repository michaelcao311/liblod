var socket = io()
$('form').submit(function(){
    socket.emit('chat message', $('#txt').val());
    console.log('yo');
    $('#txt').val('');
    return false;
});

socket.on('chat recieved', function(msg) {
    $('#chat_result').append($('<li>').text(msg));
});
