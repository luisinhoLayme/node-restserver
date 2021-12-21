const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
  'usuarios',
  'categorias',
  'productos',
  'roles'
]

// Funcion para buscar usuarios
const buscarUsuarios = async ( termino = '', res = response ) => {
  const esMongoId = ObjectId.isValid( termino ); // true

  // Buscar Usuarios por su id
  if ( esMongoId ) {
    const usuario = await Usuario.findById(termino)
    return res.json({
      results: ( usuario ) ? [ usuario ] : []
    })
  }

  // Buscar Usuarios por nombre, correo
  const regex = new RegExp( termino, 'i' );
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }]
  });

  // Muestra el numero de usuarios
  const numeroUsuarios = await Usuario.count({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }]
  });

  res.json({
    usuarios: numeroUsuarios,
    results: usuarios
  })
}

// Funcion para buscar Categorias
const buscarCategorias = async ( termino = '', res = response ) => {
  const esMongoId = ObjectId.isValid( termino ); // true

  // Buscar Categorias por su id
  if ( esMongoId ) {
    const categoria = await Categoria.findById(termino)
    return res.json({
      results: ( categoria ) ? [ categoria ] : []
    })
  }

  // Buscar Categorias por nombre
  const regex = new RegExp( termino, 'i' );
  const categoria = await Categoria.find({ nombre: regex, estado: true });

  // Muestra el numero de Categorias
  const numeroCategoria = await Categoria.count({ nombre: regex, estado: true });

  res.json({
    categorias: numeroCategoria,
    results: categoria
  })
}

// Funcion para buscar Productos
const buscarProductos = async ( termino = '', res = response ) => {
  const esMongoId = ObjectId.isValid( termino ); // true

  // Buscar Productos por su id
  if ( esMongoId ) {
    const producto = await Producto.findById(termino)
                      .populate('categoria', 'nombre')
    return res.json({
      results: ( producto ) ? [ producto ] : []
    })
  }

  // Buscar Productos por nombre
  const regex = new RegExp( termino, 'i' );
  const producto = await Producto.find({ nombre: regex, estado: true })
                      .populate('categoria', 'nombre')

  // Muestra el numero de Productos
  const numeroProducto = await Producto.count({ nombre: regex, estado: true });

  res.json({
    productos: numeroProducto,
    results: producto
  })
}

// Buscar
const buscar = ( req, res = response ) => {

  const { coleccion, termino } = req.params;

  if ( !coleccionesPermitidas.includes( coleccion ) ) {
    return res.status(400).json({
      msg: `Las colecciones permitas son: ${ coleccionesPermitidas }`
    })
  }

  switch (coleccion) {
    case 'usuarios':
      buscarUsuarios(termino, res);
    break;
    case 'categorias':
      buscarCategorias(termino, res);
    break;
    case 'productos':
      buscarProductos(termino, res);
    break;

    default:
      res.status(500).json({
        msg: 'Se le olvido hacer esta busqueda'
      })

  }

}

module.exports = {
  buscar
}
