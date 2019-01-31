
exports.up = function(knex, Promise) {
  return knex.schema.createTable('polls', function (table) {
    table.increments('id');
    table.string('admin_email').notNullable();
    table.string('title').notNullable();
    table.string('admin_url').notNullable();
    table.string('vote_url').notNullable();
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('polls');
  
};
