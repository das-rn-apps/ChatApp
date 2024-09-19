import express from 'express';
import { getChats, createChat, getChat, updateChat, deleteChat } from '../controllers/chatController.js';
import { getMessagesById, createMessage } from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getChats);
router.post('/', createChat);
router.get('/:id', getChat);
router.put('/:id', updateChat);
router.delete('/:id', deleteChat);
router.post('/messages', getMessagesById);
router.post('/message', createMessage);

export default router;