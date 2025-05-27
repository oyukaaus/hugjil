import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes'; 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(cors({
  origin: 'http://103.41.112.99:3099'
}));
app.use(express.json());

// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
