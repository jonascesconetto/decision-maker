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
const chance      = require('chance').Chance();
const poll        = require('./createpolls_helper');
const admin       = require('./adminquery_helper');
const writeVotes  = require('./writevotes_helper');

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
  return poll(req.body)
    .then((result) => {
      // console.log('vurl on post to Polls', result);
      res.redirect(`/polls/${result}`);
    });
});

// Vote page that displays options to vote for
app.get('/polls/:url', (req, res) => {
  // Pull data from DB specific to poll as per the params in the get request and render the page.
  let templateVars = {};
  verified(req.params.url)
    .then((result) => {
      knex
        .select('candidates.id as candidate_id', 'question', 'candidate', 'title', 'points')
        .from('candidates')
        .leftJoin('polls', 'polls.id', 'candidates.polls_id')
        .where('polls_id', result[1])
        .then((results) => {
          console.log('vote page results', results);
          templateVars.candidates = results;
        })
        .then(() => res.render('vote', templateVars));
    });
});

// Calculates the points for each candidate & updates DB.
app.post('/polls/:url', (req, res) => {
  const vote = req.body.oa;
  const href = req.body.url;
  const voteURL = href.slice(28);
  knex('candidates')
    .leftJoin('polls', 'polls.id', 'candidates.polls_id')
    .where('vote_url', voteURL)
    .then((results) => {
      console.log('POST vote', vote);
      writeVotes(vote, results[0].polls_id, 'cliff');
      return borda(vote);
    })
    .then(() => {
      res.send({ result: `http://localhost:8080/polls/${voteURL}/result` });
    })
    .catch((error)=> {
      res.sendStatus(400, "this didn't work");
    });
});

// Vote page that displays results to date of the poll
app.get('/polls/:url/result', (req, res) => {
  let templateVars = {};
  // spotted the bug, the select below was selecting all fields so it got confused between id
   // in polls and candidate table in the join


  knex
    // .select('candidates.id as candidate_id', 'question', 'candidate', 'title', 'points')
    .select()
    .from('candidates')
    .leftJoin('polls', 'polls.id', 'candidates.polls_id')
    .where('vote_url', req.params.url)
    .orderBy('points', 'desc')
    .then((results) => {
      templateVars.candidates = results;
      console.log('results: ', results);
    })
    .then(() => {
      res.render('results', templateVars);
      // console.log('templateVars: ', templateVars);
    });
});

// Renders the admin page based on the admin link being clicked.
// ADMIN ONLY GET REQUEST ------------PETER
app.get('/polls/admin/:url', (req, res) => {
  let templateVars = {};
  knex
    .select('candidate', 'points', 'description', 'title', 'question', 'polls_id')
    .from('candidates')
    .leftJoin('polls', 'polls.id', 'candidates.polls_id')
    .where('admin_url', req.params.url)
    .orderBy('points', 'desc')
    .then((results) => {
      templateVars.candidates = results;
      console.log('templateVars: ',templateVars);
      return admin(results[0].polls_id)
        .then((result) => {
          console.log('result', result);
          templateVars.voters = result;
        });
    })
    .then(() => res.render('admin', templateVars));
});

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});


function borda (ranks) {

  return Promise.all(ranks.map((rank, index) => {
    console.log('rank', rank);
    let points = ranks.length - index;
    return knex('candidates')
      .where('id', rank)
      .increment('points', points)
      .then(() => console.log('done'));
  }));
}

function verified (url) {
  return knex('polls')
    .where('vote_url', url)
    .orWhere('admin_url', url)
    .then((results) => {
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
