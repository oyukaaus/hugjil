import express from 'express';
import {
  startConversation,
  addMessage,
  getUserConversations,
  getConversationMessages,
  deleteUserConversations,
} from '../controllers/chatController';
import { getQuestions, getUsers } from 'controllers/userControllers';

const router = express.Router();

// Routes for Conversation
router.post('/conversation', startConversation);
router.post('/message', addMessage);
router.get('/conversations/:userId', getUserConversations);
router.get('/messages/:conversationId', getConversationMessages);
router.delete('/conversations/:userId', deleteUserConversations);
router.get('/user', getUsers);
router.get('/user/questions', getQuestions);
export default router;
