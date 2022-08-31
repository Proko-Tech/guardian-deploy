const AWS = require('aws-sdk');

// initialize the S3 interface by passing our access keys
AWS.config.update({
  accessKeyId: process.env.S3ACCESSKEYID,
  secretAccessKey: process.env.S3SECRETACCESSKEY,
  region: 'us-west-1',
});

const s3 = new AWS.S3();

/**
 * get by file name from S3 bucket
 * @param {string} fileName
 * @return {Promise<Body>}
 */
async function getByFilename(fileName) {
  const params = {
    Bucket: process.env.S3BUCKETNAME,
    Key: fileName,
  };
  const file = await s3.getObject(params).promise();
  console.log("file is: ", file);
  return file.Body;
}

module.exports={getByFilename};
