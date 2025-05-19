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
  const {  content, role } = req.body;
  console.log("msg req: ", req.body)
  try {
  // If the value is coming in as req.body.conversationId (string | undefined):
const idStr = req.body.conversationId;      // e.g. "123"
const conversationId = idStr ? parseInt(idStr, 10) : undefined;

if (!conversationId || Number.isNaN(conversationId)) {
  throw new Error("conversationId must be a valid integer");
}

const message = await prisma.message.create({
  data: {
    conversationId,            // now a number ✅
    content,
    role: role as Role,
  },
});

    console.log("message: ", message)
    res.json(message);
  } catch (error) {
    console.log("error: ", error)
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

// 6. Delete all conversations and messages for a user
export const deleteUserConversations = async (req: Request, res: Response) => {
  const { userId } = req.params;
  console.log("suerUd: ", req.params)
  try {
    const userConversations = await prisma.conversation.findMany({
      where: { userId: Number(userId) },
      select: { id: true },
    });

    const conversationIds = userConversations.map((c) => c.id);

    // Delete messages first (because of FK constraints)
    await prisma.message.deleteMany({
      where: { conversationId: { in: conversationIds } },
    });

    // Then delete conversations
    await prisma.conversation.deleteMany({
      where: { id: { in: conversationIds } },
    });

    res.status(200).json({ message: 'Conversations and messages deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user conversations.' });
  }
};
