const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // email exists?
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: 'Email / Password are invalid - email',
      });
    }

    // user state (active / inactive)
    if (!user.state) {
      return res.status(400).json({
        msg: 'Email / Password are invalid - state: false',
      });
    }

    // verify password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Email / Password are invalid - password',
      });
    }

    // generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      msg: 'Internal server error',
    });
  }
};

module.exports = {
  login,
};
