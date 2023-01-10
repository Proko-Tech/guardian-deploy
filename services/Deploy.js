const shell = require('shelljs');
const {deleteFile} = require('../services/CreateFile');
/**
 * run deployment to the repo.
 * @param {string} host
 * @param {string} username
 * @param {Buffer} privateKey
 * @param {string} repoPath
 * @param {string} deployService
 * @return {Promise<{msg: string, err, ok: boolean}|{msg: string, ok: boolean}>}
 */
function runDeployment(
    host, username, privateKey, repoPath, deployService, callback) {
  try {
    switch (deployService) {
      case 'PM2':
        shell.exec(`sh ./bin/pm2 ${username} ${host} ${privateKey} ${repoPath}`, async (error, stdout, stderr) => {
          await deleteFile( privateKey);
          callback({ok: true, msg: 'Deployed', stdout, stderr}, null);
        });
        break;
      case 'FOREVER':
        shell.exec(`sh ./bin/forever ${username} ${host} ${privateKey} ${repoPath}`, async (error, stdout, stderr) => {
          await deleteFile( privateKey);
          callback({ok: true, msg: 'Deployed', stdout, stderr}, null);
        });
        break;
      case 'DOCKER':
        shell.exec(`sh ./bin/docker ${username} ${host} ${privateKey} ${repoPath}`, async (error, stdout, stderr) => {
          await deleteFile( privateKey);
          callback({ok: true, msg: 'Deployed', stdout, stderr}, null);
        });
        break;
      default:
        callback({ok: false, msg: 'Deployment mode not supported'}, null);
    }
  } catch (err) {
    callback({ok: false, msg: 'failed', err}, err);
  }
}

module.exports={runDeployment};
