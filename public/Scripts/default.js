/// reference path ="jquery-3.0.0.js" />

var socket;


//ready function below will subscribe to events
$(document).ready(function () {
  socket = io.connect('http://localhost:8080');
  socket.on('connect', addUser);
  socket.on('updatechat', processMessage);
  socket.on('updateusers', updateUserList);
  $('#datasend').click(sendMessage);
  $('#data').keypress(processEnterPress);
});

function addUser() {
  socket.emit('adduser', prompt("What is your name?"));
}

//ProcessMessage function is used when user sends a message
function processMessage(username, data) {
  $('<b>' + username + ':</b> ' + data + '<br /> ').insertAfter($('#conversation'));
}

//Function for when user adds an updated user list
function updateUserList(data) {
  $('#users').empty();
  $.each(data, function (key, value) {
    $('#users').append('<div>' + key + '</div>');
  });
}

//Function for sending messages to the chat service
function sendMessage() {
  var message = $('#data').val();
  $('#data').val('');
  socket.emit('sendchat', message);
  $('#data').focus();
}

/*
Mouse Key event codes
 >> 32 = Space
 >> 8 = BackSpace
 >> 13 = Enter
 >> 16 = Shift
 >> 17 = Ctrl
 >> 18 = Alt
*/
//function to process when user press the Enter key
function processEnterPress(e) {
  if (e.which == 13) {
    e.preventDefault();
    $(this).blur();
    $('#datasend').focus().click();
  }
}