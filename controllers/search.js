const { request, response } = require('express');
const { isValidObjectId } = require('mongoose');

const { User, Category, Product } = require('../models');

const collectionsAllowed = ['categories', 'products', 'roles', 'users'];

const searchUsers = async (term = '', res = response) => {
  const isMongoId = isValidObjectId(term);

  if (isMongoId) {
    const user = await User.findById(term);

    return res.json({
      results: user ? [user] : [],
    });
  }

  const regex = new RegExp(term, 'i');
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ state: true }],
  });

  res.json({
    results: users,
  });
};

const searchCategories = async (term = '', res = response) => {
  const categoryDB = await Category.find({ name: term.toUpperCase() });

  if (categoryDB.length === 0) {
    return res.status(400).json({
      msg: `Category: ${term} does not exist.`,
    });
  }

  res.json({
    results: categoryDB,
  });
};

const searchProducts = async (term = '', res = response) => {
  const regex = new RegExp(term, 'i');
  const productDB = await Product.find({
    $or: [{ name: regex }, { description: regex }],
    $and: [{ state: true }],
    $and: [{ available: true }],
  });

  res.json({
    results: productDB,
  });
};

const search = (req = request, res = response) => {
  const { collection, term } = req.params;

  if (!collectionsAllowed.includes(collection)) {
    res
      .status(400)
      .json({ msg: `Allowed collections are ${collectionsAllowed}` });
  }

  switch (collection) {
    case 'categories':
      searchCategories(term, res);
      break;
    case 'products':
      searchProducts(term, res);
      break;
    case 'users':
      searchUsers(term, res);
      break;

    default:
      res.status(500).json({
        msg: 'Internal error server.',
      });
  }
};

module.exports = {
  search,
};
