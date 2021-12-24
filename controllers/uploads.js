const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require('express');
const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models');

const cargarArchivo = async( req, res = response ) => {

  // Esto ya se esta validando con el middlewares valiar-archivo en las rutas
  // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
  //   res.status(400).json({msg: 'No hay archivos que subir'});
  //   return;
  // }

  try {

    // txt, md, vim
    // const nombre = await subirArchivo(req.files, ['txt', 'md', 'vim'], 'textos');
    const nombre = await subirArchivo(req.files, undefined, 'imgs');
    res.json({ nombre });

  } catch (msg) {
    res.status(400).json({ msg })
  }

}

const actualizarImagen = async(req, res = response) => {

  // Esto ya se esta validando con el middlewares valiar-archivo en las rutas
  // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
  //   res.status(400).json({msg: 'No hay archivos que subir'});
  //   return;
  // }

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${ id }`
        })
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${ id }`
        })
      }
    break;

    default:
      return res.status(500).json({ msg: `Se me olvido validar esto` });
  }

  // Limpiar Imagenes previas
  if (modelo.img) {
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    if(fs.existsSync( pathImagen )) {
      fs.unlinkSync( pathImagen );
    }
  }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json( modelo );

}

const actualizarImagenCloudinay = async(req, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${ id }`
        })
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${ id }`
        })
      }
    break;

    default:
      return res.status(500).json({ msg: `Se me olvido validar esto` });
  }

  // Limpiar Imagenes previas
  if (modelo.img) {
    // Separamos el nombre de la imagen
    const nombreArr = modelo.img.split('/');
    // Tomamos el ultimo elemento de la esparacion
    const nombre = nombreArr[ nombreArr.length - 1 ];
    // del ultimo elemento separamo apartir del punto y tomamo el 1er elemento.
   const [ public_id ] = nombre.split('.');
   cloudinary.uploader.destroy( public_id );

  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

  modelo.img = secure_url;

  await modelo.save();

  res.json( modelo );

}
const mostrarImagen = async(req, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${ id }`
        })
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);
      if ( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${ id }`
        })
      }
    break;

    default:
      return res.status(500).json({ msg: `Se me olvido validar esto` });
  }

  // Limpiar Imagenes previas
  if (modelo.img) {
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
    if(fs.existsSync( pathImagen )) {
      // regresa la imagen
      return res.sendFile( pathImagen );
    }
  }

  const pathImagenNoFound = path.join( __dirname, '../assets/no-image.jpg');
    // regresa la imagen no found
   res.sendFile( pathImagenNoFound );
}

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinay
}
