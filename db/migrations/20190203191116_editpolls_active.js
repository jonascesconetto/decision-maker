
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('polls', function (table) {
    table.boolean('is_active');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('polls', function (table) {
    table.dropColumn('is_active');
  })
};
