/////// BACKBONE MODELS and VIEWS //////////////
// create Backbone user model
var User = Backbone.Model.extend({

});

// create Backbone View for user info
var UserView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change', this.render, this);
    this.render();
  },

  template: _.template('<span class="name"><%= name %></span><span class="score"><%= score %></span>'),

  render: function() {
    return this.$el.html(this.template(this.model.toJSON()));
  }
});

// create question model
var Q = Backbone.Model.extend({

});

// create question view
var QView = Backbone.View.extend({

});

// create answer model
var A = Backbone.Model.extend({

});

// create answers collection
var AS = Backbone.Collection.extend({
  model: A
});

// create answers views
var ASView = Backbone.View.extend({
  initialize: function() {
    this.collection.on('change add remove', this.render, this);
    this.render();
  },
  render: function() {

  }
});

// initalize user var
var user = null;

// open socket to server
var socket = io.connect('http://kenemon.com:3000');

// on connection
socket.on('connectMessage', function (data) {
  console.log(data);
  if(data.full) {
    alert('Sorry, quiz is full, try back later');
  } else {
    var name  = prompt('Enter your name:');
    socket.emit('userName', { name: name });
  }
});

// after user enters name
socket.on('userDataPush', function(data) {
  // create backbone models/views, associate with DOM
  user = new User(data);
  new UserView({model: user,el: $('#userInfo')});
  console.log('here is your info: ', data);
});

// server sends us a question!
socket.on('question', function(q) {
  // update question model
  // update timer model
  // update answers model
});