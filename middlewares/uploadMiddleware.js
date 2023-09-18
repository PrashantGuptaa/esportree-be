const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");
const aws = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

//from configuration filr
const s3 = require("../utils/s3.utils");

// aws.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION,
//   });

// Create an S3 instance
//const s3 = new aws.S3();
function uploadToS3(folderName) {
  const upload = multer({
    storage: multerS3({
      s3,
      bucket: process.env.AWS_BUCKET,

      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        const fileName = Date.now().toString() + "." + file.originalname;
        cb(null, `${folderName}/${fileName}`);
      },
    }),
  });
  return upload.array("files");
}
module.exports = uploadToS3;
