
const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);

// Query function to help render the admin page displaying voters' and their preferences

// query to find all the distinct voters in a certain poll
function getUsers(polls_id) {
  return knex('votes')
    .distinct('username')
    .select('username')
    .where('polls_id', polls_id)
    .then((rows) => {
      var users = rows.map((element) => {return element.username;});
      return users;
    });
}
//   export function that reads the database for the preferences of all distinct voters in a poll
module.exports = function getUsersFromDB(polls_id) {
  console.log('pollsid', polls_id);
  return getUsers(polls_id)
    .then((users) => {
      console.log('users', users);
      let promiseArr = users.map((elem) => {
        return knex
          .select('candidate')
          .from('votes')
          .innerJoin('candidates','candidates_id','candidates.id')
          .where({
            'username': elem,
            'votes.polls_id': polls_id})
          .orderBy('rating', 'desc')
          .then((rows) => {
            let arr = rows.map((elem) => {
              return elem.candidate;
            });
            //  Returns obj { votername: 'option1,option2, etc.}
            let obj = {
              username: elem,
              ranking: arr.join(',')
            };
            return obj;
          });
      });
      return Promise.all(promiseArr).then( (result) => {
        return (result);
      });
    })
    .then((result) => {
      console.log (result);
      return result;
      // pass here to admin.ejs and catch error in server.js file
    });
};
