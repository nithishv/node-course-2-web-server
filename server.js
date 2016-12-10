const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

var currentYear = new Date().getFullYear();

// Enable Partials in HBS
hbs.registerPartials(__dirname + '/views/partials');
// Set Handlebar as View Engine
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  var now = new Date().toString();
  var callingIP = req.headers['x-forwared-for'] || req.connection.remoteAddress;
  var log = `${now}: From : ${callingIP} : ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + "\n", (err) => {
    if(err){
      console.log('Unable to append to server.log');
    }
  });
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my Site'
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    error: 'Error in the request'
  });
});

app.listen(80, () => {
  console.log('Listening on localhost');
});
