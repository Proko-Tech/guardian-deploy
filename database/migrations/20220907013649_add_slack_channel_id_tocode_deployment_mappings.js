/**
 * @param {Knex} knex
 * @return {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
  return knex.schema.table('code_deployment_mappings', (tbl) => {
    tbl.text('slack_channel_id').notNullable();
  });
};

/**
 * @param {Knex} knex
 * @return {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
  return knex.schema.table('code_deployment_mappings', (tbl) => {
    tbl.dropColumn('slack_channel_id');
  });
};
