const { response, request } = require('express');

const usersGet = (req = request, res = response) => {
  const { q, name = 'No name' } = req.query;
  res.json({
    msg: 'get API - Controller',
    q,
    name,
  });
};

const usersPost = (req = request, res = response) => {
  const { body } = req;
  console.log({ body });
  res.json({
    msg: 'post API - Controller',
    body,
  });
};

const usersPut = (req = request, res = response) => {
  const { id } = req.params;
  res.json({
    msg: 'put API - Controller',
    id,
  });
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
