//Initialize Users var
var allUsers = null;

// Create Backbone User Model
var User = Backbone.Model.extend({

});

// Create Backbone User View
var UserView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change', this.render, this);
    //this.render();
  },
  template: _.template('<div class="user"><span class="name"><%= name %></span><span class="score"><%= score %></span></div>'),
  render: function() {
    return this.$el.html(this.template(this.model.toJSON()));
  }
});

// Create Backbone Users Table (Collection)
var Users = Backbone.Collection.extend({
  model: User
});

// Create Backbone Users Table View
var UsersTable = Backbone.View.extend({
  initialize: function() {
    this.collection.on('change add remove', this.render, this);
    this.render();
  },

  className: 'usersTable',

  render: function() {
    var renderedContent = '';
    this.collection.toJSON().forEach(function(obj) {
      renderedContent += '<div><span class="name">'+obj.name+'</span><span class="score">'+obj.score+'</span><div>';
    });
    this.$el.html(renderedContent);
  }

});

var initializeUserTable = function(data) {
  // create backbone models/views, associate with DOM
  allUsers = new Users(data.users);
  console.log(allUsers.toJSON());
  new UsersTable({collection: allUsers,el: $('#userTable')});
};


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
        // call initializeUserTable
        initializeUserTable(data);
      });
  });

  return socket;
  
}