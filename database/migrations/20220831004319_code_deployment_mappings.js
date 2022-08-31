const deployService = ['PM2', 'FOREVER', 'DOCKER'];

/**
 * @param {Knex} knex
 * @return {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
  return knex.schema.createTable('code_deployment_mappings', (tbl) => {
    tbl.increments('id').unique().notNullable();
    tbl.integer('repository_id').notNullable();
    tbl.text('default_branch').notNullable();
    tbl.text('target_host').notNullable();
    tbl.text('server_username').notNullable();
    tbl.text('access_key_file_name').notNullable();
    tbl.text('repo_path').notNullable();
    tbl.enum('deploy_service', deployService, {
      useNative: true,
      enumName: 'deploy_service',
    })
        .notNullable()
        .index();
  });
};

/**
 * @param {Knex} knex
 * @return {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
  return knex.schema.dropTable('code_deployment_mappings');
};
