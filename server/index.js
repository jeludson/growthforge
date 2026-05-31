import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Configure CORS to allow all origins for development (safe for demo)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', process.env.CLIENT_URL],
  credentials: true,
}));

app.use(express.json());

// Test routes
app.get('/', (_, res) => {
  console.log('✅ Root route accessed');
  res.json({ success: true, message: 'GrowthForge AI API is running!' });
});

app.get('/api/health', (_, res) => {
  console.log('✅ Health check accessed');
  res.json({ success: true, message: 'Healthy!' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/competitors', competitorRoutes);

// Socket.io (optional)
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);
  socket.on('join', (userId) => {
    if (userId) socket.join(userId);
  });
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

start();
