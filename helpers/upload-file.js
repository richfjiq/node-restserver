const { v4: uuidv4 } = require('uuid');
const path = require('path');

const uploadFilePromise = (
  files,
  validExtensions = ['png', 'jpg', 'jpeg', 'gif'],
  folder = ''
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const cutName = file.name.split('.');
    const extension = cutName[cutName.length - 1];

    if (!validExtensions.includes(extension)) {
      return reject(
        `File extension: ${extension} not allowed, valid extensions: ${validExtensions}`
      );
    }

    const tempName = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname, '../uploads/', folder, tempName);

    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(tempName);
    });
  });
};

module.exports = {
  uploadFilePromise,
};
