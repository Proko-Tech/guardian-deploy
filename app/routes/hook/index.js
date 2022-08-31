const express = require('express');
const router = new express.Router();

const S3 = require('../../../services/S3');
const Deploy = require('../../../services/Deploy');

const CoreDeploymentMappingModel = require('../../../database/models/CoreDeploymentMappingsModel');

router.post('/github', async function(req, res) {
  try {
    const branchName = req.body.ref.split('/').pop();
    const repositoryId = req.body.repository.id;
    const repoServerMappings = await CoreDeploymentMappingModel
        .getByRepositoryIdAndBranchName(repositoryId, branchName);
    if (repoServerMappings.length === 0) {
      return res.status(404).json(
          {msg: 'Repository and branch combination not found.'});
    }

    // TODO: support multi-target deployment.
    const target = repoServerMappings[0];
    const pemFileBuffer = await S3.getByFilename(target.access_key_file_name);
    const {ok} = await Deploy.runDeployment(
        target.target_host,
        target.server_username,
        pemFileBuffer,
        target.repo_path,
        target.deploy_service,
    );
    if (!ok) {
      return res.status(500).json({msg: 'Deployment failed'});
    }
    return res.status(200).json({status: 'success'});
  } catch (err) {
    return res.status(500).json({msg: 'Internal Server Error'});
  }
});

module.exports = router;
