const { Router } = require('express');
const { validateJWT, validateJWTforProtectedRoute } = require('../middlewares/validate-jwt');

const router = Router();

router.all('/', 
[
    validateJWTforProtectedRoute
]
,( ) => {
    console.log("PROTECTED ROUTE REQUESTED")
});

module.exports = router;