const express = require('express');
const { getMessages } = require('../controllers/messageController');
const { getUserDataFromRequest } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/messages/:userId', getUserDataFromRequest, getMessages);

module.exports = router;
