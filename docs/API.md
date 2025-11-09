# Documentation API PokerMind

## Base URL

- Development: `http://localhost:8080`
- Production: `https://api.pokermind.com`

## Authentication

Tous les endpoints nécessitent une authentification via JWT (à implémenter).

Headers requis:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /api/auth/register
Créer un nouveau compte.

**Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username"
  }
}
```

#### POST /api/auth/login
Se connecter.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "user": { ... }
}
```

### Game

#### POST /api/game/session/start
Démarrer une nouvelle session de jeu.

**Body:**
```json
{
  "userId": "user_id",
  "sessionType": "CASH_GAME",
  "gameType": "TEXAS_HOLDEM",
  "totalBuyIn": 100
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "session_id",
    "userId": "user_id",
    "startTime": "2024-01-01T00:00:00.000Z",
    ...
  }
}
```

#### POST /api/game/session/:id/end
Terminer une session.

**Body:**
```json
{
  "totalCashOut": 150
}
```

#### POST /api/game/hand
Enregistrer une main jouée.

**Body:**
```json
{
  "userId": "user_id",
  "sessionId": "session_id",
  "handNumber": 1,
  "holeCards": ["As", "Kh"],
  "communityCards": ["Qd", "Jc", "10s"],
  "position": "BUTTON",
  "numPlayers": 6,
  "actions": [...],
  "finalPot": 50,
  "wonAmount": 50,
  "playerDecision": { "type": "raise", "amount": 10 },
  "stackSize": 100
}
```

#### GET /api/game/session/:id
Récupérer les détails d'une session.

#### GET /api/game/sessions/:userId
Récupérer l'historique des sessions.

**Query params:**
- `limit`: nombre de sessions (default: 10)
- `offset`: pagination (default: 0)

### Analysis

#### POST /api/analysis/hand
Analyser une main.

**Body:**
```json
{
  "handId": "hand_id",
  "userId": "user_id"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "equity": 0.65,
    "potOdds": 0.25,
    "gtoRecommendation": {
      "action": "raise",
      "amount": 15,
      "reasoning": "Main forte, construire le pot"
    },
    "isOptimal": true,
    "optimality": 0.95,
    "mistakes": [],
    "suggestions": ["Excellent play!"],
    "expectedValue": 12.5
  }
}
```

#### POST /api/analysis/session
Analyser une session complète.

**Body:**
```json
{
  "sessionId": "session_id",
  "userId": "user_id"
}
```

### Coach

#### POST /api/coach/advice/hand
Obtenir un conseil IA pour une main.

**Body:**
```json
{
  "handId": "hand_id",
  "userId": "user_id",
  "mode": "pro"
}
```

**Response:**
```json
{
  "success": true,
  "advice": [
    {
      "mode": "pro",
      "advice": "Ta décision était optimale. Continue...",
      "priority": "medium",
      "category": "postflop",
      "actionable": true
    }
  ]
}
```

#### POST /api/coach/advice/session
Obtenir des conseils pour une session.

#### POST /api/coach/learning-path
Générer un plan d'apprentissage personnalisé.

**Body:**
```json
{
  "userId": "user_id"
}
```

**Response:**
```json
{
  "success": true,
  "learningPath": [
    "1. Améliorer ton jeu pre-flop en position",
    "2. Réduire ton taux de c-bet",
    "3. Travailler la lecture de range",
    "4. Gérer mieux tes émotions",
    "5. Optimiser ton bluff/value ratio"
  ]
}
```

### Stats

#### GET /api/stats/:userId
Récupérer les statistiques d'un utilisateur.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalHands": 1000,
    "totalSessions": 50,
    "idi": 75.5,
    "vpip": 25.5,
    "pfr": 18.2,
    "aggressionFactor": 2.5,
    "cBetPercentage": 55.0,
    ...
  }
}
```

#### GET /api/stats/leaderboard/idi
Classement IDI global.

**Query params:**
- `limit`: nombre de joueurs (default: 100)
- `offset`: pagination (default: 0)

**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "username": "PokerPro123",
      "idi": 92.5,
      "totalHands": 5000
    },
    ...
  ]
}
```

## WebSocket Events

### Namespace: /game

#### Client → Server

- `join:table` - Rejoindre une table
  ```json
  { "tableId": "table_id", "userId": "user_id", "username": "username" }
  ```

- `leave:table` - Quitter une table

- `player:action` - Jouer une action
  ```json
  { "tableId": "table_id", "action": "raise", "amount": 10 }
  ```

- `hand:start` - Démarrer une nouvelle main

#### Server → Client

- `player:joined` - Un joueur a rejoint

- `game:state` - État actuel de la partie

- `action:performed` - Une action a été jouée

- `turn:changed` - Changement de tour

### Namespace: /coach

#### Client → Server

- `coach:activate` - Activer le coach
  ```json
  { "userId": "user_id", "mode": "pro" }
  ```

- `hand:analyze` - Analyser une décision en temps réel
  ```json
  {
    "handState": {...},
    "playerDecision": {...},
    "mode": "pro",
    "playerLevel": "INTERMEDIATE"
  }
  ```

- `coach:ask` - Poser une question au coach

- `emotion:update` - Mise à jour de l'état émotionnel

#### Server → Client

- `coach:activated` - Coach activé

- `coach:advice` - Conseil du coach

- `coach:alert` - Alerte importante (tilt, erreur critique)

- `coach:response` - Réponse à une question

### Namespace: /live

#### Client → Server

- `stream:create` - Créer un stream
  ```json
  { "userId": "user_id", "username": "username", "mode": "coach-battle" }
  ```

- `stream:join` - Rejoindre un stream

- `coach-battle:vote` - Voter dans un Coach Battle

- `shadow-play:action` - Jouer une action en Shadow Play

- `chat:message` - Envoyer un message dans le chat

#### Server → Client

- `stream:created` - Stream créé

- `viewer:joined` - Un viewer a rejoint

- `coach-battle:comment` - Commentaire d'une IA

- `shadow-play:results` - Résultats de la comparaison

- `chat:message` - Message du chat

## Error Responses

Tous les endpoints peuvent retourner:

```json
{
  "status": "error",
  "message": "Description de l'erreur"
}
```

Status codes:
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error
