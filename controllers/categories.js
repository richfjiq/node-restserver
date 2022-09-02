const { response, request } = require('express');

const { Category } = require('../models');

const getCategories = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;

  const [total, categories] = await Promise.all([
    Category.countDocuments(),
    Category.find().skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(201).json({ total, categories });
};

const getCategory = async (req = request, res = response) => {
  const { id } = req.params;

  const category = await Category.findById(id).populate('user', 'name');

  res.status(201).json(category);
};

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    return res.status(400).json({
      msg: `Category ${categoryDB.name}, already exists.`,
    });
  }

  const data = {
    name,
    user: req.userAuthenticated._id,
  };

  const category = new Category(data);

  await category.save();

  res.status(201).json(category);
};

const updateCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const { state, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.userAuthenticated._id;

  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
  }).populate('user', 'name');

  res.status(201).json(category);
};

const deleteCategory = async (req = request, res = response) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(
    id,
    {
      state: false,
    },
    { new: true }
  ).populate('user', 'name');

  res.status(201).json(category);
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
