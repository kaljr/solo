// open socket to server
var socket = io.connect('http://kenemon.com/quizzr/quiz');

// on connection
socket.on('connect', function (data) {
    console.log(data);
    //socket.emit('my other event', { my: 'clientHTML' });
  });