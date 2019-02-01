
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('votes', function (table) {
    table.text('ranking');
    table.dropColumn('rating');
    table.dropColumn('candidates_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('votes', function (table) {
    table.dropColumn('ranking');
    table.integer('rating');
    table.integer('candidates_id');
  })
};
