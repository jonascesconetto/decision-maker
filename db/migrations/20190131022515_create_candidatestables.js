//  Creates candidates tables
exports.up = function(knex, Promise) {
  return knex.schema.createTable('candidates', function (table) {
    table.increments('id');
    table.integer('polls_id').references('polls.id');
    table.string('candidate').notNullable();
    table.integer('points');
    table.string('description');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('candidates');
};
