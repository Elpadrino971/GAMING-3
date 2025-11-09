# @pokermind/multiplayer 🌐🎰

Real-time multiplayer poker infrastructure with WebSockets for PokerMind.

## Features

✅ **Real-Time Multiplayer**
- Socket.io for WebSocket connections
- Server-authoritative game logic
- Real-time game state synchronization

✅ **Table Management**
- Create and join tables
- 2-6 players per table
- Cash Game and Tournament modes
- Multiple stake levels

✅ **Matchmaking System**
- Automatic player matching
- Queue-based matchmaking
- Stake and game type filtering
- Quick match creation

✅ **Game State Sync**
- Real-time action broadcasting
- Automatic hand progression
- Winner announcements
- Chat support

✅ **Disconnect Handling**
- Graceful disconnect handling
- Auto-reconnection
- Table cleanup when empty

## Architecture

```
packages/multiplayer/
├── src/
│   ├── server/                 # Server-side
│   │   ├── SocketServer.ts     # Main Socket.io server
│   │   ├── TableManager.ts     # Manages poker tables
│   │   ├── MatchmakingService.ts # Player matching
│   │   └── index.ts            # Standalone server
│   ├── client/                 # Client-side
│   │   └── SocketManager.ts    # Client socket manager
│   ├── types.ts                # Shared types
│   └── index.ts                # Package exports
```

## Installation

```bash
# From monorepo root
cd packages/multiplayer
npm install
npm run build
```

## Running the Server

### Standalone Server

```bash
npm run server
```

Server runs on `http://localhost:3001`

### Integrated with Express

```typescript
import { createServer } from 'http';
import express from 'express';
import { SocketServer } from '@pokermind/multiplayer';

const app = express();
const httpServer = createServer(app);

// Create multiplayer server
const socketServer = new SocketServer(httpServer);

httpServer.listen(3001);
```

## Client Usage

### Web App (React)

```typescript
import { getSocketManager } from '@pokermind/multiplayer';

// Connect to server
const socketManager = getSocketManager('http://localhost:3001');
await socketManager.connect();

// Find a match
socketManager.findMatch({
  playerId: user.id,
  username: user.username,
  gameType: 'cash',
  stakes: 'medium',
  buyIn: 1000,
});

// Listen for match found
socketManager.onMatchFound((data) => {
  if (data.matched) {
    console.log('Match found!', data.table);
  }
});

// Listen for game state updates
socketManager.onGameStateUpdate((gameState) => {
  setGameState(gameState);
});

// Send player action
socketManager.sendAction({
  tableId: currentTableId,
  playerId: user.id,
  action: 'raise',
  amount: 100,
});
```

### Mobile App (React Native)

```typescript
import { getSocketManager } from '@pokermind/multiplayer';

// Same API as web!
const socketManager = getSocketManager('http://your-server.com:3001');
await socketManager.connect();

socketManager.findMatch({
  playerId: user.id,
  username: user.username,
  gameType: 'cash',
  stakes: 'low',
  buyIn: 500,
});
```

## Events

### Client → Server

| Event | Description | Payload |
|-------|-------------|---------|
| `getTables` | Get available tables | - |
| `createTable` | Create new table | `TableConfig` |
| `joinTable` | Join a table | `JoinTableRequest` |
| `leaveTable` | Leave table | `playerId` |
| `findMatch` | Start matchmaking | `MatchmakingRequest` |
| `cancelMatchmaking` | Cancel matchmaking | `playerId` |
| `playerAction` | Send game action | `PlayerActionRequest` |
| `sendMessage` | Send chat message | `{ tableId, playerId, message }` |

### Server → Client

| Event | Description | Payload |
|-------|-------------|---------|
| `tablesList` | List of tables | `Table[]` |
| `tableCreated` | New table created | `Table` |
| `playerJoined` | Player joined | `{ playerId, username, table }` |
| `playerLeft` | Player left | `{ playerId }` |
| `matchFound` | Match found | `{ tableId, table }` |
| `gameStateUpdate` | Game state changed | `GameState` |
| `handComplete` | Hand finished | `{ winners }` |
| `gameStarted` | Game started | `{ gameState }` |
| `newMessage` | Chat message | `{ playerId, username, message }` |
| `error` | Error occurred | `{ code, message }` |

## Example Flow

### Quick Match

```typescript
// 1. Connect
await socketManager.connect();

// 2. Find match
socketManager.findMatch({
  playerId: 'user_123',
  username: 'Player1',
  gameType: 'cash',
  stakes: 'low',
  buyIn: 500,
});

// 3. Wait for match
socketManager.onMatchFound((data) => {
  if (data.matched) {
    // Automatically joined table!
    currentTableId = data.tableId;
  }
});

// 4. Play
socketManager.onGameStateUpdate((gameState) => {
  // Update UI with new game state
});

socketManager.sendAction({
  tableId: currentTableId,
  playerId: 'user_123',
  action: 'raise',
  amount: 100,
});
```

### Manual Table Join

```typescript
// 1. Get tables
socketManager.getTables((tables) => {
  console.log('Available tables:', tables);
});

// 2. Join specific table
socketManager.joinTable({
  tableId: 'table_xyz',
  playerId: 'user_123',
  username: 'Player1',
  buyIn: 1000,
});

// 3. Listen for events
socketManager.onPlayerJoined((data) => {
  console.log('Player joined:', data.username);
});
```

## Deployment

### Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "server"]
```

### Environment Variables

```bash
PORT=3001                    # Server port
NODE_ENV=production          # Environment
```

## Testing

```bash
npm test
```

## Features Comparison

| Feature | Solo Play | Multiplayer |
|---------|-----------|-------------|
| Play vs AI | ✅ | ❌ |
| Play vs Humans | ❌ | ✅ |
| Offline Mode | ✅ | ❌ |
| Real-Time | ❌ | ✅ |
| Matchmaking | ❌ | ✅ |
| Chat | ❌ | ✅ |
| Leaderboards | ✅ | ✅ |

## Roadmap

- [ ] Tournament brackets
- [ ] Spectator mode
- [ ] Hand history sync
- [ ] Voice chat
- [ ] Private tables
- [ ] Table customization
- [ ] Anti-cheat measures
- [ ] Rate limiting
- [ ] Redis for scaling

## License

Proprietary - All rights reserved
