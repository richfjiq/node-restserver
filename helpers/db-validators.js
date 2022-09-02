const { Category } = require('../models');
const Role = require('../models/role');
const User = require('../models/user');

const isRoleValid = async (role = '') => {
  const roleExists = await Role.findOne({ role });
  if (!roleExists) {
    throw new Error(`Role ${role}, is not registered on DB.`);
  }
  return true;
};

const emailExists = async (email = '') => {
  const emailExists = await User.findOne({ email });

  if (emailExists) {
    throw new Error(`email ${email}, is already registered.`);
  }
};

const userByIdExists = async (id) => {
  const userExists = await User.findById(id);
  if (!userExists) {
    throw new Error(`The id does not exist.`);
  }
};

const categoryExists = async (id) => {
  const category = await Category.findById(id);

  if (!category || !category.state) {
    throw new Error(`There is not category with this id: ${id}`);
  }
};

module.exports = {
  isRoleValid,
  emailExists,
  userByIdExists,
  categoryExists,
};
