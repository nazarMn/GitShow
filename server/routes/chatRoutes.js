const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const ReadStatus = require('../models/ReadStatus');

// Перевірка авторизації 
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

router.get('/unread-count/:chatId', requireAuth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const readStatus = await ReadStatus.findOne({ chatId, userId });
    const lastReadAt = readStatus ? readStatus.lastReadAt : new Date(0);

    const unreadCount = await Message.countDocuments({
      chatId,
      createdAt: { $gt: lastReadAt },
      sender: { $ne: userId }
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching unread count' });
  }
});

router.post('/read', requireAuth, async (req, res) => {
  try {
    const { chatId } = req.body;
    const userId = req.user.id;
    const now = new Date();

    await ReadStatus.findOneAndUpdate(
      { chatId, userId },
      { lastReadAt: now },
      { upsert: true, new: true }
    );

    res.json({ message: 'Read status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating read status' });
  }
});


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
