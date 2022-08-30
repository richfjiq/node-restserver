const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');
const {
  isRoleValid,
  emailExists,
  userByIdExists,
} = require('../helpers/db-validators');
const {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
} = require('../controllers/users');

const router = Router();

router.get('/', usersGet);

router.post(
  '/',
  [
    check('name', 'Name is required.').not().isEmpty(),
    check(
      'password',
      'Password is required nd must have at least 6 characters.'
    ).isLength({ min: 6 }),
    check('email', 'Email is not valid.').isEmail(),
    check('email').custom(emailExists),
    check('role').custom(isRoleValid),
    validateFields,
  ],
  usersPost
);

router.put(
  '/:id',
  [
    check('id', 'Is not a valid id.').isMongoId(),
    check('id').custom(userByIdExists),
    check('role').custom(isRoleValid),
    validateFields,
  ],
  usersPut
);

router.patch('/', usersPatch);

router.delete(
  '/:id',
  [
    check('id', 'Is not a valid id.').isMongoId(),
    check('id').custom(userByIdExists),
    validateFields,
  ],
  usersDelete
);

module.exports = router;
