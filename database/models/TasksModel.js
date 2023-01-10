const db = require('../dbConfig');

/**
 * Insert a new record into tasks table, returning id of the newly inserted
 * record.
 * @param payload
 * @returns {Promise<awaited Knex.QueryBuilder<TRecord, number[]>>}
 */
async function insert(payload) {
  const ids = await db('tasks')
      .insert(payload);
  return ids;
}

/**
 * Update task by id.
 * @param id
 * @param payload
 * @return {Promise<void>}
 */
async function updateById(id, payload) {
  await db('tasks')
      .update(payload)
      .where({id});
}

module.exports={insert, updateById};
