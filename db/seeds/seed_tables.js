
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE TABLE polls, candidates, voters CASCADE')
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('polls').insert({id: 1, admin_email: 'sumedhanarayanan@gmail.com', title: 'Lunch Suggestions', admin_url:'abcdef', vote_url:'uvwxyz'}),
        knex('polls').insert({id: 2, admin_email: 'petenol@gmail.com', title: 'Movie Suggestions', admin_url:'lorem', vote_url:'ipsum'}),
        knex('candidates').insert({id: 1, polls_id: 1, candidate:'Sushi', points:2, description:'Sushi at Minami'}),
        knex('candidates').insert({id: 2, polls_id: 1, candidate:'Pizza', points:5, description:'Takeout pizza'}),
        knex('candidates').insert({id: 3, polls_id: 2, candidate:'Aquaman', points:1}),
        knex('candidates').insert({id: 4, polls_id: 2, candidate:'Spiderman', points:1, description:'Spidey!'}),
        knex('voters').insert({id: 1, polls_id: 1, first_name:'Excited', last_name:'Voter'}),
        knex('voters').insert({id: 2, polls_id: 1, first_name:'Lazy', last_name:'Voter'}),
        knex('voters').insert({id: 3, polls_id: 2, first_name:'Fun', last_name:'Voter'}),
      ]);
    });
};
