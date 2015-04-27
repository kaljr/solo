var express = require('express');
var socketio = require('socket.io');
var http = require('http');
var path = require('path');

var app = express();
var server = http.Server(app);
var io = socketio(server);

// listen on port 3000
server.listen(3000);

// when there is a connection, do this
io.on('connection', function (socket) {
  io.emit('connectMessage', {
    message: 'you are connected'
  });
});