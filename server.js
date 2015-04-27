var express = require('express');
var socketio = require('socket.io');
var http = require('http');
var path = require('path');
var _ = require('underscore');

var app = express();
var server = http.Server(app);
var io = socketio(server);

// listen on port 3000
server.listen(3000);

console.log('listening on port 3000');

// create sockets array
var sockets = [];

// when there is a connection, do this
io.on('connection', function (socket) {

  console.log('someone connected'); // log to server window

  // add object associated with this socketid to sockets array
  sockets.push({id: socket.id, name: null, score: 0, team: null});

  // send message to acknowledge connection
  socket.emit('connectMessage', {
    message: 'you are connected',
    socketInfo: sockets[sockets.length-1]
  });

  // handle admin connection
  socket.on('IamAdmin', function(data) {
    if(data.adminSecret === 'kennyynnek') {
      console.log('admin connected');
      socket.emit('userDataPush', {users: sockets});
    } else {
      console.log('admin not connected');
    }
  })


});
