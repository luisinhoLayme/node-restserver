
const { Router } = require('express');
const {check} = require('express-validator');

const { coleccionesPermitidas } = require('../helpers');
const {validarCampos, validarArchivoSubir} = require('../middlewares');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinay } = require('../controllers/uploads');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id',[
  validarArchivoSubir,
  check('id', 'El id debe ser de mongo').isMongoId(),
  // recibimos la coleccion en c para mandar a validar
  check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'] ) ),
  validarCampos
], actualizarImagenCloudinay);
// ], actualizarImagen);

router.get('/:coleccion/:id',[
  check('id', 'El id debe ser de mongo').isMongoId(),
  // recibimos la coleccion en c para mandar a validar
  check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'] ) ),
  validarCampos
], mostrarImagen);


module.exports = router;
