const fs = require('fs');
const crypto = require('crypto');

/**
 * Creates the pem access file.
 * @param {object} content
 * @return {Promise<string>}
 */
async function createFile(content) {
  const currentDate = new Date().valueOf().toString();
  const random = Math.random().toString();
  const hash = crypto
      .createHash('sha1')
      .update(currentDate + random)
      .digest('hex');
  const filePath = './bin/' + hash + '.pem';
  await fs.writeFileSync(filePath, content);
  return hash+'.pem';
}

async function deleteFile(fileName) {
  await fs.unlinkSync('./bin/' + fileName);
}

module.exports={createFile, deleteFile};
