const { existsSync, unlinkSync } = require('fs');
const path = require('path');

const { response, request } = require('express');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFilePromise } = require('../helpers');
const { User, Product } = require('../models');

const uploadFile = async (req = request, res = response) => {
  try {
    // const name = await uploadFilePromise(req.files, ['txt', 'md'], 'texts');
    const name = await uploadFilePromise(req.files, undefined, 'imgs');

    res.json({
      name,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: error,
    });
  }
};

const updateImage = async (req = request, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);

      if (!model) {
        return res.status(400).json({
          msg: `User does not exist with this id: ${id}`,
        });
      }

      break;
    case 'products':
      model = await Product.findById(id);

      if (!model) {
        return res.status(400).json({
          msg: `Product does not exist with this id: ${id}`,
        });
      }

      break;
    default:
      return res.status(500).json({
        msg: 'Internal error server.',
      });
  }

  // clear previous images
  if (model.img) {
    // Delete the image in server
    const pathImage = path.join(__dirname, '../uploads', collection, model.img);

    if (existsSync(pathImage)) {
      unlinkSync(pathImage);
    }
  }

  const name = await uploadFilePromise(req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.json(model);
};

const updateImageCloudinary = async (req = request, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);

      if (!model) {
        return res.status(400).json({
          msg: `User does not exist with this id: ${id}`,
        });
      }

      break;
    case 'products':
      model = await Product.findById(id);

      if (!model) {
        return res.status(400).json({
          msg: `Product does not exist with this id: ${id}`,
        });
      }

      break;
    default:
      return res.status(500).json({
        msg: 'Internal error server.',
      });
  }

  // clear previous images
  if (model.img) {
    const nameArr = model.img.split('/');
    const name = nameArr[nameArr.length - 1];
    const [public_id] = name.split('.');
    cloudinary.uploader.destroy(`restServer/${public_id}`);
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
    folder: 'restServer',
  });
  model.img = secure_url;

  await model.save();

  res.json(model);
};

const showImage = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);

      if (!model) {
        return res.status(400).json({
          msg: `User does not exist with this id: ${id}`,
        });
      }

      break;
    case 'products':
      model = await Product.findById(id);

      if (!model) {
        return res.status(400).json({
          msg: `Product does not exist with this id: ${id}`,
        });
      }

      break;
    default:
      return res.status(500).json({
        msg: 'Internal error server.',
      });
  }

  // clear previous images
  if (model.img) {
    // Delete the image in server
    const pathImage = path.join(__dirname, '../uploads', collection, model.img);

    if (existsSync(pathImage)) {
      return res.sendFile(pathImage);
    }
  }

  const pathImage = path.join(__dirname, '../assets/no-image.jpg');

  res.sendFile(pathImage);
};

module.exports = {
  uploadFile,
  updateImage,
  updateImageCloudinary,
  showImage,
};
