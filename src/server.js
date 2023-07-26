const express = require('express');
const nunjucks = require('nunjucks');
const routes = require('./routes');
const methodOverride = require('method-override');
const { connectToDatabase } = require('../src/config/db'); // Update the path to your db.js file

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));
server.use(methodOverride('_method'));
server.use(routes);

// Configuring template engine
server.set('view engine', 'njk');
nunjucks.configure('src/app/views', {
  express: server,
  autoescape: false,
  noCache: true
});

// Connecting to the new database
connectToDatabase()
  .then(() => {
    // Start the server after successful database connection
    server.listen(5000, function () {
      console.log('Server is running');
    });
  })
  .catch(error => {
    console.log('Failed to connect to the database:', error);
  });
