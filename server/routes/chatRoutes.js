const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Middleware для перевірки авторизації
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

// Отримати повідомлення за chatId
router.get('/:chatId', requireAuth, async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).populate('sender', 'username avatarUrl');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error getting messages' });
  }
});

// Відправити повідомлення
router.post('/', requireAuth, async (req, res) => {
  const { chatId, text } = req.body;

  if (!text || !chatId) return res.status(400).json({ message: 'Missing data' });

  try {
    const message = new Message({
      chatId,
      sender: req.user.id,
      text
    });

    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

module.exports = router;
