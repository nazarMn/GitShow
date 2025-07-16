// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Проста перевірка авторизації (підміни на свою)
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

// Отримати всі повідомлення чату
router.get('/:chatId', requireAuth, async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate('sender', 'username avatarUrl')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Error getting messages:", err);
    res.status(500).json({ message: 'Error getting messages' });
  }
});

// Відправити повідомлення
router.post('/', requireAuth, async (req, res) => {
  const { chatId, text } = req.body;
  if (!chatId || !text) {
    return res.status(400).json({ message: 'Missing chatId or text' });
  }
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const message = new Message({
      chatId,
      sender: req.user.id,
      text,
    });

    await message.save();

    // Повертаємо з populated sender
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username avatarUrl');

    res.json(populatedMessage);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: 'Error sending message' });
  }
});

module.exports = router;
