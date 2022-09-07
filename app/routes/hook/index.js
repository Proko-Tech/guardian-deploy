const express = require('express');
const router = new express.Router();
const { createFile } = require('../../../services/CreateFile');
const { write } = require('../../../services/Slack');

const S3 = require('../../../services/S3');
const Deploy = require('../../../services/Deploy');

const CoreDeploymentMappingModel = require('../../../database/models/CoreDeploymentMappingsModel');

router.post('/github', async function(req, res) {
  try {
    const branchName = req.body.ref.split('/').pop();
    const repositoryId = req.body.repository.id;
    const repoName = req.body.repository.full_name;
    const repoServerMappings = await CoreDeploymentMappingModel
        .getByRepositoryIdAndBranchName(repositoryId, branchName);
    if (repoServerMappings.length === 0) {
      return res.status(404).json(
          {msg: 'Repository and branch combination not found.'});
    }

    // TODO: support multi-target deployment.
    const target = repoServerMappings[0];
    const pemFileBuffer = await S3.getByFilename(target.access_key_file_name);
    const pemFileName = await createFile(pemFileBuffer.toString());
    await write(`🫡 *${repoName}* deployment process has *started*!`, target.slack_channel_id);
    await Deploy.runDeployment(
      target.target_host,
      target.server_username,
      pemFileName,
      target.repo_path,
      target.deploy_service,
      async (status, error) => {
        if (error) {
          console.error(error);
          await write(`❌ *${repoName}* deploy *FAILED*. \n ${error}`, target.slack_channel_id);
          return res.status(500).json({msg: 'Internal Server Error'});
        }
        await write(`✅ *${repoName}* *SUCCESSFULLY* deployed`, target.slack_channel_id);
        return res.status(200).json({status: 'success'});
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({msg: 'Internal Server Error'});
  }
});

module.exports = router;
