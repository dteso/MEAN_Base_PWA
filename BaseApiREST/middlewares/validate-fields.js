const { response } = require('express');
const { validationResult } = require('express-validator');


const validateFields = (req, res = response, next) => {

  const errors = validationResult(req); // Genera en req un array con todos los errores generados durante la validación por parte de los middlewares, si es que los hubiese

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped()
    })
  }

  next();
}

module.exports = {
  validateFields
}
