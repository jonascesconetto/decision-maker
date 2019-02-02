
const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || 'development';
const knexConfig  = require('./knexfile');
const knex        = require('knex')(knexConfig[ENV]);

// Query function to help render the admin page displaying who votes what

knex
  .select('username', 'candidate')
  .from('votes')
  .innerJoin('candidates','candidates_id','candidates.id')
  .where('polls_id', '1')
  .groupBy('username')
  .orderBy('rating')
  .then( (rows) => {
    console.log(rows);
  })
