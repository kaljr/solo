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

// create sockets array (holds all connections)
var sockets = [];

// create questions array (question, answer, wrong answers)
var questions = [
  {q: 'What color is the sky?',a: 'blue',na: 'red;green;orange;yellow;'},
  {q: 'Why did the chicken cross the road?',a: 'To get to the other side', na: 'To go to Hack Reactor;Onions;Yard sale;It didnt;'},
];

// when there is a connection, do this
io.on('connection', function (socket) {

  console.log('someone connected'); // log to server window

  // send message to acknowledge connection
  socket.emit('connectMessage', {
    message: 'you are connected',
    socketInfo: sockets[sockets.length-1]
  });

  // handle admin connection
  socket.on('IamAdmin', function(data) {
    if(data.adminSecret === 'kennyynnek') {
      console.log('admin connected');
      socket.emit('usersDataPush', {users: sockets});
    } else {
      console.log('admin not connected');
    }
  });

  socket.on('userName', function(data) {
    // add object associated with this socketid to sockets array
    sockets.push({id: socket.id, name: data.name, score: 0, team: null});
    socket.emit('userDataPush', sockets[sockets.length-1]);
  });


});
