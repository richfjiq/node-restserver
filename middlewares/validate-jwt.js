const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'Token is required.',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
    const userAuthenticated = await User.findById(uid);

    if (!userAuthenticated) {
      return res.status(401).json({
        msg: 'Invalid token - User does not exist on db',
      });
    }

    if (!userAuthenticated.state) {
      return res.status(401).json({
        msg: 'Invalid token - User state: false',
      });
    }

    req.userAuthenticated = userAuthenticated;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Invalid token.',
    });
  }
};

module.exports = {
  validateJWT,
};
