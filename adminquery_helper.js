
const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);

// Query function to help render the admin page displaying who votes what

// query to find all the voters in a certain poll

function returnVotes(polls_id) {
  
  knex('votes')
    .distinct('username')
    .select()
    .where('polls_id', polls_id)
    .then( async (userRows) => {
      let retObj = {};
      const results = await userRows.map(async (element) => {
        return await knex
        .select('candidate')
        .from('votes')
        .innerJoin('candidates','candidates_id','candidates.id')
        .where('username', element.username)
        .orderBy('rating', 'desc')
        .then( (voteRows) => {
           // console.log(element.username);
           // console.log(voteRows);  
            return voteRows;
           // console.log(retObj);
        })
      });
      Promise.all(results)
      .then( (completed) => {
        console.log(completed);
      })
        
        
      return retObj;
    })
    .then( (res) => {
      console.log(res);
    })
}



// returnVotes('1')
//name accurately

function getUsers(polls_id) {

  return knex('votes')
  .distinct('username')
  .select()
  .where('polls_id', polls_id)
  .then( (rows) => {
    var users = rows.map((element) => {return element.username})
    return users;
  })
}

getUsers('1').then( (users) => {
  console.log(users);
})



// var arr = 

// arr.then( (result) => {console.log(result)});

// }
