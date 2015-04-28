/////// BACKBONE MODELS and VIEWS //////////////
// create Backbone user model
var User = Backbone.Model.extend({});

// create Backbone View for user info
var UserView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change', this.render, this);
    this.render();
  },

  template: _.template('<div class="name"><%= name %></div><div class="score"><%= score %></div>'),

  render: function() {
    return this.$el.html(this.template(this.model.toJSON()));
  }
});

// create question model
var Q = Backbone.Model.extend({});

// create question view
var QView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change add remove', this.render, this);
    this.render();
  },
  render: function() {
    return this.$el.html(this.model.get('q'));
  }
});

// create answer model
var A = Backbone.Model.extend({});

// create answers collection
var AS = Backbone.Collection.extend({
  model: A
});

// create answers views
var ASView = Backbone.View.extend({
  initialize: function() {
    this.collection.on('change add remove reset', this.render, this);
    this.render();
  },
  render: function() {
    var rendered = '';
    this.collection.toJSON().forEach(function(answer) {
      rendered += '<button class="answer" value="'+answer.a+'">'+answer.a+'</button>';
    });
    this.$el.html(rendered);

    // when user selects answer, do this
    $('.answer').on('click', function(e) {
      console.log(e.currentTarget.innerText);
      socket.emit('selectedAnswer', {a: e.currentTarget.innerText});
      $('.answer').off();
    });
  }
});

// initalize vars
var user = null;
var question = null;
var answers = null;

// open socket to server
var socket = io.connect('http://kenemon.com:3000');

// on connection
socket.on('connectMessage', function (data) {
  console.log(data);
  if(data.full) {
    alert('Sorry, quiz is full, try back later');
  } else {
    var name  = prompt('Enter your name:');
    if(name) {
      socket.emit('userName', { name: name });
    } else {
      alert('Invalid name. Perhaps this isn\'t the game for you');
    }
  }
});

// after user enters name, run some initializations
socket.on('userDataPush', function(data) {
  // create backbone models/views, associate with DOM
  user = new User(data);
  new UserView({model: user,el: $('#userInfo')});
  console.log('here is your info: ', data);
  // question model/view
  question = new Q({q: 'Waiting for the game to start...'});
  new QView({model: question,el: $('#questionBox')});
  // answer collection/view
  answers = new AS();
  new ASView({collection: answers,el: $('#answerBox')});

});

// server sends us a question!
socket.on('question', function(q) {
  console.log('incoming question! ',q.q);
  // update question model
  question.set('q',q.q);
  // update timer model
});

socket.on('answers', function(ans) {
  // update answers model
  answers.reset(ans);
});

socket.on('endQ', function() {
  console.log('server sent end event');
  socket.emit('updateData');
});

socket.on('updatedData', function(data) {
  console.log('server sent updated data', data);
  user.set('score',data.score);
});