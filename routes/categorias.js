
const { Router } = require('express');
const {check} = require('express-validator');
const {
  crearCategoria, 
  obtenerCategorias, 
  obtenerCategoria, 
  actualizarCategoria, 
  borrarCategoria
} = require('../controllers/categorias');
const {existeCategoria} = require('../helpers/db-validators');

const {validarJWT, validarCampos, esAdminRole} = require('../middlewares');

const router = Router();

/* {{url}}/api/categorias */

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias );

// Obtener una categorias por id - publico
router.get('/:id',[
  check('id', 'NO es un id de mongo valdio').isMongoId(),
  check('id').custom(existeCategoria),
  validarCampos,
], obtenerCategoria);

// Crear categoris - privado - cualquier persona con un token valido
router.post('/', [
  validarJWT,
  check('nombre', 'El nombre el obligatorio').not().isEmpty(),
  validarCampos,
], crearCategoria);

// Actualizar - privado - cualquiera con token valido
router.put('/:id',[
  validarJWT,
  check('nombre', 'El nombre el obligatorio').not().isEmpty(),
  check('id').custom(existeCategoria),
  validarCampos,
], actualizarCategoria);

// Borrar en categoria = Admin
router.delete('/:id',[
  validarJWT,
  esAdminRole,
  check('id', 'NO es un id de mongo valdio').isMongoId(),
  check('id').custom(existeCategoria),
  validarCampos,
], borrarCategoria);

module.exports = router;
