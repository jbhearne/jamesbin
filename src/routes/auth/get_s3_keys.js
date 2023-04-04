const AWS = require("aws-sdk");
const s3 = new AWS.S3()

const getPrivate = async () => {
  let privateKey = await s3.getObject({
    Bucket: "cyclic-gentle-yoke-fish-us-west-1",
    Key: "private.pem",
  }).promise()

  return privateKey.Body;
}

const getPublic = async () => {
  let publicKey = await s3.getObject({
    Bucket: "cyclic-gentle-yoke-fish-us-west-1",
    Key: "public.pem",
  }).promise()

  return publicKey.Body;
}

module.exports = {
  getPrivate,
  getPublic
}