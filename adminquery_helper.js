
const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);

// Query function to help render the admin page displaying who votes what

// query to find all the voters in a certain poll


function getUsers(polls_id) {

  return knex('votes')
  .distinct('username')
  .select('username')
  .where('polls_id', polls_id)
  .then( (rows) => {
    var users = rows.map((element) => {return element.username})
    console.log('users', users)
    return users;
  })
}
//usage:
// getUsersFromDB(polls_id).then( (result) => {
  // templateVars.voters = results;
// })
module.exports = function getUsersFromDB(polls_id) {
  console.log('pollsid', polls_id);
  return getUsers(polls_id)
    .then( (users) => {
      console.log('users', users);
      var promiseArr = users.map( (elem) => {
        return knex
          .select('candidate')
          .from('votes')
          .innerJoin('candidates','candidates_id','candidates.id')
          .where({
            'username': elem,
            'votes.polls_id': polls_id})
          .orderBy('rating', 'desc')
          .then( (rows) => {
            var arr = rows.map( (elem) => {
              return elem.candidate;
            })

            let obj = {
              username: elem,
              ranking: arr.join(',')
            }
            return obj;
          })
      })
      return Promise.all(promiseArr).then( (result) => {
        return (result);
      })
    })
    .then( (result) => {
      console.log (result);
      return result;

      // pass here to admin.ejs and catch error in server.js file
    })
}


// console.getUsersFromDB(polls_id);
