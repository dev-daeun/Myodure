const s3Config = require('../config.json').s3;
const aws = require('aws-sdk');
aws.config.update(s3Config);
const multer  = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3();

module.exports.getUpload = function(folder){
  return multer({
    storage: multerS3({
      s3: s3,
      bucket: 'good-cat',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      acl: 'public-read',
      key: function (req, file, cb) {
        cb(null, file.fieldname +'-' + Date.now().toString() + "." + file.originalname.split('.').pop());
      }
    })
  });
 
} 
