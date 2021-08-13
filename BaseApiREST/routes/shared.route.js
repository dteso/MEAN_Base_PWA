const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.all('/', 
[
    validateJWT
]
,( ) => {
    console.log("PROTECTED ROUTE REQUESTED")
});

module.exports = router;