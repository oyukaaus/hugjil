import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes'; 
import userRoutes from './routes/userRoutes'; 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
