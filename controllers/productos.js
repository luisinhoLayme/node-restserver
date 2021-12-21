
const {response} = require('express');
const {Producto} = require('../models');

// obtenerProductos - paginado - total - populate
const obtenerProductos= async (req, res = response) => {

  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true }

  const [ total, productos ] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre')
      .skip(Number(desde))
      .limit(Number(limite))
  ])

  res.json({
    total,
    productos
  })
}

// obtenerCategorias - populate {}
const obtenerProducto = async (req, res = response) => {

  const { id } = req.params;
  const productos = await Producto.findById(id)
  .populate('usuario', 'nombre')
  .populate('categoria', 'nombre');

  res.json( productos )

}

// crearProducto Post
const crearProducto = async (req, res = response) => {

  const {estado, usuario, ...body} = req.body;

  const productoDB = await Producto.findOne({ nombre: body.nombre });

  if ( productoDB ) {
    return res.status(400).json({
      msg: `El producto ${ productoDB.nombre }, ya existe`
    })
  }

  // Generar la data a guardar
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  }

  const producto = await new Producto( data );

  // Guardar DB
  await producto.save();

  res.status(201).json(producto)

}

// actualizarProducto
const actualizarProducto = async (req, res = response) => {

  const { id } = req.params;
  const { usuario, estado, ...resto } = req.body;

  if (resto.nombre) {
    resto.nombre = resto.nombre.toUpperCase();
  }
  resto.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, resto, {new: true})

  res.json( producto )

}

// borrarProducto - estado:false
const borrarProducto = async (req, res = response) => {

  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate(id, { estado: false }, {new: true})

  res.json( producto )
}

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto
}
