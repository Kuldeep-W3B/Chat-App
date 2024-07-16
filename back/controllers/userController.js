const User = require('../models/User');

const getUsers = async (req, res) => {
  const users = await User.find({}, { '_id': 1, username: 1 });
  res.json(users);
};

module.exports = { getUsers };
