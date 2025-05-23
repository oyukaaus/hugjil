import express from 'express';
import {
  startConversation,
  addMessage,
  getUserConversations,
  getConversationMessages,
  deleteUserConversations,
} from '../controllers/chatController';

const router = express.Router();

// Routes for Conversation
router.post('/conversation', startConversation);
router.post('/message', addMessage);
router.get('/conversations/:userId', getUserConversations);
router.get('/messages/:conversationId', getConversationMessages);
router.delete('/conversations/:userId', deleteUserConversations);

export default router;
