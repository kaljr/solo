// create Backbone user model
var User = Backbone.Model.extend({

});

// create Backbone View for user info
var UserView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change', this.render, this);
    this.render();
  },

  render: function() {
    return this.$el.append('<div>user</div>');
  }
});

// open socket to server
var socket = io.connect('http://kenemon.com:3000');

// on connection
socket.on('connectMessage', function (data) {
  console.log(data);
  var name  = prompt('Enter your name:');
  socket.emit('userName', { name: name });
});