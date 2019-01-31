//  Creates voters table schema
exports.up = function(knex, Promise) {
  return knex.schema.createTable('votes', function (table) {
    table.increments('id');
    table.integer('polls_id').references('polls.id').onDelete('CASCADE');
    table.integer('candidates_id').references('candidates.id').onDelete('CASCADE');
    table.string('username').notNullable();
    table.integer('rating');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('votes');
};
