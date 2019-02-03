'use strict';

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const express     = require('express');
const bodyParser  = require('body-parser');
const sass        = require('node-sass-middleware');
const app         = express();

const request     = require('request');
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const chance      = require('chance').Chance();
const poll        = require('./createpolls_helper');
const admin       = require('./adminquery_helper');
const writeVotes  = require('./writevotes_helper');
const helper      = require('./helpers');

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
  // Script below for recaptcha v2 
  console.log('captcha:', captchaVerify(req.body['g-recaptcha-response']));
  // Script ends for recaptcha v2
  return poll(req.body)
    .then((result) => {
      res.redirect(`/polls/${result}`);
    });
});

// Vote page that displays options to vote for
app.get('/polls/:url', (req, res) => {
  // Pull data from DB specific to poll as per the params in the get request and render the page.
  let templateVars = {};
  helper.verifiedVote(req.params.url)
    .then((result) => {
      if (result === false) {
        res.render('not-found');
      } else {
        knex
          .select('candidates.id as candidate_id', 'question', 'candidate', 'title', 'points', 'vote_url')
          .from('candidates')
          .leftJoin('polls', 'polls.id', 'candidates.polls_id')
          .where('polls_id', result[1])
          .then((results) => {
            templateVars.candidates = results;
          })
          .then(() => res.render('vote', templateVars));
      }
    });
});

// Calculates the points for each candidate & updates DB.
app.post('/polls/:url', (req, res) => {
  const vote = req.body.oa;
  const href = req.body.url;
  const voteURL = href.slice(28);
  const voterName = req.body.name;
  knex('candidates')
    .leftJoin('polls', 'polls.id', 'candidates.polls_id')
    .where('vote_url', voteURL)
    .then((results) => {
      writeVotes(vote, results[0].polls_id, voterName);
      return helper.borda(vote);
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
  helper.verifiedVote(req.params.url)
    .then((result) => {
      if (result === false) {
        res.render('not-found');
      } else {
        knex
          .select()
          .from('candidates')
          .leftJoin('polls', 'polls.id', 'candidates.polls_id')
          .where('vote_url', req.params.url)
          .orderBy('points', 'desc')
          .then((results) => {
            templateVars.candidates = results;
          })
          .then(() => {
            res.render('results', templateVars);
          });
      }
    });
});

// Renders the admin page based on the admin link being clicked.
app.get('/polls/admin/:url', (req, res) => {
  let templateVars = {};
  helper.verifiedAdmin(req.params.url)
    .then((result) => {
      if (result === false) {
        res.render('not-found');
      } else {
        knex
          .select('candidate', 'points', 'description', 'title', 'question', 'polls_id')
          .from('candidates')
          .leftJoin('polls', 'polls.id', 'candidates.polls_id')
          .where('admin_url', req.params.url)
          .orderBy('points', 'desc')
          .then((results) => {
            templateVars.candidates = results;
            return admin(results[0].polls_id)
              .then((result) => {
                templateVars.voters = result;
              });
          })
          .then(() => res.render('admin', templateVars));
      }
    });
});

app.get('/error', (req, res) => {
  res.render('not-found');
});

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});

//  Helper function for recaptcha verify
// eslint-disable-next-line consistent-return
function captchaVerify(userCaptchaResponse) {
  if (!userCaptchaResponse) {
    return 'Please select captcha';
  } 
  const secretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}response=${userCaptchaResponse}`;
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    console.log('captch', body);
    // Success will be true or false depending upon captcha validation.
    if(!body.success) {
      return "Failed captcha verification";
    }
    return 'success!'
  });
}
