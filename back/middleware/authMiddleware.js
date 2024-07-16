const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/keys');

const getUserDataFromRequest = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json('No token provided');
  }

  jwt.verify(token, jwtSecret, (err, userData) => {
    if (err) {
      return res.status(401).json('Invalid token');
    }

    req.userData = userData;
    next();
  });
};

module.exports = { getUserDataFromRequest };
