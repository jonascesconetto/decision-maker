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
  res.redirect('/polls/:v_url'); // This :v_url will be a variable pulled from the polls table.
});

// Vote page that displays options to vote for
app.get('/polls/:url', (req, res) => {
  // Pull data from DB specific to poll as per the params in the get request and render the page.
  let templateVars = {};
  verified(req.params.url)
    .then((result) => {
      console.log('after promise result', result);
      knex
        .select('*')
        .from('candidates')
        .where('polls_id', result[1])
        .then((results) => {
          templateVars.candidates = results;
        })
        .then(() => res.render('vote', templateVars));
    });
});

// Calculates the points for each candidate & updates DB.
app.post('/polls/:v_url', (req, res) => {
  const vote = req.body.orderArray;
  knex('candidates')
    .where('polls_id', 2) //make the 2 dynamic
    .then((results) => {
      borda(vote);
      res.send({ result: true });
    });
});

// Vote page that displays results to date of the poll
app.get('/polls/:v-url/result', (req, res) => {
  let templateVars = {};
  knex
    .select('*')
    .from('candidates')
    .leftJoin('polls', 'polls.id', 'candidates.polls_id')
    .where('polls_id', 2) //make the 2 dynamic
    .orderBy('points', 'desc')
    .then((results) => {
      templateVars.candidates = results;
      console.log(results);
    })
    // .then(() => console.log(templateVars))
    .then(() => res.render('results', templateVars));
});

// Renders the admin page based on the admin link being clicked.
app.get('/polls/:admin_url', (req, res) => {
  // Admin page with results, voters' name
  res.render('admin');
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

function verified (url) {
  return knex('polls')
    .where('vote_url', url)
    .orWhere('admin_url', url)
    .then((results) => {
      console.log('verified internal results', results);
      if (results.length === 0) {
        console.log('not found');
        return false;
      } else if (results[0]['vote_url'] === url) {
        console.log('vote');
        return [results[0]['vote_url'], results[0]['id']];
      } else {
        console.log('admin');
        return [results[0]['admin_url'], results[0]['id']];
      }
    });
}
