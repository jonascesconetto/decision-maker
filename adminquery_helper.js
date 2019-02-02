
const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);

// Query function to help render the admin page displaying who votes what

// query to find all the voters in a certain poll

var template = {}
// function returnVotes(polls_id) {
  
//   knex('votes')
//     .distinct('username')
//     .select()
//     .where('polls_id', polls_id)
//     .then( async (userRows) => {
//       let retObj = {};
//       const results = await userRows.map(async (element) => {
//         return await knex
//         .select('candidate')
//         .from('votes')
//         .innerJoin('candidates','candidates_id','candidates.id')
//         .where('username', element.username)
//         .orderBy('rating', 'desc')
//         .then( (voteRows) => {
//            // console.log(element.username);
//            // console.log(voteRows);  
//             return voteRows;
//            // console.log(retObj);
//         })
//       });
//       Promise.all(results)
//       .then( (completed) => {
//         console.log(completed);
//       })
        
        
//       return retObj;
//     })
//     .then( (res) => {

//     })
// }



// returnVotes('1')
//name accurately

function getUsers(polls_id) {

  return knex('votes')
  .distinct('username')
  .select('username')
  .where('polls_id', polls_id)
  .then( (rows) => {
    var users = rows.map((element) => {return element.username})
    return users;;
  })
}

var x= getUsers('poll_id').then( (users) => {
  users.forEach( (element) => {
    template[element] = [];
  })
  return users;
})
.then( (users) => {
  // console.log(users);
  var promiseArr = users.map( (elem) => {
    return knex
      .select('candidate')
      .from('votes')
      .innerJoin('candidates','candidates_id','candidates.id')
      .where({
        'username': elem,
        'votes.polls_id': '1'})
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
  //console.log (result);
  return result;

  // pass here to admin.ejs and catch error in server.js file
})


x.then( (res) => {
  //templateVars.voters = res;
});
