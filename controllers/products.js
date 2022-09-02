const { request, response } = require('express');

const { Product, Category } = require('../models');

const getProducts = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;

  const [total, products] = await Promise.all([
    Product.countDocuments(),
    Product.find().skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(201).json({ total, products });
};

const getProduct = async (req = request, res = response) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate('user', 'name');

  res.status(201).json(product);
};

const createProduct = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  const productDB = await Product.findOne({ name });
  const categoryDB = await Category.findById(req.body.category);

  console.log(categoryDB);

  if (productDB) {
    return res.status(400).json({
      msg: `Product ${productDB.name}, already exists.`,
    });
  }

  if (!categoryDB) {
    return res.status(400).json({
      msg: `Category id: ${req.body.category} does not exists.`,
    });
  }

  const data = {
    ...req.body,
    name: req.body.name.toUpperCase(),
    user: req.userAuthenticated._id,
    category: categoryDB._id,
  };

  const product = new Product(data);
  await product.save();
  res.status(201).json(product);
};

const updateProduct = async (req = request, res = response) => {
  const { id } = req.params;

  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ msg: 'Send some data to update the product.' });
  }

  const { state, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.userAuthenticated._id;

  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
  }).populate('user', 'name');

  res.status(201).json(product);
};

const deleteProduct = async (req = request, res = response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(
    id,
    {
      state: false,
    },
    { new: true }
  ).populate('user', 'name');

  res.status(201).json(product);
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
