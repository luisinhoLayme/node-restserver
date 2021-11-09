
const Role = require('../models/role');
const Usuario = require('../models/usuario');

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

const existeUsuarioPorId = async (id) => { 

  const existeUsuario = await Usuario.findById(id);
  if(!existeUsuario) {
    throw new Error(`El id no existe ${ id }`);
  }
}

module.exports = {
  esRoleValido,
  existeEmail,
  existeUsuarioPorId
}
