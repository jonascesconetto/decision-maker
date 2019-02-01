
const polls = [
  {id: 1, admin_email: 'sumedhanarayanan@gmail.com', title: 'Lunch Suggestions', admin_url:'abcdef', vote_url:'uvwxyz', question: 'where do we go for lunch?'},
  {id: 2, admin_email: 'petenol@gmail.com', title: 'Movie Suggestions', admin_url:'lorem', vote_url:'ipsum', question: 'What movie can we watch next week?'},
  {id: 3, admin_email: 'seelive.i@gmail.com', title: 'Weekend plans', admin_url: 'minim', vote_url:'tempor', question: 'What shall we do this weekend?'}
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
  {id: 1, polls_id: 1, username:'MichaelScott', ranking: 'Sushi,Pizza,Indian,Falafel,Mexican' },
  {id: 2, polls_id: 1, username:'JimHalpert', ranking: 'Pizza,Indian,Sushi,Mexican,Falafel'},
  {id: 3, polls_id: 2, username:'Dwight', ranking: 'Lego Movie,Bumblebee,Deadpool,Spiderman'},
  {id: 4, polls_id: 2, username:'Pam', ranking: 'Bumblebee,Lego Movie,Deadpool,Spiderman'},
  {id: 5, polls_id: 3, username:'andy', ranking: 'Skiing,Snowshoeing,rather be indoors'},
  {id: 6, polls_id: 3, username:'erin', ranking: 'rather be indoors,Skiing,Snowshoeing'},
  {id: 7, polls_id: 1, username:'ryan', ranking: 'Indian,Pizza,Sushi,Mexican,Falafel'},
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
