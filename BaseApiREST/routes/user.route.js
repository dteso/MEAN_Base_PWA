const { Router } = require('express');
const { check } = require('express-validator'); //check middlewares
const { validateFields } = require('../middlewares/validate-fields');

const { UserController } = require('../controllers/user.controller');
const userModel = require('../models/user.model');
const { validateJWT } = require('../middlewares/validate-jwt');
const controller = new UserController(userModel);

const router = Router();


/*************************************************************** 
                      GET: /api/users
****************************************************************/
router.get('/', validateJWT, controller.getUsers);



/*************************************************************** 
                      POST: /api/users
****************************************************************/
//router.post('/', createUser); //router.post('/', [{ mmiddleware1 }, { middleware2 }], createUser);
router.post('/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Wrong email format').not().isEmpty().isEmail(),
    validateFields
  ],
  controller.createUser);

/*************************************************************** 
                      PUT: /api/users
****************************************************************/
router.put('/:id',
  [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Wrong email format').not().isEmpty().isEmail(),
    check('role', 'Role is required').not().isEmpty(),
    validateFields
  ],
  controller.updateUser);


/*************************************************************** 
                      DELETE: /api/users
****************************************************************/
router.delete('/:id', validateJWT, controller.deleteUser);

module.exports = router;


