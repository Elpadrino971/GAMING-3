import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import gameRoutes from './routes/game';
import analysisRoutes from './routes/analysis';
import sessionRoutes from './routes/session';
import statsRoutes from './routes/stats';
import coachRoutes from './routes/coach';

// WebSocket handlers
import { setupGameSocket } from './websocket/game';
import { setupCoachSocket } from './websocket/coach';
import { setupLiveSocket } from './websocket/live';

// Configuration
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/coach', coachRoutes);

// WebSocket setup
setupGameSocket(io);
setupCoachSocket(io);
setupLiveSocket(io);

// Error handling
app.use(errorHandler);

// Start server
httpServer.listen(PORT, () => {
  logger.info(`🚀 PokerMind API running on port ${PORT}`);
  logger.info(`📡 WebSocket server ready`);
  logger.info(`🎮 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;
