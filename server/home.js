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
    $('#submitter').click(function(event) {
        var name = $("#name").val(); 
        var room = $("#roomtyper").val();
        window.location.href = '/room?name=' + name + '&room=' + room;
    });
});

function nameToRoom(event) {
    socket.emit('waiting add name', $('#name').val());
    var name = $('#nameform');
    name.fadeOut(300, function() {
        $('#roomform').fadeIn();
    });
}
