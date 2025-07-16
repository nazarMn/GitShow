// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Middleware авторизації (підлаштуй під свій механізм)
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

// Отримати всі повідомлення для chatId (з populated sender)
router.get('/:chatId', requireAuth, async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate('sender', 'username avatarUrl')
      .sort({ createdAt: 1 }); // за датою
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error getting messages' });
  }
});

// Надіслати повідомлення через API (можна через Socket.IO, це для надійності)
router.post('/', requireAuth, async (req, res) => {
  const { chatId, text } = req.body;
  if (!chatId || !text) return res.status(400).json({ message: 'Missing data' });

  try {
    const message = new Message({
      chatId,
      sender: req.user._id, // ID залогіненого користувача
      text
    });
    await message.save();
    const populatedMsg = await message.populate('sender', 'username avatarUrl').execPopulate();
    res.json(populatedMsg);
  } catch (err) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

module.exports = router;
