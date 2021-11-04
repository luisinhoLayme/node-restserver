const { response, request } = require('express');

const usersGet = (req = request, res = response) => {

  const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;

  res.json({
    msg: 'get API - controller',
    q,
    nombre, 
    apikey,
    page,
    limit
  });
}

const usersPut = (req, res = response) => {

  const { id } = req.params;

  res.status(500).json({
    msg: 'put API - controller',
    id
  })
}

const usersPost = (req, res = response) => {

  const { nombre, edad } = req.body;

  res.status(201).json({
    msg: 'post API - controller',
    nombre,
    edad
  })
}

const usersDelete = (req, res = response) => {
  res.json({
    msg: 'delete API - controller'
  })
}

const usersPatch = (req, res = response) => {
  res.json({
    msg: 'patch API - controller'
  })
}

module.exports = {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
  usersPatch
}
