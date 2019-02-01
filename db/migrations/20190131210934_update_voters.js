//  Deletes voters table
exports.up = function(knex, Promise) {
  return knex.schema.dropTable('voters');
};

exports.down = function(knex, Promise) {
  return function(knex, Promise) {
    return knex.schema.createTable('voters', function (table) {
      table.increments('id');
      table.integer('polls_id').references('polls.id').onDelete('CASCADE');
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
    });
  };
}
