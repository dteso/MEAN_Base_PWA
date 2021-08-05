const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { FileController } = require('../controllers/file.controller');
const controller = new FileController();

const router = Router();
router.use(expressFileUpload());

/*************************************************************** 
                      GET: /upload
****************************************************************/
router.put('/',
  [
    // check('email', 'email is required').isEmail(),
    // check('password', 'password is required').not().isEmpty(),
    // validateFields
  ],
  controller.uploadFile);

  module.exports = router;