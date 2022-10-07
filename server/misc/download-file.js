const AWS = require('aws-sdk');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
});
const s3 = new AWS.S3(config);

// Create the parameters for calling listObjects
var bucketParams = {
  Bucket: 'gss-gwarinpa',
};

const download = async () => {
  // Call S3 to obtain a list of the objects in the bucket
  s3.listObjects(bucketParams, async function (err, data) {
    if (err) {
      console.log('Error', err);
    } else {
      data.Contents.map(async ({ Key }) => {
        const s3_obj = await s3
          .getObject({
            Bucket: 'gss-gwarinpa',
            Key,
          })
          .promise();

        if (s3_obj.Metadata.email) {
          const email = s3_obj.Metadata.email;
          const filename = email.split('@')[0];
          const file_path = `${process.cwd()}/public/images/${filename}`;
          console.log(`${process.cwd()}/public/images/${filename}`);
          write_to_file(file_path, s3_obj.Body);
        } else {
          console.log('No email');
        }
      });
    }
  });
};

function write_to_file(file_path, data) {
  fs.writeFile(file_path, data, function (err) {
    if (err) return console.log(err);
    console.log('Success');
  });
}

module.exports = download;
