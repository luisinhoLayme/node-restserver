
const { Schema, model } = require('mongoose');

const UsuarioShema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre el obligatorio']
  },
  correo: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'El contraseña es obligatorio'],
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    required: true,
    emun: ['ADMIN_ROLE', 'USER_ROLE']
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  },
});

// metodo para sacar el password y __v de la respuesta.
UsuarioShema.methods.toJSON = function() {
  const { __v, password, _id, ...usuario } = this.toObject();
  // cambio el _id a uid
  usuario.uid = _id;
  return usuario;
}

module.exports = model('Usuario', UsuarioShema);
