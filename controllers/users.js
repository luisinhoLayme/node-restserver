const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('./../models/usuario');
const {countDocuments} = require('./../models/usuario');

const usersGet = async(req = request, res = response) => {
  // const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;

  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  // const usuarios = await Usuario.find(query)
  //       .skip(Number(desde))
  //       .limit(Number(limite));
  //
  // const total = await Usuario.countDocuments(query);

  // Optimizando la respuesta
  const [ total, usuarios ] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
  ])

  res.json({
    total,
    usuarios
  });
}

const usersPut = async (req, res = response) => {

  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  // TODO validar contra base de datos
  if ( password ) {
    // Encriptar el password
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto)

  res.json( usuario )
}


const usersPost = async(req, res = response) => {

  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  // Verificar si el correo existe
  // const existeEmail = await Usuario.findOne({ correo });
  // if(existeEmail) {
  //   return res.status(400).json({
  //     msg: 'Ese correo ya esta registrado'
  //   });
  // }
  
  // Encriptar el password
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en DB
  await usuario.save();

  res.json({
    usuario
  })
}

const usersDelete = async(req, res = response) => {

  const { id } = req.params;

  // Fisicamente lo borramos
  // const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  // const usuarioAutenticado = req.usuario;

  res.json( usuario )
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
