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

module.exports = {
  validateJWT
}