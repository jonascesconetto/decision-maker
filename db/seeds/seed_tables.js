
const polls = [
  {id: 1, admin_email: 'sumedhanarayanan@gmail.com', title: 'Lunch Suggestions', admin_url:'abcdef', vote_url:'uvwxyz'},
  {id: 2, admin_email: 'petenol@gmail.com', title: 'Movie Suggestions', admin_url:'lorem', vote_url:'ipsum'}
]

const candidates = [
  {id: 1, polls_id: 1, candidate:'Sushi', points:2, description:'Sushi at Minami'},
  {id: 2, polls_id: 1, candidate:'Pizza', points:5, description:'Takeout pizza'},
  {id: 3, polls_id: 2, candidate:'Aquaman', points:1},
  {id: 4, polls_id: 2, candidate:'Spiderman', points:1, description:'Spidey!'}
];

const voters = [
  {id: 1, polls_id: 1, first_name:'Excited', last_name:'Voter'},
  {id: 2, polls_id: 1, first_name:'Lazy', last_name:'Voter'},
  {id: 3, polls_id: 2, first_name:'Fun', last_name:'Voter'}
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
      return seedTable('voters', voters)
    });
  })
};
