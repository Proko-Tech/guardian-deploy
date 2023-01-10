const express = require('express');
const router = new express.Router();
const {v4: uuidv4} = require('uuid');

const {createFile} = require('../../../services/CreateFile');
const {sendTextEmail, sendEmailTemplate} = require('../../../services/Mailer');

const S3 = require('../../../services/S3');
const Deploy = require('../../../services/Deploy');

const CoreDeploymentMappingModel = require('../../../database/models/CoreDeploymentMappingsModel');
const TasksModel = require('../../../database/models/TasksModel');

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
    const newTaskIds = await TasksModel.insert({
      code_deployment_mappings_id: target.id,
      deployment_status: 'STARTED',
      public_key: uuidv4(),
    });

    const pemFileBuffer = await S3.getByFilename(target.access_key_file_name);
    const pemFileName = await createFile(pemFileBuffer.toString());
    await sendTextEmail({
      to: target.owners,
      subject: repoName + ' deployment started!',
      text: 'Deployment for ' + repoName + ' has started. An email will be sent ' +
        'later when the task completes',
    });

    await Deploy.runDeployment(
        target.target_host,
        target.server_username,
        pemFileName,
        target.repo_path,
        target.deploy_service,
        async (status, error) => {
          if (error) {
            await sendTextEmail({
              to: target.owners,
              subject: `${repoName} deployment failed```,
              text: `❌ *${repoName}* deploy *FAILED*. \n ${error}`,
            });
            return res.status(500).json({msg: 'Internal Server Error'});
          }
          await TasksModel.updateById(newTaskIds[0],
              {deployment_status: 'DONE', output: status.stdout + status.stderr});
          await sendEmailTemplate({
            to: target.owners,
            subject: repoName + ' deployment finished!',
          }, {
            repoName, ...status,
          });
          return res.status(200).json({status: 'success'});
        },
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({msg: 'Internal Server Error'});
  }
});

module.exports = router;
