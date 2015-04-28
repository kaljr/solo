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

// initialize vars
var sockets = []; // create sockets array (holds all connections)
var adminSocket = null;
var quizFull = false;
var maxPlayers = 2;
var currentQ = null;

// create function to check if quiz is full
var isQuizFull = function() {
  if(sockets.length >= maxPlayers) {
    quizFull = true;
  }
  return quizFull;
};

// create questions array (question, answer, wrong answers)
var questions = [
  {q: 'What color is the sky?',a: 'blue',na: 'red;green;orange;yellow;'},
  {q: 'Why did the chicken cross the road?',a: 'To get to the other side', na: 'To go to Hack Reactor;Onions;Yard sale;It didnt;'},
];

// function for sending emit to all connected sockets
var sendAll = function(messageType, data) {
  sockets.forEach(function(socket) {
    socket.emit(messageType, data);
  })
};

// function for asking a question
var askQ = function(q) {
  currentQ = q;
  sendAll('question', {q: q.q});
};


// when there is a connection, do this
io.on('connection', function (socket) {

  console.log('someone connected'); // log to server window

  // send message to acknowledge connection
  socket.emit('connectMessage', {
    message: 'you are connected',
    socketInfo: sockets[sockets.length-1],
    full: isQuizFull()
  });

  // handle admin connection
  socket.on('IamAdmin', function(data) {
    if(data.adminSecret === 'kennyynnek') {
      console.log('admin connected');
      socket.emit('usersDataPush', {users: sockets});
      adminSocket = socket;
    } else {
      console.log('admin not connected');
    }
  });

  socket.on('userName', function(data) {
    // add object associated with this socketid to sockets array
    sockets.push({id: socket.id, name: data.name, score: 0, team: null});
    socket.emit('userDataPush', sockets[sockets.length-1]);
    if(adminSocket) adminSocket.emit('usersDataPush', {users: sockets}) // push to admin page
  });

  // handle answer from players
  socket.on('answer', function(data) {
    if(data.a === q.a) {
      // right answer
    } else {
      // wrong answer
    }
    
  });


});
