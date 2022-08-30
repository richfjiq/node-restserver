const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const usersGet = async (req = request, res = response) => {
  const users = await User.find();

  res.json(users);
};

const usersPost = async (req = request, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // hash password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();

  res.json({
    user,
  });
};

const usersPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { password, google, email, ...rest } = req.body;

  if (password) {
    // hash password
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, rest);

  res.json(user);
};

const usersPatch = (req = request, res = response) => {
  res.json({
    msg: 'patch API - Controller',
  });
};

const usersDelete = (req = request, res = response) => {
  res.json({
    msg: 'delete API - Controller',
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
};
