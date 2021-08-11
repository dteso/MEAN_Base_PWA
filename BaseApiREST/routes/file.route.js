const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { FileController } = require('../controllers/file.controller');
const { validateJWT } = require('../middlewares/validate-jwt');
const controller = new FileController();

const router = Router();
router.use(expressFileUpload());

/*************************************************************** 
                       PUT: /upload
         * Sube un archivo al directorio indicado *
****************************************************************/
router.put('/',
  [
    validateJWT
  ],
  controller.uploadFile);


/*************************************************************** 
                      GET: /upload/list
                  * Gets all images in DB *
****************************************************************/
  router.get('/list',
  [
    validateJWT
  ],
  controller.listFiles);


/*************************************************************** 
                  GET: /upload/list/:folder
               * Gets all images from a folder *
****************************************************************/
router.get('/list/:folder',
[
  validateJWT
],
controller.listByFolder);

/*************************************************************** 
                  POST: /upload/structure
  * Carga la estructura de directorios a partir de la raíz indicada *
****************************************************************/
router.post('/structure',
[
  validateJWT
],
controller.getFolderStructure);


/*************************************************************** 
                      POST: /upload/folder
      Crea un directorio en la ruta indicada en la petición
****************************************************************/
router.post('/folder',
  [
    validateJWT
  ],
  controller.createFolder);




/*************************************************************** 
                  DELETE: /upload/file/:uid
        * Borra una imagen por su uid en BD *
****************************************************************/
router.delete('/file/:uid',
[
  validateJWT
],
controller.deleteFile);



/*************************************************************** 
                  PUT: /upload/folder
  * Borra un directorio de la ruta indicada por la petición *
****************************************************************/
router.put('/folder',
[
  validateJWT
],
controller.deleteFolder);

module.exports = router;