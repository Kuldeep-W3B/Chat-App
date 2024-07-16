const { verifyToken } = require('../utils/jwt');

const getProfile = async (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json('No token provided');
  }

  try {
    const userData = await verifyToken(token);
    res.json(userData);
  } catch (err) {
    res.status(401).json('Invalid token');
  }
};

module.exports = { getProfile };
