
// Create Backbone User Model
var User = Backbone.Model.extend({

});

// Create Backbone Users Table (Collection)
var Users = Backbone.Collection.extend({
  model: User
});

// Create Backbone Users Table View
var UsersTable = Backbone.View.extend({
  initialize: function() {
    this.model.on('change add remove', this.render, this);
    this.render();
  },

  className: 'usersTable',

  render: function() {
    return this.$el.append('<div>some User</div>');
  }

});


// create function to connect with server as admin
var connectAsAdmin = function() {

  // Get value from password field
  var pw = $('#password').val();

  // open socket to server
  var socket = io.connect('http://kenemon.com:3000');

  // on connection
  socket.on('connectMessage', function (data) {
      console.log(data);

      // send message to server declaring this socket to be admin
      socket.emit('IamAdmin', { adminSecret: pw});

      // set up listener for server user data updates
      socket.on('usersDataPush', function(data) {
        console.log(data);
      });
  });

  return socket;
  
}