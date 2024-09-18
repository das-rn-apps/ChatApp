import express from 'express';
import { getChats, createChat, getChat, updateChat, deleteChat } from '../controllers/chatController.js';
import { getMessagesByChatId, createMessage } from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/chats', getChats);
router.post('/chats', createChat);
router.get('/chats/:id', getChat);
router.put('/chats/:id', updateChat);
router.delete('/chats/:id', deleteChat);
router.get('/chats/:id/messages', getMessagesByChatId);
router.post('/chats/:id/messages', createMessage);

export default router;