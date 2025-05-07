import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes'; // import the chatRoutes

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes); // Register chatRoutes here

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
