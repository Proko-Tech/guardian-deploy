const shell = require('shelljs')
const { deleteFile } = require('../services/CreateFile');
/**
 * run deployment to the repo.
 * @param {string} host
 * @param {string} username
 * @param {Buffer} privateKey
 * @param {string} repoPath
 * @param {string} deployService
 * @return {Promise<{msg: string, err, ok: boolean}|{msg: string, ok: boolean}>}
 */
async function runDeployment(
    host, username, privateKey, repoPath, deployService) {
  try {
    switch (deployService) {
      case 'PM2':
        shell.exec(`sh ./bin/pm2 ${username} ${host} ${privateKey} ${repoPath}`, async (error, stdout, stderr) => {
          await deleteFile( privateKey);
        });
        break;
      case 'FOREVER':
        await shell.exec(`sh ./bin/forever ${username} ${host} ${privateKey} ${repoPath}`, async (error, stdout, stderr) => {
          await deleteFile( privateKey);
        });
        break;
      default:
        return {ok: false, msg: 'Deployment modee not supported'};
    }
    return {ok: true, msg: 'Deployed'};
  } catch (err) {
    return {ok: false, msg: 'failed', err};
  }
}

module.exports={runDeployment};
