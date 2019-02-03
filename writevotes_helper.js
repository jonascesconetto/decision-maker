// JS file to write data into votes table. Called in POST /polls/v_url
// Input parameter - ordered array of candidates and poll_id

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);


function singleVoteToDB(candidates_id, rating, polls_id, voterName) {
  knex('votes')
    .insert({
      polls_id: polls_id,
      username: voterName,
      candidates_id: candidates_id,
      rating: rating
    })
    .then(() => {
      console.log("Wrote vote to table.");
    });
}

// export function that writes all votes to the database
module.exports = function writeVotestoDB (vote, polls_id, voterName) {
  vote.forEach((element, index) => {
    const rating = vote.length - index;
    singleVoteToDB(element, rating, polls_id, voterName);
  });
};
