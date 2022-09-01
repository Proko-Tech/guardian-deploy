const fs = require('fs')
const crypto = require('crypto');

async function createFile(content) {
  const current_date = new Date().valueOf().toString();
  const random = Math.random().toString();
  const hash = crypto
    .createHash('sha1')
    .update(current_date + random)
    .digest('hex');
  const filePath = './bin/' + hash + '.pem';
  await fs.writeFileSync(filePath, content);
  return hash+'.pem'
}

async function deleteFile(fileName) {
  await fs.unlinkSync('./bin/' + fileName);
}

module.exports={createFile, deleteFile}
