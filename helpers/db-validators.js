
const {Usuario, Categoria, Producto} = require('../models');
const Role = require('../models/role');

const esRoleValido = async (rol = '') => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la DB`);
  }
}

// Verificar si el correo existe
const existeEmail = async (correo = '') => {
  const existeCorreo = await Usuario.findOne({ correo });
  if(existeCorreo) {
    throw new Error(`El correo ${ correo } ya esta registrado`)
    // return res.status(400).json({
    //   msg: 'Ese correo ya esta registrado'
    // });
  }
}

// Si no existe id usuario
const existeUsuarioPorId = async (id) => {

  const existeUsuario = await Usuario.findById(id);
  if(!existeUsuario) {
    throw new Error(`El id no existe ${ id }`);
  }
}

// Si no existe id categoria
const existeCategoria = async (id) => {

  const existeCat = await Categoria.findById(id);
  if(!existeCat) {
    throw new Error(`Ese id no existe ${ id }`);
  }
}

// Si no existe id producto
const existeProducto = async (id) => {

  const existeProd = await Producto.findById(id);
  if(!existeProd) {
    throw new Error(`Ese id no existe ${ id }`);
  }
}
module.exports = {
  esRoleValido,
  existeEmail,
  existeUsuarioPorId,
  existeCategoria,
  existeProducto
}
