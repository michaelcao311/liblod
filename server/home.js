$(document).ready(function() {
    $('#nameform').show();
    $('#roomform').hide();

    $("#name").keyup(function(event) {
        if (event.keyCode == 13) {
            nameToRoom(event);
        }
    });
    $('#submitname').click(function(event) {
        nameToRoom(event);
    });
});

function nameToRoom(event) {
    socket.emit('waiting add name', $('#name').val());
    var name = $('#nameform');
    name.fadeOut(300, function() {
        $('#roomform').fadeIn();
    });
}
