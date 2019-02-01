'use strict';

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const express     = require('express');
const bodyParser  = require('body-parser');
const sass        = require('node-sass-middleware');
const app         = express();

const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const chance = require('chance').Chance();

// Seperated Routes for each Resource
const usersRoutes = require('./routes/users');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/styles', sass({
  src: __dirname + '/styles',
  dest: __dirname + '/public/styles',
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static('public'));

// Mount all resource routes
app.use('/api/users', usersRoutes(knex));

// Landing Page
app.get('/', (req, res) => {
  res.render('index');
});

// Writes poll data to polls db when a user creates a poll
app.post('/polls', (req, res) => {
  // Write poll creation data to DB
  // console.log(req.body);
  const randUrl = chance.hash({ length: 20 });
  console.log(randUrl);
  res.redirect('/'); // Admin_email is a column in the polls table and will be in the body of the post request.
});

// Sends email using mailgun API to the admin with the poll link and admin page link for the poll
app.post('mail/:admin_email', (req, res) => {
  // Mailgun API does its work
  res.redirect('/polls/:v_url');
});

// Vote page that displays options to vote for
app.get('/polls/vote', (req, res) => {
  // Pull data from DB specific to poll as per the params in the get request and render the page.
  let templateVars = {};
  knex
    .select('*')
    .from('candidates')
    .where('polls_id', 2)
    .then((results) => {
      templateVars.candidates = results;
    })
    .then(() => res.render('vote', templateVars));
});

// Calculates the points for each candidate & updates DB.
app.post('/polls/vote', (req, res) => {
  const vote = req.body.orderArray;
  knex('candidates')
    .where('polls_id', 2)
    .then((results) => {
      borda(vote);
      res.send({ result: true });
    });
});

// Vote page that displays results to date of the poll
app.get('/polls/vote/result', (req, res) => {
  let templateVars = {};
  knex
    .select('*')
    .from('candidates')
    .where('polls_id', 2)
    .orderBy('points', 'desc')
    .then((results) => {
      templateVars.candidates = results;
      console.log(results);
    })
    // .then(() => console.log(templateVars))
    .then(() => res.render('results', templateVars));
});

// Renders the admin page based on the admin link being clicked.
app.get('/polls/:v_url/result', (req, res) => {
  // Admin page with results, voters' name
  res.render('results');
});

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});

function borda (rank) {
  console.log('rank', rank);
  for (var i = 0; i < rank.length; i++) {
    let points = rank.length - i;
    knex('candidates')
      .where('id', rank[i])
      .increment('points', points)
      .then(() => console.log('done'));
  }
}
