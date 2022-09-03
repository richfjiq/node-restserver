const { Router } = require('express');
const { check } = require('express-validator');

const {
  uploadFile,
  updateImage,
  showImage,
} = require('../controllers/uploads');
const { allowedCollections } = require('../helpers');
const { validateFields, validateFileUpload } = require('../middlewares');

const router = Router();

router.post('/', validateFileUpload, uploadFile);

router.put(
  '/:collection/:id',
  [
    validateFileUpload,
    check('id', 'Invalid id.').isMongoId(),
    check('collection').custom((c) =>
      allowedCollections(c, ['users', 'products'])
    ),
    validateFields,
  ],
  updateImage
);

router.get(
  '/:collection/:id',
  [
    check('id', 'Invalid id.').isMongoId(),
    check('collection').custom((c) =>
      allowedCollections(c, ['users', 'products'])
    ),
    validateFields,
  ],
  showImage
);

module.exports = router;
