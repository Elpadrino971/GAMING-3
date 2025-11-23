# 🏗️ POKERMIND - ARCHITECTURE TECHNIQUE DÉTAILLÉE

## 📐 ARCHITECTURE GLOBALE

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  Next.js 14 (App Router) + React 18 + TypeScript 5.3       │
│  Three.js + WebGL + WebXR (3D/VR/AR)                        │
│  Framer Motion (Animations)                                 │
│  Tailwind CSS (Styling)                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                         API GATEWAY                          │
├─────────────────────────────────────────────────────────────┤
│  Kong API Gateway / AWS API Gateway                         │
│  Rate Limiting, Auth, Load Balancing                        │
│  WebSocket Gateway (Socket.io)                              │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                    MICROSERVICES LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Game Service │  │ User Service │  │  AI Service  │     │
│  │  (Node.js)   │  │  (Node.js)   │  │   (Python)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Payment    │  │  Blockchain  │  │   Streaming  │     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL (Users, Games, Transactions)                    │
│  MongoDB (Hand History, Analytics, Logs)                    │
│  Redis (Cache, Sessions, Real-time data)                    │
│  S3 (Replays, NFTs, Avatars, 3D Models)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                     BLOCKCHAIN LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Ethereum Mainnet (NFTs, $POKER Token)                      │
│  Polygon (L2 for reduced fees)                              │
│  IPFS (NFT metadata storage)                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎮 GAME SERVICE ARCHITECTURE

### Real-Time Game Engine

**Tech Stack:**
- Node.js avec Socket.io (WebSockets)
- Event-driven architecture
- In-memory game state avec Redis

**Game Loop:**
```javascript
// Pseudo-code
class PokerTable {
  constructor(tableId, maxPlayers) {
    this.tableId = tableId
    this.players = []
    this.deck = new Deck()
    this.pot = 0
    this.currentBet = 0
    this.dealerPosition = 0
    this.state = 'WAITING' // WAITING, DEALING, BETTING, SHOWDOWN
  }

  async gameLoop() {
    while (this.players.length >= 2) {
      await this.dealCards()
      await this.bettingRound('PREFLOP')
      await this.dealFlop()
      await this.bettingRound('FLOP')
      await this.dealTurn()
      await this.bettingRound('TURN')
      await this.dealRiver()
      await this.bettingRound('RIVER')
      await this.showdown()
      await this.distributeWinnings()

      // Emit events pour 3D rendering
      this.emitGameState()
    }
  }

  emitGameState() {
    io.to(this.tableId).emit('gameState', {
      players: this.players,
      communityCards: this.communityCards,
      pot: this.pot,
      currentPlayer: this.currentPlayerIndex,
      // 3D specific data
      cardPositions: this.calculateCardPositions(),
      chipAnimations: this.generateChipAnimations(),
    })
  }
}
```

### Scalability:
- Horizontal scaling avec Kubernetes
- Table sharding par région (EU, US, ASIA)
- Auto-scaling basé sur load (CPU > 70%)
- Max 1000 joueurs/serveur optimisé

---

## 🤖 AI SERVICE ARCHITECTURE

### AI Coach Engine

**Tech Stack:**
- Python 3.11 avec FastAPI
- OpenAI GPT-4 API (fine-tuned on poker data)
- Custom poker ML model (TensorFlow)
- Redis pour cache des analyses

**Architecture:**
```python
class AIPokerCoach:
    def __init__(self):
        self.gpt_model = openai.ChatCompletion
        self.poker_model = load_model('poker_analyzer.h5')
        self.cache = Redis()

    async def analyze_hand(self, hand_data):
        # Cache check
        cache_key = f"analysis:{hash(hand_data)}"
        if cached := self.cache.get(cache_key):
            return cached

        # Hand strength calculation
        strength = self.poker_model.predict(hand_data)

        # GPT-4 reasoning
        prompt = f"""
        Analyze this poker hand:
        Your cards: {hand_data['cards']}
        Board: {hand_data['board']}
        Position: {hand_data['position']}
        Pot: {hand_data['pot']}

        Provide: recommendation, pot_odds, equity, reasoning
        """

        reasoning = await self.gpt_model.create(
            model="ft:gpt-4-poker-2024",
            messages=[{"role": "user", "content": prompt}]
        )

        result = {
            'strength': strength,
            'recommendation': reasoning['recommendation'],
            'confidence': reasoning['confidence'],
            'reasoning': reasoning['text']
        }

        # Cache for 5 minutes
        self.cache.setex(cache_key, 300, result)
        return result
```

### Hand Predictor AI

**ML Model:**
- Custom neural network (Keras/TensorFlow)
- Training data: 10M+ hands from online poker
- Features: betting patterns, position, board texture, timing
- Accuracy: ~75% pour top-3 predicted hands

**Model Architecture:**
```python
model = Sequential([
    Dense(256, activation='relu', input_shape=(input_features,)),
    Dropout(0.3),
    Dense(128, activation='relu'),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dense(num_hand_classes, activation='softmax')
])
```

### Gesture Recognition

**Tech Stack:**
- MediaPipe (Google) pour hand tracking
- Custom CNN pour gesture classification
- TensorFlow Lite pour inference temps réel

**Pipeline:**
1. Webcam capture → MediaPipe hand landmarks
2. Hand landmarks → Feature extraction
3. Features → CNN classification
4. Output: gesture + confidence

---

## 🔗 BLOCKCHAIN SERVICE ARCHITECTURE

### Smart Contracts (Solidity)

**NFT Contract (ERC-721):**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PokerMindNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    mapping(uint256 => string) public rarities; // mythic, legendary, epic, rare, common
    mapping(uint256 => uint256) public mintPrices;

    event NFTMinted(uint256 tokenId, address owner, string rarity);

    constructor() ERC721("PokerMind", "PMIND") {}

    function mint(string memory rarity, string memory tokenURI)
        public
        payable
        returns (uint256)
    {
        require(msg.value >= mintPrices[rarity], "Insufficient payment");

        uint256 tokenId = _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        rarities[tokenId] = rarity;

        emit NFTMinted(tokenId, msg.sender, rarity);
        return tokenId;
    }

    function setMintPrice(string memory rarity, uint256 price)
        public
        onlyOwner
    {
        mintPrices[rarity] = price;
    }
}
```

**$POKER Token (ERC-20):**
```solidity
contract PokerToken is ERC20, Ownable {
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1B tokens

    constructor() ERC20("PokerMind Token", "POKER") {
        _mint(msg.sender, TOTAL_SUPPLY);
    }

    // Staking rewards
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public stakingStartTime;
    uint256 public constant APY = 185; // 18.5% APY

    function stake(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _transfer(msg.sender, address(this), amount);
        stakedBalance[msg.sender] += amount;
        stakingStartTime[msg.sender] = block.timestamp;
    }

    function calculateRewards(address user) public view returns (uint256) {
        uint256 timeStaked = block.timestamp - stakingStartTime[user];
        uint256 rewards = (stakedBalance[user] * APY * timeStaked) / (365 days * 1000);
        return rewards;
    }

    function claimRewards() public {
        uint256 rewards = calculateRewards(msg.sender);
        require(rewards > 0, "No rewards");

        _mint(msg.sender, rewards);
        stakingStartTime[msg.sender] = block.timestamp;
    }
}
```

### Blockchain Integration Service

**Tech Stack:**
- ethers.js pour interaction smart contracts
- Web3.js comme fallback
- IPFS (Pinata) pour NFT metadata
- Infura/Alchemy pour Ethereum nodes

**Service:**
```typescript
class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider
  private nftContract: ethers.Contract
  private tokenContract: ethers.Contract

  async mintNFT(
    userAddress: string,
    rarity: string,
    metadata: object
  ): Promise<string> {
    // Upload metadata to IPFS
    const ipfsHash = await this.uploadToIPFS(metadata)
    const tokenURI = `ipfs://${ipfsHash}`

    // Mint NFT
    const tx = await this.nftContract.mint(rarity, tokenURI, {
      value: this.getMintPrice(rarity)
    })

    await tx.wait()
    return tx.hash
  }

  async getWalletBalance(address: string): Promise<{
    ETH: string,
    POKER: string
  }> {
    const ethBalance = await this.provider.getBalance(address)
    const pokerBalance = await this.tokenContract.balanceOf(address)

    return {
      ETH: ethers.utils.formatEther(ethBalance),
      POKER: ethers.utils.formatEther(pokerBalance)
    }
  }
}
```

---

## 💾 DATABASE SCHEMAS

### PostgreSQL Schema

**Users Table:**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(42) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    kyc_verified BOOLEAN DEFAULT FALSE,
    country_code CHAR(2),
    total_hands_played INTEGER DEFAULT 0,
    total_winnings DECIMAL(15,2) DEFAULT 0,
    skill_rating INTEGER DEFAULT 400,
    vip_level INTEGER DEFAULT 0
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_wallet ON users(wallet_address);
```

**Games Table:**
```sql
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id VARCHAR(50) NOT NULL,
    game_type VARCHAR(20) NOT NULL, -- cash, tournament, sitandgo
    variant VARCHAR(20) NOT NULL, -- holdem, omaha, boucherie
    stakes VARCHAR(20),
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    winner_id UUID REFERENCES users(id),
    pot_size DECIMAL(15,2),
    hand_history JSONB,
    replay_url VARCHAR(255)
);

CREATE INDEX idx_games_table ON games(table_id);
CREATE INDEX idx_games_user ON games(winner_id);
```

**Transactions Table:**
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(20) NOT NULL, -- deposit, withdrawal, win, loss, nft_buy, nft_sell
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) NOT NULL, -- USD, ETH, POKER
    status VARCHAR(20) DEFAULT 'pending',
    blockchain_tx_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
```

### MongoDB Collections

**Hand History:**
```javascript
{
  _id: ObjectId,
  gameId: UUID,
  tableId: String,
  handNumber: Number,
  timestamp: ISODate,
  players: [
    {
      userId: UUID,
      position: String,
      startingStack: Number,
      cards: [String],
      actions: [
        {
          street: String, // preflop, flop, turn, river
          action: String, // fold, call, raise, all-in
          amount: Number,
          timestamp: ISODate
        }
      ],
      finalStack: Number,
      won: Boolean
    }
  ],
  communityCards: {
    flop: [String],
    turn: String,
    river: String
  },
  pot: Number,
  rake: Number,
  winner: {
    userId: UUID,
    hand: String,
    handRank: String
  }
}
```

**Analytics:**
```javascript
{
  _id: ObjectId,
  userId: UUID,
  date: ISODate,
  metrics: {
    handsPlayed: Number,
    handsWon: Number,
    winRate: Number,
    vpip: Number, // Voluntarily Put money In Pot
    pfr: Number, // Pre-Flop Raise
    aggression: Number,
    profit: Number,
    biggestWin: Number,
    biggestLoss: Number,
    avgPot: Number,
    playTime: Number // minutes
  },
  positions: {
    button: { hands: Number, wins: Number, profit: Number },
    cutoff: { hands: Number, wins: Number, profit: Number },
    // ... other positions
  }
}
```

---

## 🚀 DEPLOYMENT INFRASTRUCTURE

### Kubernetes Configuration

**namespace.yaml:**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: pokermind-prod
```

**game-service-deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: game-service
  namespace: pokermind-prod
spec:
  replicas: 10
  selector:
    matchLabels:
      app: game-service
  template:
    metadata:
      labels:
        app: game-service
    spec:
      containers:
      - name: game-service
        image: pokermind/game-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-secret
              key: url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: game-service
  namespace: pokermind-prod
spec:
  selector:
    app: game-service
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

**HPA (Horizontal Pod Autoscaler):**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: game-service-hpa
  namespace: pokermind-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: game-service
  minReplicas: 5
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### CI/CD Pipeline (GitHub Actions)

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          npm install
          npm run test
          npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker images
        run: |
          docker build -t pokermind/game-service:${{ github.sha }} ./services/game
          docker build -t pokermind/ai-service:${{ github.sha }} ./services/ai
      - name: Push to Registry
        run: |
          docker push pokermind/game-service:${{ github.sha }}
          docker push pokermind/ai-service:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/game-service \
            game-service=pokermind/game-service:${{ github.sha }} \
            -n pokermind-prod
          kubectl rollout status deployment/game-service -n pokermind-prod
```

---

## 🔐 SECURITY ARCHITECTURE

### Authentication Flow

**JWT-based Auth:**
```typescript
// Login endpoint
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body

  // Validate credentials
  const user = await User.findOne({ email })
  if (!user || !await bcrypt.compare(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  // Generate JWT
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )

  // Store refresh token in Redis
  await redis.setex(`refresh:${user.id}`, 604800, refreshToken)

  res.json({ accessToken, refreshToken, user })
})

// WebSocket authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = payload.userId
    next()
  } catch (err) {
    next(new Error('Authentication failed'))
  }
})
```

### Rate Limiting

**Redis-based rate limiter:**
```typescript
class RateLimiter {
  constructor(
    private redis: Redis,
    private maxRequests: number = 100,
    private windowMs: number = 60000
  ) {}

  async check(userId: string): Promise<boolean> {
    const key = `ratelimit:${userId}`
    const current = await this.redis.incr(key)

    if (current === 1) {
      await this.redis.pexpire(key, this.windowMs)
    }

    return current <= this.maxRequests
  }
}

// Middleware
app.use(async (req, res, next) => {
  const limiter = new RateLimiter(redis)

  if (!await limiter.check(req.userId)) {
    return res.status(429).json({ error: 'Too many requests' })
  }

  next()
})
```

---

## 📊 MONITORING & LOGGING

### Prometheus Metrics

**Custom metrics:**
```typescript
import { Counter, Histogram, Gauge } from 'prom-client'

// Metrics
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status']
})

const gameSessionDuration = new Histogram({
  name: 'game_session_duration_seconds',
  help: 'Game session duration',
  buckets: [60, 300, 900, 1800, 3600]
})

const activeGames = new Gauge({
  name: 'active_games_total',
  help: 'Number of active games'
})

// Middleware
app.use((req, res, next) => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || 'unknown',
      status: res.statusCode
    })
  })

  next()
})
```

### ELK Stack (Elasticsearch, Logstash, Kibana)

**Structured logging:**
```typescript
import winston from 'winston'

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Elasticsearch({
      level: 'info',
      clientOpts: { node: process.env.ELASTICSEARCH_URL }
    })
  ]
})

// Usage
logger.info('Game started', {
  gameId: game.id,
  tableId: game.tableId,
  playerCount: game.players.length,
  stakes: game.stakes
})
```

---

## 🎯 PERFORMANCE OPTIMIZATIONS

### Frontend Optimizations

**Code Splitting:**
```typescript
// Dynamic imports for 3D components
const PokerTable3D = dynamic(() => import('@/components/poker3d/PokerTable3D'), {
  ssr: false,
  loading: () => <LoadingSpinner />
})

const VRMode = dynamic(() => import('@/components/poker3d/VRMode'), {
  ssr: false
})
```

**Asset Optimization:**
- 3D models: GLB compressed avec Draco
- Textures: WebP format, lazy loading
- Fonts: Subset fonts, preload critical
- Images: Next.js Image component avec blur placeholder

**WebGL Optimizations:**
```typescript
// LOD (Level of Detail) for 3D models
const cardLOD = new THREE.LOD()
cardLOD.addLevel(cardHighPoly, 0)
cardLOD.addLevel(cardMediumPoly, 50)
cardLOD.addLevel(cardLowPoly, 100)

// Instanced rendering for chips
const chipGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32)
const chipMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
const chipMesh = new THREE.InstancedMesh(chipGeometry, chipMaterial, 1000)
```

### Backend Optimizations

**Database Query Optimization:**
```typescript
// Bad: N+1 query
const games = await Game.findAll()
for (const game of games) {
  game.winner = await User.findByPk(game.winnerId) // N queries
}

// Good: JOIN
const games = await Game.findAll({
  include: [{ model: User, as: 'winner' }]
})
```

**Caching Strategy:**
```typescript
// Multi-level cache
class CacheService {
  async get(key: string): Promise<any> {
    // 1. Check memory cache
    if (memoryCache.has(key)) return memoryCache.get(key)

    // 2. Check Redis
    const redisValue = await redis.get(key)
    if (redisValue) {
      memoryCache.set(key, redisValue)
      return redisValue
    }

    // 3. Check database
    const dbValue = await database.get(key)
    if (dbValue) {
      await redis.setex(key, 3600, dbValue)
      memoryCache.set(key, dbValue)
      return dbValue
    }

    return null
  }
}
```

---

**Document créé le:** 2025-01-23
**Version:** 1.0
**Auteur:** PokerMind Tech Team
**Statut:** PRODUCTION READY ⚡
