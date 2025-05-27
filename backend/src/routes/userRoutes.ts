import { getQuestions, getUsers } from '../controllers/userControllers';
import express from 'express';

const router = express.Router();

router.get('/', getUsers);
router.get('/questions', getQuestions);

export default router;
