const express = require('express');
const { getProfile } = require('../controllers/profileController');
const { getUserDataFromRequest } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', getUserDataFromRequest, getProfile);

module.exports = router;
