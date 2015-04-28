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
var userData = [];
var adminSocket = null; // special socket for admin
var quizFull = false;
var maxPlayers = 2;
var currentQ = null; // current question 

// create questions array (question, answer, wrong answers)
var questions = [
  {q: 'What color is the sky?',a: 'blue',na: 'red;green;orange;yellow'},
  {q: 'Why did the chicken cross the road?',a: 'To get to the other side', na: 'To go to Hack Reactor;Onions;Yard sale;It didnt'},
];

// start quiz
var startQuiz = function() {
  currentQ = questions.shift();
  askQ(currentQ);
  // parse answers
  // send answers
  sendAnswers(parseAnswers(currentQ));
};

// create function to check if quiz is full
var isQuizFull = function() {
  if(userData.length >= maxPlayers) {
    quizFull = true;
    startQuiz();
  }
  return quizFull;
};


// function for sending emit to all connected sockets
var sendAll = function(messageType, data) {
    io.emit(messageType, data);
};

// function for asking a question
var askQ = function(question) {
  sendAll('question', {q: question.q});
};

var sendAnswers = function(answers) {
  sendAll('answers', answers);
};

var parseAnswers = function(question) {
  var answers = question.na.split(';');
  answers.push(question.a);
  // wrap in objects
  answers = answers.map(function(answer) {
    return {a: answer};
  });
  return answers;
};


// when there is a connection, do this
io.on('connection', function (socket) {

  console.log('someone connected'); // log to server window

  // send message to acknowledge connection
  socket.emit('connectMessage', {
    message: 'you are connected',
    socketInfo: userData[userData.length-1],
    full: isQuizFull()
  });

  // handle admin connection
  socket.on('IamAdmin', function(data) {
    if(data.adminSecret === 'kennyynnek') {
      console.log('admin connected');
      socket.emit('usersDataPush', {users: userData});
      adminSocket = socket;
    } else {
      console.log('admin not connected');
    }
  });

  socket.on('userName', function(data) {
    // add object associated with this socketid to sockets array
    userData.push({id: socket.id, name: data.name, score: 0, team: null});
    socket.emit('userDataPush', userData[userData.length-1]);
    if(adminSocket) adminSocket.emit('usersDataPush', {users: userData}) // push to admin page
    isQuizFull();
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
