
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('polls', function (table) {
    table.string('question');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('polls', function (table) {
    table.dropColumn('question');
  })
};
