// Import the Express module
var express = require('express');

// Import the 'path' module (packaged with Node.js)
var path = require('path');

//var routes = require('./routes/index')(passport);
var routes  = require('./routes');

// Create a new instance of Express
var app = express();

app.use('/', routes);

// Create a Node.js based http server on port 8080
var server = require('http').Server(app).listen(80, function(){
  console.log('listening on *:8080');
});

