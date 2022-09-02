const { Router } = require('express');
const { check } = require('express-validator');

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categories');
const { categoryExists } = require('../helpers/db-validators');
const { validateJWT, validateFields, hasRole } = require('../middlewares');

const router = Router();

// get all the categories - public
router.get('/', getCategories);

// get category by id - public
router.get(
  '/:id',
  [
    check('id', 'Is not a valid id.').isMongoId(),
    check('id').custom(categoryExists),
    validateFields,
  ],
  getCategory
);

// create category - private - only with valid token
router.post(
  '/',
  [
    validateJWT,
    check('name', 'Name is required.').not().isEmpty(),
    validateFields,
  ],
  createCategory
);

// Update - private - only with valid token
router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'Is not a valid id.').isMongoId(),
    check('id').custom(categoryExists),
    validateFields,
  ],
  updateCategory
);

// delete a category - only Admin
router.delete(
  '/:id',
  [
    validateJWT,
    hasRole('ADMIN_ROLE'),
    check('id', 'Is not a valid id.').isMongoId(),
    check('id').custom(categoryExists),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;
