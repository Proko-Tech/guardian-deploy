const db = require('../dbConfig');

/**
 * get by repository id and branch name.
 * @param {number} repositoryId
 * @param {string} branchName
 * @return {Promise<Knex.QueryBuilder<TRecord,
 * ArrayIfAlready<TResult, DeferredKeySelection<TRecord, string>>>>}
 */
async function getByRepositoryIdAndBranchName(repositoryId, branchName) {
  const rows = db('core_deployment_mappings')
      .where('repository_id', repositoryId)
      .andWhere('branch_name', branchName)
      .select('*');
  return rows;
}

module.exports={getByRepositoryIdAndBranchName};
