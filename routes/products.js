const { Router } = require('express');
const { check } = require('express-validator');

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products');
const { productExists } = require('../helpers/db-validators');
const { hasRole } = require('../middlewares');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/', getProducts);

router.get(
  '/:id',
  [
    check('id', 'Is not a valid id.').isMongoId(),
    check('id').custom(productExists),
    validateFields,
  ],
  getProduct
);

router.post(
  '/',
  [
    validateJWT,
    check('name', 'Name is required.').not().isEmpty(),
    validateFields,
  ],
  createProduct
);

router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'Is not a valid id.').isMongoId(),
    check('id').custom(productExists),
    validateFields,
  ],
  updateProduct
);

router.delete(
  '/:id',
  [
    validateJWT,
    hasRole('ADMIN_ROLE'),
    check('id', 'Is not a valid id.').isMongoId(),
    check('id').custom(productExists),
    validateFields,
  ],
  deleteProduct
);

module.exports = router;
