// JS file to write data into votes table. Called in POST /polls/v_url
// Input parameter - ordered array of candidates and poll_id

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);

function singleVoteToDB(candidatesID, rating, polls_id, voterName) {
  knex('votes')
    .insert({
      polls_id: polls_id,
      username: voterName,
      candidates_id: candidatesID,
      rating: rating
    })
    .then( () => {
      console.log("Wrote vote to table.");
    });
}

module.exports = function writeVotestoDB (vote, polls_id, voterName) {
  // console.log('vote', vote);
  vote.forEach((element, index) => {
    console.log('element', element);
    const rating = vote.length - index;
    singleVoteToDB(element, rating, polls_id, voterName);
  });
};
