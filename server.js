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
var quizStarted = false;
var maxPlayers = 8;
var currentQ = null; // current question 
var timeToAnswer = 10 * 1000; // time given to answer question
var timeBetweenQs = 3 * 1000; // time to wait before asking next question
var startTime = null;
var winner = null;
var highScore = 0;

// create questions array (question, answer, wrong answers)
var questions = [
  {q: 'What color is the sky?',a: 'blue',na: 'red;green;orange;yellow'},
  {q: 'Why did the chicken cross the road?',a: 'Other', na: 'Hack Reactor;Onions;Yard sale;It didnt'},
  {q: 'evaluate 5%2+12-5*2', a: '3', na: '10;7;1;infinity'}
];

// nextQ
var nextQ = function() {
  quizFull = true;
  quizStarted = true;
  currentQ = questions.shift();
  setTimeout(endQ, timeToAnswer);
  askQ(currentQ);
  // parse answers // send answers
  sendAnswers(parseAnswers(currentQ));
  startTime = Date.now();
};

var endQ = function() {
  sendAll('endQ', {end: true});
  if(adminSocket) adminSocket.emit('usersDataPush', {users: userData}) // push to admin page
  if(questions.length > 0) {
    setTimeout(nextQ, timeBetweenQs)
  } else {
    // game is over, send game over event, tell winner
    console.log('game is over peeps');
    userData.forEach(function(user) {
      if(user.score > highScore) {
        highScore = user.score;
        winner = user;
      }
    });
    console.log('winner: ',winner.id);
    sendAll('gameOver', {id: winner.id});
  }
};

// create function to check if quiz is full
var isQuizFull = function() {
  if(userData.length >= maxPlayers && !quizStarted) {
    quizFull = true;
    //nextQ(); // start quiz
    //quizStarted = true;
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

  var rand = Math.floor(Math.random()*4);
  var temp = answers[4];
  answers[4] = answers[rand];
  answers[rand] = temp;
  return answers;
};

var getUser = function(users, id) {
  for(var i=0;i<users.length;i++) {
    if(users[i].id === id) {
      return users[i];
    }
  }
};

var addPoints = function(user) {
  user.score += 100-Math.round((Date.now()-startTime)/100);
  console.log('increased score of ', user.name, ' to ', user.score);
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
  socket.on('selectedAnswer', function(data) {
    if(data.a === currentQ.a) {
      // right answer
      addPoints(getUser(userData, socket.id));
      console.log('right answer');
    } else {
      // wrong answer
      console.log('wrong answer');
    }

  });

  socket.on('updateData', function() {
    console.log('user requested data ', socket.id);
    socket.emit('updatedData', getUser(userData,socket.id));
  });

  socket.on('startQuiz', nextQ);


});
