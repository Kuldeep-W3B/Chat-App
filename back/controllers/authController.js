const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config/keys');

const login = async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
    jwt.sign({ userId: foundUser._id, username, email: foundUser.email }, jwtSecret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { sameSite: 'none', secure: true }).json({ id: foundUser._id });
    });
  } else {
    res.status(401).json('Invalid credentials');
  }
};

const logout = (req, res) => {
  res.cookie('token', '', { sameSite: 'none', secure: true }).json('ok');
};

const register = async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const createdUser = await User.create({ username, password: hashedPassword, email });
  jwt.sign({ userId: createdUser._id, username, email }, jwtSecret, {}, (err, token) => {
    if (err) throw err;
    res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({ id: createdUser._id });
  });
};

module.exports = { login, logout, register };
