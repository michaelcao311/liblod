$(document).ready(function() {
  $('#roomselector').attr('disabled', false);
  $('#roomtyper').attr('disabled', false);
  $('#submitter').attr('disabled', true);

  if (!($('.roomoption').length)) {
    $('#roomselector').attr("disabled", true);
  }

  $('#roomtyper').keyup(function() {
  //   if ($(this).val().length != 0) {
  //     $('#roomselector').attr('disabled', true);
  //   } else {
  //     $('#roomselector').attr('disabled', false);
  //   }
    checkFilled();
  });

  $('#name').keyup(function() {
    checkFilled();
  });
  
  $('#roomselector').change(function() {
    if ($(this).val() !== '--') {
      $('#roomtyper').attr('disabled', true);
    } else {
      $('#roomtyper').attr('disabled', false);
    }
    checkFilled();
  });
});

function checkFilled() {
  console.log((Boolean)($('#name').val() && ($('#name').val().length && 
    ($('roomtyper').val() && $('roomtyper').val().length ||
    ($('roomselector').val() !== '--')))));
  if ($('#name') && ($('roomtyper') || ($('roomselector') !== '--'))) {
    $('#submitter').attr('disabled', false);
  } else {
    $('#submitter').attr('disabled', true);
  }
}