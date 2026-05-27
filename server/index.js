import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import competitorRoutes from './routes/competitorRoutes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET', 'POST'] },
});

app.set('io', io);

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/', (_, res) => res.json({ success: true, message: 'GrowthForge AI API is running' }));
app.get('/api/health', (_, res) => res.json({ success: true, message: 'GrowthForge AI API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/competitors', competitorRoutes);

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    if (userId) socket.join(userId);
  });
  socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // Try MongoDB connection, but continue if it fails for demo purposes
    try {
      const uri = process.env.MONGODB_URI;
      if (uri) {
        await mongoose.connect(uri);
        console.log('MongoDB connected');
      } else {
        console.log('MongoDB URI not provided - running in demo mode');
      }
    } catch (dbErr) {
      console.warn('MongoDB connection failed - running in demo mode:', dbErr.message);
    }
    
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start:', err.message);
    process.exit(1);
  }
};

start();
