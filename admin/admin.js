// open socket to server
var socket = io.connect('http://kenemon.com:3000');

// on connection
socket.on('connectMessage', function (data) {
    console.log(data);

    // send message to server declaring this socket to be admin
    socket.emit('IamAdmin', { adminSecret: 'kennyynnek' });

    // set up listener for server user data updates
    socket.on('userDataPush', function(data) {
      console.log(data);
    });
});