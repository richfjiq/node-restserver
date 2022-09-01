const validateFields = require('./validate-fields');
const validateJWT = require('./validate-jwt');
const validateRoles = require('./validate-role');

module.exports = {
  ...validateFields,
  ...validateJWT,
  ...validateRoles,
};
