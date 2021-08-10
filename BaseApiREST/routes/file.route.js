const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { FileController } = require('../controllers/file.controller');
const controller = new FileController();

const router = Router();
router.use(expressFileUpload());

/*************************************************************** 
                       PUT: /upload
         * Sube un archivo al directorio indicado *
****************************************************************/
router.put('/',
  [
    // check('email', 'email is required').isEmail(),
    // check('password', 'password is required').not().isEmpty(),
    // validateFields
  ],
  controller.uploadFile);


/*************************************************************** 
                      GET: /upload/list
                  * Gets all images in DB *
****************************************************************/
  router.get('/list',
  [
    // check('email', 'email is required').isEmail(),
    // check('password', 'password is required').not().isEmpty(),
    // validateFields
  ],
  controller.listFiles);


/*************************************************************** 
                  GET: /upload/list/:folder
               * Gets all images from a folder *
****************************************************************/
router.get('/list/:folder',
[
  // check('email', 'email is required').isEmail(),
  // check('password', 'password is required').not().isEmpty(),
  // validateFields
],
controller.listByFolder);

/*************************************************************** 
                  POST: /upload/structure
  * Carga la estructura de directorios a partir de la raíz indicada *
****************************************************************/
router.post('/structure',
[
  // check('email', 'email is required').isEmail(),
  // check('password', 'password is required').not().isEmpty(),
  // validateFields
],
controller.getFolderStructure);


/*************************************************************** 
                      POST: /upload/folder
      Crea un directorio en la ruta indicada en la petición
****************************************************************/
router.post('/folder',
  [
    // check('email', 'email is required').isEmail(),
    // check('password', 'password is required').not().isEmpty(),
    // validateFields
  ],
  controller.createFolder);




/*************************************************************** 
                  DELETE: /upload/file/:uid
        * Borra una imagen por su uid en BD *
****************************************************************/
router.delete('/file/:uid',
[
  // check('email', 'email is required').isEmail(),
  // check('password', 'password is required').not().isEmpty(),
  // validateFields
],
controller.deleteFile);



/*************************************************************** 
                  PUT: /upload/folder
  * Borra un directorio de la ruta indicada por la petición *
****************************************************************/
router.put('/folder',
[
  // check('email', 'email is required').isEmail(),
  // check('password', 'password is required').not().isEmpty(),
  // validateFields
],
controller.deleteFolder);

module.exports = router;