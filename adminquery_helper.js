/* eslint-disable camelcase */


const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);

// Query functions to help render the admin page displaying each voters' preferences

// query to find all distinct voters in a certain poll
function getUsers(polls_id) {
  return knex('votes')
    .distinct('username')
    .select('username')
    .where('polls_id', polls_id)
    .then((rows) => {
      let users = rows.map((element) => {
        return element.username;
      });
      return users;
    });
}
//  Export function uses distinct voters from getUsers and returns each users' ordered preference. 
//  Converts data to text that can be directly displayed on the front end.
module.exports = function getUsersFromDB(polls_id) {
  return getUsers(polls_id)
    .then((users) => {
      let promiseArr = users.map((elem) => {
        return knex
          .select('candidate')
          .from('votes')
          .innerJoin('candidates', 'candidates_id', 'candidates.id')
          .where({
            'username': elem,
            'votes.polls_id': polls_id})
          .orderBy('rating', 'desc')
          .then((rows) => {
            let arr = rows.map((elem) => {
              return elem.candidate;
            });
            //  returns an object with key value pairs of username and rankings
            //  example { john:  option1,option3,option4}
            let obj = {
              username: elem,
              ranking: arr.join(','),
            };
            return obj;
          });
      });
      return Promise.all(promiseArr).then((result) => (result));
    })
    .then((result) => {
      console.log ('Result from admin helper functions:', result);
      return result;

      // pass here to admin.ejs and catch error in server.js file
    });
};
