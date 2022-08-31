const deploy_service = ['PM2', 'FOREVER', 'DOCKER'];

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
  return knex.schema.createTable('code_deployment_mappings', (tbl) => {
    tbl.increments('id').unique().notNullable();
    tbl.integer('repository_id').notNullable();
    tbl.text('target_host').notNullable();
    tbl.text('server_username').notNullable();
    tbl.text('access_key_file_name').notNullable();
    tbl.enum('deploy_service', deploy_service, {
      useNative: true,
      enumName: 'deploy_service',
    })
      .notNullable()
      .index();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
  return knex.schema.dropTable('code_deployment_mappings');
};
