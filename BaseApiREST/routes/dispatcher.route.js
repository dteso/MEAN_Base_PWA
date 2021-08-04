const { Router } = require('express');
const { check } = require('express-validator'); //check middlewares
const { DispatcherController } = require('../controllers/dispatcher.controller');

const controller = new DispatcherController();
const router = Router();

router.post('/', controller.sendMail);

module.exports = router;