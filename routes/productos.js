
const { Router } = require('express');
const {check} = require('express-validator');
const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto
} = require('../controllers/productos');

const {validarJWT, validarCampos, esAdminRole} = require('../middlewares');
const { existeProducto, existeCategoria } = require('../helpers/db-validators');

const router = Router();


// Optener productos
router.get('/', obtenerProductos );

// optener productos por id
router.get('/:id',[
  check('id', 'NO es un id de mongo valdio').isMongoId(),
  check('id').custom(existeProducto),
  validarCampos,
], obtenerProducto);

// Crear un Producto
router.post('/',[
  validarJWT,
  check('nombre', 'El nombre el obligatorio').not().isEmpty(),
  check('categoria', 'No es un id de Mongo').isMongoId(),
  check('categoria').custom( existeCategoria ),
  validarCampos,
], crearProducto );

// Actualizar Producto
router.put('/:id',[
  validarJWT,
  // check('categoria', 'No es un id de Mongo').isMongoId(),
  check('id').custom(existeProducto),
  validarCampos,
], actualizarProducto);

// Eliminar producto
router.delete('/:id',[
  validarJWT,
  esAdminRole,
  check('id', 'NO es un id de mongo valdio').isMongoId(),
  check('id').custom(existeProducto),
  validarCampos,
], borrarProducto);

module.exports = router;
