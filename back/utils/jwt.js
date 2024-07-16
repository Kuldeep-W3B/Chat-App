const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/keys');

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) return reject(err);
      resolve(userData);
    });
  });
};

module.exports = { verifyToken };
