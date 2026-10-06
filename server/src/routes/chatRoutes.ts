import { Router, type RequestHandler } from 'express';
import Message from '../models/Message';
import ReadStatus from '../models/ReadStatus';
import type { MarkReadBody, RouteParams, SendMessageBody } from '../types/api';

const router = Router();

const requireAuth: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated?.()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

router.get<RouteParams>('/unread-count/:chatId', requireAuth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user!.id;
    const readStatus = await ReadStatus.findOne({ chatId, userId });
    const lastReadAt = readStatus?.lastReadAt ?? new Date(0);

    const unreadCount = await Message.countDocuments({
      chatId,
      createdAt: { $gt: lastReadAt },
      sender: { $ne: userId },
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching unread count' });
  }
});

router.post<RouteParams, unknown, MarkReadBody>('/read', requireAuth, async (req, res) => {
  try {
    const { chatId } = req.body;
    if (typeof chatId !== 'string' || !chatId) {
      return res.status(400).json({ message: 'Missing chatId' });
    }

    await ReadStatus.findOneAndUpdate(
      { chatId, userId: req.user!.id },
      { lastReadAt: new Date() },
      { upsert: true, new: true },
    );

    res.json({ message: 'Read status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating read status' });
  }
});

router.get<RouteParams>('/:chatId', requireAuth, async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate('sender', 'username avatarUrl')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ message: 'Error getting messages' });
  }
});

router.post<RouteParams, unknown, SendMessageBody>('/', requireAuth, async (req, res) => {
  const { chatId, text } = req.body;
  if (typeof chatId !== 'string' || typeof text !== 'string' || !chatId || !text.trim()) {
    return res.status(400).json({ message: 'Missing chatId or text' });
  }

  try {
    const message = await Message.create({
      chatId,
      sender: req.user!.id,
      text,
    });
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username avatarUrl');

    res.json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

export default router;
