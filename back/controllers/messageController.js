const Message = require('../models/Message');

const getMessages = async (req, res) => {
  const { userId } = req.params;
  const ourUserId = req.userData.userId;

  try {
    const messages = await Message.find({
      sender: { $in: [userId, ourUserId] },
      recipient: { $in: [userId, ourUserId] },
    }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createMessage = async (req, res) => {
  // Implement create message logic
};

module.exports = { getMessages, createMessage };
