// open socket to server
var socket = io.connect('http://kenemon.com:3000');

// on connection
socket.on('connectMessage', function (data) {
    console.log(data);
    //socket.emit('my other event', { my: 'clientHTML' });
  });