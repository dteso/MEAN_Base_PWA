const { Router } = require('express');

const { NewsletterController } = require('../controllers/newsletter.controller');
const controller = new NewsletterController();

const router = Router();

/*************************************************************** 
                      POST: /api/notifications
****************************************************************/
router.post('/', controller.notify);

module.exports = router;