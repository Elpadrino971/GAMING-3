# Architecture PokerMind

## Vue d'ensemble

PokerMind est une application monorepo utilisant Turborepo pour gérer plusieurs packages et applications.

```
pokermind/
├── apps/
│   ├── web/          # Application Next.js (Frontend)
│   ├── api/          # API Node.js/Express (Backend)
│   └── streaming/    # Service de streaming (futur)
├── packages/
│   ├── database/     # Prisma schema + client
│   ├── ai-engine/    # Moteur d'analyse IA
│   ├── poker-engine/ # Logique de jeu poker
│   ├── ui/           # Composants UI partagés
│   └── config/       # Configurations partagées
└── docs/             # Documentation
```

## Stack Technologique

### Frontend (apps/web)
- **Next.js 14** - Framework React avec SSR
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Socket.IO Client** - WebSocket temps réel
- **Zustand** - State management
- **React Hot Toast** - Notifications
- **Recharts** - Graphiques et statistiques

### Backend (apps/api)
- **Node.js + Express** - Serveur API REST
- **Socket.IO** - WebSocket pour le temps réel
- **TypeScript** - Typage statique
- **Winston** - Logging
- **Zod** - Validation des données

### Database (packages/database)
- **PostgreSQL** - Base de données principale
- **Prisma ORM** - ORM et migrations
- **Redis** - Cache et sessions

### AI Engine (packages/ai-engine)
- **OpenAI GPT-4** - Génération de conseils
- **Modèle GTO custom** - Calculs poker
- **Math.js** - Calculs mathématiques

## Architecture de l'IA

### 1. Moteur GTO (Game Theory Optimal)

Le `GTOCalculator` calcule les décisions théoriquement optimales:

```typescript
class GTOCalculator {
  calculateGTOAction(state: HandState): GTORecommendation
  calculateEquity(state: HandState): number
  calculatePotOdds(state: HandState): number
}
```

Fonctionnalités:
- Calcul d'équité
- Analyse de board texture
- Détermination de la meilleure action
- Calcul de l'EV (Expected Value)
- Stratégies mixtes avec fréquences

### 2. Analyseur de Range

Le `RangeAnalyzer` estime les ranges des adversaires:

```typescript
class RangeAnalyzer {
  estimateOpponentRange(state: HandState): RangeAnalysis
  categorizeRange(range: string[]): RangeBreakdown
  calculateRangePolarization(range: RangeAnalysis): PolarizationScore
}
```

Analyse:
- Range basé sur les actions
- Catégorisation (paires, tirages, bluffs)
- Polarisation du range
- Suggestions d'ajustement

### 3. Analyseur de Main

Le `HandAnalyzer` combine GTO et range analysis:

```typescript
class HandAnalyzer {
  analyzeHand(state: HandState, decision: Action): HandAnalysis
  evaluateDecision(): { isOptimal, optimality, mistakes }
  generateSuggestions(): string[]
  calculateExpectedValue(): number
}
```

Produit:
- Score d'optimalité (0-1)
- Liste des erreurs avec sévérité
- Suggestions d'amélioration
- Expected Value

### 4. Coach IA

Le `AICoach` utilise OpenAI pour des conseils personnalisés:

```typescript
class AICoach {
  generateHandAdvice(analysis: HandAnalysis, mode: CoachMode): CoachingAdvice[]
  generateSessionAdvice(sessionAnalysis: SessionAnalysis): CoachingAdvice[]
  generateLearningPath(stats: PlayerStats): string[]
}
```

Modes:
- **Light**: Conseils simples pour débutants
- **Pro**: Analyse approfondie avec stats
- **Mentor**: Coaching live vocal + overlay

## Architecture des Données

### Modèles Principaux

```
User
├── UserProfile (1:1)
├── UserStats (1:1)
├── CoachSettings (1:1)
├── Subscription (1:1)
├── Sessions (1:n)
│   └── Hands (1:n)
│       └── HandAnalysis (1:1)
└── Achievements (1:n)
```

### Flux de Données

#### 1. Enregistrement d'une Main

```
Joueur fait une action
  ↓
Frontend envoie à l'API
  ↓
API enregistre dans Hand table
  ↓
Trigger analyse async
  ↓
HandAnalyzer → GTOCalculator + RangeAnalyzer
  ↓
Sauvegarde HandAnalysis
  ↓
AICoach génère conseils
  ↓
WebSocket envoie conseils au frontend
  ↓
CoachOverlay affiche les conseils
```

#### 2. Analyse de Session

```
Session terminée
  ↓
Agrégation de toutes les mains
  ↓
Calcul IDI (moyenne d'optimalité)
  ↓
Identification forces/faiblesses
  ↓
Détection tilt
  ↓
AICoach génère plan d'apprentissage
  ↓
Mise à jour UserStats
```

## Architecture Temps Réel

### WebSocket Namespaces

#### /game
Gère les parties de poker en temps réel:
- État de la table
- Actions des joueurs
- Distribution des cartes
- Gestion du pot

#### /coach
Gère le coaching en temps réel:
- Analyse instantanée des décisions
- Conseils adaptatifs
- Détection de tilt
- Alertes critiques

#### /live
Gère les streams et modes live:
- Coach Battle
- Shadow Play
- Live Assisted
- Chat et interactions

### State Management

#### Frontend (Zustand)
```typescript
useGameStore: {
  currentTable: Table
  myCards: Card[]
  communityCards: Card[]
  pot: number
  players: Player[]
}

useCoachStore: {
  mode: CoachMode
  advice: CoachAdvice[]
  isActive: boolean
  settings: CoachSettings
}

useUserStore: {
  user: User
  stats: UserStats
  sessions: Session[]
}
```

#### Backend (In-Memory + Redis)
- `activeGames`: Map<tableId, GameState>
- `activeStreams`: Map<streamId, LiveStream>
- Cache Redis pour sessions et stats

## Sécurité

### Authentication & Authorization
- JWT tokens
- Refresh tokens
- Role-based access (RBAC)
- Session management avec Redis

### Data Protection
- Hash des mots de passe (bcrypt)
- Validation des inputs (Zod)
- Rate limiting
- CORS configuration
- SQL injection protection (Prisma)

### WebSocket Security
- Authentication avant connexion
- Validation des événements
- Rate limiting par socket
- Déconnexion automatique

## Performance

### Optimisations Frontend
- Code splitting (Next.js)
- Image optimization
- Lazy loading des composants
- Memoization (React.memo, useMemo)
- Virtualization pour longues listes

### Optimisations Backend
- Connection pooling (Prisma)
- Query optimization
- Redis caching
- Compression (gzip)
- Load balancing

### Optimisations Base de Données
- Indexes sur colonnes clés
- Pagination
- Select spécifiques (éviter SELECT *)
- Batch operations
- Migrations incrémentales

## Monitoring

### Métriques
- Temps de réponse API
- Taux d'erreur
- Connexions WebSocket actives
- Utilisation CPU/RAM
- Requêtes DB par seconde

### Logging
- Winston pour structured logging
- Niveaux: error, warn, info, debug
- Rotation des logs
- Agrégation centralisée (futur)

## Scalabilité

### Horizontal Scaling
- Load balancer (Nginx)
- Multiple instances Node.js
- Redis pour state partagé
- Socket.IO avec Redis adapter

### Vertical Scaling
- Augmentation RAM/CPU
- Optimization des requêtes
- Caching agressif

### Future Improvements
- Microservices architecture
- Event-driven architecture
- CQRS pattern
- Kafka pour messaging
- Kubernetes orchestration
