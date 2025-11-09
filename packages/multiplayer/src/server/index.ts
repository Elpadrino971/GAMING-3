import { createServer } from 'http';
import { SocketServer } from './SocketServer';

/**
 * Standalone Multiplayer Server
 * Run with: npm run server
 */

const PORT = process.env.PORT || 3001;

// Create HTTP server
const httpServer = createServer();

// Create Socket.io server
const socketServer = new SocketServer(httpServer);

// Health check endpoint
httpServer.on('request', (req, res) => {
  if (req.url === '/health') {
    const stats = socketServer.getStats();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      ...stats,
    }));
  } else if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>PokerMind Multiplayer Server</title>
          <style>
            body {
              font-family: system-ui, sans-serif;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
              background: #1f2937;
              color: #fff;
            }
            h1 { color: #fbbf24; }
            .status { color: #10b981; }
            .stat {
              background: #374151;
              padding: 15px;
              margin: 10px 0;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <h1>🎰 PokerMind Multiplayer Server</h1>
          <p class="status">✅ Server is running</p>
          <div class="stat">
            <strong>Port:</strong> ${PORT}
          </div>
          <div class="stat">
            <strong>WebSocket:</strong> ws://localhost:${PORT}
          </div>
          <p>Check <a href="/health" style="color: #fbbf24;">/health</a> for server stats</p>
        </body>
      </html>
    `);
  }
});

// Start server
httpServer.listen(PORT, () => {
  console.log('');
  console.log('🎰 PokerMind Multiplayer Server');
  console.log('================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket: ws://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
