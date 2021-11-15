
const { Router } = require('express');
const {check} = require('express-validator');

/* const {validarCampos} = require('../middlewares/validar-campos'); */
/* const {validarJWT} = require('../middlewares/validar-jwt'); */
/* const {esAdminRole, tieneRol} = require('../middlewares/validar-roles'); */

const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRol
} = require('../middlewares')

const {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
  usersPatch
} = require('../controllers/users');
const {esRoleValido, existeEmail, existeUsuarioPorId} = require('../helpers/db-validators');


const router = Router();

router.get('/', usersGet)

router.put('/:id',[
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom( existeUsuarioPorId ),
  check('rol').custom( esRoleValido ),
  validarCampos
],usersPut);

router.post('/', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password debe set mas de 6 letras').isLength({ min: 6 }),
  check('correo', 'El correo no es valido').isEmail(),
  check('correo').custom(existeEmail),
  // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('rol').custom( esRoleValido ),
  validarCampos
], usersPost)

router.delete('/:id',[
  validarJWT,
  /* esAdminRole, */
  tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom( existeUsuarioPorId ),
  validarCampos
], usersDelete)

router.patch('/', usersPatch)



module.exports = router;
