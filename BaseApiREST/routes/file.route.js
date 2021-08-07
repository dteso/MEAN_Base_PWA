const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { FileController } = require('../controllers/file.controller');
const controller = new FileController();

const router = Router();
router.use(expressFileUpload());

/*************************************************************** 
                      PUT: /upload
****************************************************************/
router.put('/:folder',
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

  module.exports = router;