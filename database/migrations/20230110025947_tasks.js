const deploymentStatus = ['STARTED', 'DONE', 'FAILED'];

/**
 * @param {Knex} knex
 * @return {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
  return knex.schema.createTable('tasks', (tbl) => {
    tbl.increments('id').unique().notNullable();
    tbl.integer('code_deployment_mappings_id').notNullable();
    tbl.text('output');
    tbl.enum('deployment_status', deploymentStatus, {
      useNative: true,
      enumName: 'deployment_status',
    })
        .notNullable()
        .index();
    tbl.text('public_key').notNullable();
  });
};

/**
 * @param {Knex} knex
 * @return {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
  return knex.schema.dropTable('tasks');
};
