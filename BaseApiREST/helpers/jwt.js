const jwt = require('jsonwebtoken');

const generateJWT = (uid) => {

  return new Promise((resolve, reject) => {
    const payload = {
      uid: uid,
      // Se podría añadir algún elemento más a conveniencia
    }
    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '12h'
    }, (err, token) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

module.exports = {
  generateJWT
}