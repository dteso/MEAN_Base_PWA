const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.use('/', validateJWT , (req, res) => {
    res.download(`./shared/protected/log.txt`,  (err)=>{
        if (err) {
            console.log("ERROR: " + err);
        } else {
            console.log('Sent:', 'log.txt');
        }
    });
});

module.exports = router;