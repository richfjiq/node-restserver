const dbValidators = require('./db-validators');
const generateToken = require('./generate-jwt');
const googleVerify = require('./google-verify');
const uploadFile = require('./upload-file');

module.exports = {
  ...dbValidators,
  ...generateToken,
  ...googleVerify,
  ...uploadFile,
};
