// Helper Functions

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);


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

module.exports = {
  verified,
  borda
};
