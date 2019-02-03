// Helper Functions

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);

// Borda ranking performed on ranked items from voting page and writes result to DB.
function borda (ranks) {
  return Promise.all(ranks.map((rank, index) => {
    let points = ranks.length - index;
    return knex('candidates')
      .where('id', rank)
      .increment('points', points)
      .then(() => console.log('Borda done'));
  }));
}

// Verifies if vote url is in the database
function verifiedVote (url) {
  return knex('polls')
    .where('vote_url', url)
    .then((results) => {
      if (results.length === 0) {
        console.log('URL not found');
        return false;
      }
      console.log('verifiedVote');
      return [results[0]['vote_url'], results[0]['id']];
    });
}

// Verifies if admin link is in the database
function verifiedAdmin (url) {
  return knex('polls')
    .where('admin_url', url)
    .then((results) => {
      if (results.length === 0) {
        console.log('URL not found');
        return false;
      }
      console.log('verifiedAdmin');
      return [results[0]['admin_url'], results[0]['id']];
    });
}

module.exports = {
  verifiedVote,
  verifiedAdmin,
  borda
};
