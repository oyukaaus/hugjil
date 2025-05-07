import { PrismaClient, Role } from '@prisma/client';
import { Request, Response } from 'express';
// import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

// 2. Start a new conversation
export const startConversation = async (req: Request, res: Response) => {
  const { userId, topicName } = req.body;

  try {

    // 2. Create a new conversation linked to this topic
    const conversation = await prisma.conversation.create({
      data: {
        userId,
        topic:topicName
      },
    });

    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to start conversation' });
  }
};

// 3. Add a message (user or assistant)
export const addMessage = async (req: Request, res: Response) => {
  const { conversationId, content, role } = req.body;
  console.log("req: ", req.body)
  try {
    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        role: role as Role,
      },
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
};

// 4. Get user’s conversations
export const getUserConversations = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: Number(userId) },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

// 5. Get messages from a conversation
export const getConversationMessages = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: Number(conversationId) },
      orderBy: { createdAt: 'asc' },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
