const { Router } = require('express');
const { check } = require('express-validator'); //check middlewares
const { validateFields } = require('../middlewares/validate-fields');

const { AuthController } = require('../controllers/auth.controller');
const userModel = require('../models/user.model');
const controller = new AuthController();

const router = Router();

/*************************************************************** 
                      POST: /api/login
****************************************************************/
router.post('/',
  [
    check('email', 'email is required').isEmail(),
    check('password', 'password is required').not().isEmpty(),
    validateFields
  ],
  controller.login);


  /*************************************************************** 
                      POST: /api/login/google
****************************************************************/
router.post('/google',
[
  check('id_token').not().isEmpty(),
  // validateFields
],
controller.googleSignIn);

module.exports = router;

