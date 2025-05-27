import { Request, Response } from 'express';
import { getQuestionData, getUserData } from '../services/userServices';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUserData();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error get users', error });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const users = await getQuestionData();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error get users', error });
  }
};