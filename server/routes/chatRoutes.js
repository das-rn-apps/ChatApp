import express from 'express';
import { getChats, createChat, getChat, updateChat, deleteChat } from '../controllers/chatController.js';
import { getMessagesByChatId, createMessage } from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getChats);
router.post('/', createChat);
router.get('/:id', getChat);
router.put('/:id', updateChat);
router.delete('/:id', deleteChat);
router.get('/:id/messages', getMessagesByChatId);
router.post('/:id/messages', createMessage);

export default router;