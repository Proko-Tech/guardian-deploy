const {NodeSSH} = require('node-ssh');
const ssh = new NodeSSH();

/**
 * Connect to server via secure shell.
 * @param {string} host
 * @param {string} username
 * @param {Buffer} privateKey
 * @return {Promise<void>}
 */
async function sshConnect(host, username, privateKey) {
  await ssh.connect({host, username, privateKey});
}

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
    ssh.connect({host, username, privateKey: privateKey.toString()})
      .then(function() {
        ssh.execCommand(`cd ${repoPath} && git pull`)
          .then(function(result) {
          console.log('STDOUT: ' + result.stdout)
          console.log('STDERR: ' + result.stderr)
        })
        switch (deployService) {
          case 'PM2':
            ssh.execCommand(`cd ${repoPath} && npm install && sudo pm2 restart all`)
              .then(function(result) {
              console.log('STDOUT: ' + result.stdout)
              console.log('STDERR: ' + result.stderr)
            });
            break;
          case 'FOREVER':
            ssh.execCommand(`cd ${repoPath} && npm install && ` +
              `sudo forever restartall`)
              .then(function(result) {
                console.log('STDOUT: ' + result.stdout)
                console.log('STDERR: ' + result.stderr)
              });
            break;
          default:
            return {ok: false, msg: 'service not found'};
        }
      })
    return {ok: true, msg: 'deployment succeeded'};
  } catch (err) {
    return {ok: true, msg: 'failed', err};
  }
}

module.exports={runDeployment};
