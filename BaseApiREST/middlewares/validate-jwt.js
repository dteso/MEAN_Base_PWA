const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {
  const token = req.header('x-token');
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'Does not exist token'
    })
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid; //Se inyecta en la petición que será la que finalmente llegará al controlador con el req modificado
    next();
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: 'Not a valid token'
    })
  }
}

const validateJWTforProtectedRoute = (req, res, next) => {
  const token = req.header('x-token');
  if (!token) {
    return res.send(`
    <span style="width: 100%; text-align: center; justify-content: center;">
      <div style="min-width: 40%; text-align: center; margin-top: 10%; padding: 4rem; border-radius: 2%; background: black; color: darkgray">
        <h1 style="font-size: 5rem;"> UNAUTHORIZED </h1>
        <h1 style="font-size: 5rem;">403</h1>
      </div>
    </span>
    `);
  }
}

module.exports = {
  validateJWT,
  validateJWTforProtectedRoute
}