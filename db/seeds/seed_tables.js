
const polls = [
  {id: 1, admin_email: 'a@b.com', title: 'Lunch Suggestions', admin_url:'abcdef', vote_url:'uvwxyz', question: 'where do we go for lunch?'},
  {id: 2, admin_email: 'b@c.com', title: 'Movie Suggestions', admin_url:'lorem', vote_url:'ipsum', question: 'What movie can we watch next week?'},
  {id: 3, admin_email: 'd@e.com', title: 'Weekend plans', admin_url: 'minim', vote_url:'tempor', question: 'What shall we do this weekend?'}
]

const candidates = [
  {id: 1, polls_id: 1, candidate:'Sushi', points:2, description:'Sushi at Minami'},
  {id: 2, polls_id: 1, candidate:'Pizza', points:5, description:'Takeout pizza'},
  {id: 3, polls_id: 1, candidate:'Indian', points:5, description:'Buffet @ Tandoori Flames'},
  {id: 4, polls_id: 1, candidate:'Falafel', points:5},
  {id: 5, polls_id: 1, candidate:'Mexican', points:5, description:'Taco Day'},
  {id: 6, polls_id: 2, candidate:'Aquaman', points:2},
  {id: 7, polls_id: 2, candidate:'Spiderman', points:4, description:'Spidey!'},
  {id: 8, polls_id: 2, candidate:'Lego Movie', points:3, description:'Blocks and more blocks'},
  {id: 9, polls_id: 2, candidate:'Bumblebee', points:2, description:'There are tickets available on Tuesday '},
  {id: 10, polls_id: 2, candidate:'Deadpool', points:1},
  {id: 11, polls_id: 3, candidate:'Skiing', points:2},
  {id: 12, polls_id: 3, candidate:'Snowshoeing', points:4, description:'Dog mountain trail'},
  {id: 13, polls_id: 3, candidate:'rather be indoors', points:1},
];

const votes = [
  {id: 1, polls_id: 1, candidates_id: 1, username:'MichaelScott', rating: 5},
  {id: 2, polls_id: 1, candidates_id: 2, username:'MichaelScott', rating: 1},
  {id: 3, polls_id: 1, candidates_id: 3, username:'MichaelScott', rating: 2},
  {id: 4, polls_id: 1, candidates_id: 4, username:'MichaelScott', rating: 3},
  {id: 5, polls_id: 1, candidates_id: 5, username:'MichaelScott', rating: 4},
  {id: 6, polls_id: 1, candidates_id: 1, username:'JimHalpert', rating: 3},
  {id: 7, polls_id: 1, candidates_id: 2, username:'JimHalpert', rating: 4},
  {id: 8, polls_id: 1, candidates_id: 3, username:'JimHalpert', rating: 1},
  {id: 9, polls_id: 1, candidates_id: 4, username:'JimHalpert', rating: 5},
  {id: 10, polls_id: 1, candidates_id: 5, username:'JimHalpert', rating: 2},
  {id: 11, polls_id: 2, candidates_id: 6, username:'Dwight', rating: 3},
  {id: 12, polls_id: 2, candidates_id: 7, username:'Dwight', rating: 1},
  {id: 13, polls_id: 2, candidates_id: 8, username:'Dwight', rating: 4},
  {id: 14, polls_id: 2, candidates_id: 9, username:'Dwight', rating: 5},
  {id: 15, polls_id: 2, candidates_id: 10, username:'Dwight', rating: 2},
  {id: 16, polls_id: 2, candidates_id: 6, username:'Pam', rating: 2},
  {id: 17, polls_id: 2, candidates_id: 7, username:'Pam', rating: 1},
  {id: 18, polls_id: 2, candidates_id: 8, username:'Pam', rating: 4},
  {id: 19, polls_id: 2, candidates_id: 9, username:'Pam', rating: 5},
  {id: 20, polls_id: 2, candidates_id: 10, username:'Pam', rating: 3},
  {id: 21, polls_id: 3, candidates_id: 11, username:'andy', rating: 2},
  {id: 22, polls_id: 3, candidates_id: 12, username:'andy', rating: 1},
  {id: 23, polls_id: 3, candidates_id: 13, username:'andy', rating: 3},
  {id: 24, polls_id: 3, candidates_id: 11, username:'erin', rating: 3},
  {id: 25, polls_id: 3, candidates_id: 12, username:'erin', rating: 2},
  {id: 26, polls_id: 3, candidates_id: 13, username:'erin', rating: 1},
  {id: 27, polls_id: 3, candidates_id: 11, username:'ryan', rating: 2},
  {id: 28, polls_id: 3, candidates_id: 12, username:'ryan', rating: 3},
  {id: 29, polls_id: 3, candidates_id: 13, username:'ryan', rating: 1},
]

exports.seed = function(knex, Promise) {
  /* Helper function to seed tables, defined inside of the seed function
     to get access to 'knex'. Closure. */
  const seedTable = (table, data) => {
    /* Need to make sure that our primary key starts after the seeded entries. */
    return knex.raw(`ALTER SEQUENCE ${table}_id_seq RESTART WITH ${data.length + 1}`)
      .then(() => {
        /* Removes all of the current entries for that table. */
        return knex(table).del().then(() => {
      })
      .then(() => {
        /* Insert rows as an array. */
        return knex(table).insert(data);
      })
    })

  };

  return seedTable('polls', polls).then(() => {
    return seedTable('candidates', candidates).then(() => {
      return seedTable('votes', votes)
    });
  })
};
