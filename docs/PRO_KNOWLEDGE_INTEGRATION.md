# 🎯 Pro Knowledge - Guide d'Intégration

Guide complet pour intégrer le système Pro Knowledge dans PokerMind.

---

## 📋 Table des Matières

1. [Setup Initial](#setup-initial)
2. [Seed Database](#seed-database)
3. [Intégration Frontend](#intégration-frontend)
4. [Utilisation des Hooks](#utilisation-des-hooks)
5. [API Endpoints](#api-endpoints)
6. [Exemples d'Intégration](#exemples-dintégration)

---

## 🚀 Setup Initial

### 1. Installation des Dépendances

```bash
# Dans packages/database
cd packages/database
npm install tsx

# Dans packages/pro-knowledge
cd packages/pro-knowledge
npm install openai

# Build les packages
npm run build
```

### 2. Variables d'Environnement

Ajouter dans `.env` :

```env
# OpenAI pour le ProCoach AI
OPENAI_API_KEY=sk-...

# Stripe pour les achats de coaches
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Frontend URL pour redirection Stripe
FRONTEND_URL=http://localhost:3000
```

---

## 🌱 Seed Database

### Exécuter le Seed Script

```bash
cd packages/database

# Push le schema en database
npm run db:push

# Seed les pros et leurs conseils
npm run seed:pros
```

### Ce qui est créé :

- ✅ 6 Professional Players (Negreanu, Ivey, Holz, Hellmuth, Selbst, Dwan)
- ✅ 60+ Tips catégorisés
- ✅ 3 Stratégies complètes (GTO, Small Ball, Fearless Aggression)
- ✅ Stats vérifiées pour chaque pro (VPIP, PFR, Aggression Factor)

### Vérifier les Données

```bash
npm run db:studio
# Ouvrir http://localhost:5555
# Voir tables: ProPlayer, ProTip, ProStrategy
```

---

## 🎨 Intégration Frontend

### 1. Marketplace Page

Déjà créé : `apps/web/src/app/pro-marketplace/page.tsx`

**Features** :
- Grid de tous les coaches
- Prix et stats affichés
- Flow d'achat Stripe
- Featured pros

**Utilisation** :

```tsx
// Le composant est standalone, suffit de naviguer vers /pro-marketplace
<Link href="/pro-marketplace">
  Browse Pro Coaches
</Link>
```

### 2. Pro Stats Dashboard

Déjà créé : `apps/web/src/app/pro-stats/page.tsx`

**Features** :
- Comparaison stats joueur vs pro
- Style matching score
- Recommandations personnalisées
- Progress tracking

**Utilisation** :

```tsx
// Naviguer vers /pro-stats
<Link href="/pro-stats">
  View Your Stats
</Link>
```

### 3. In-Game Comparison

Composant : `apps/web/src/components/InGameProComparison.tsx`

**Utilisation dans une page de jeu** :

```tsx
import InGameProComparison from '@/components/InGameProComparison';
import { useMyCoaches } from '@/hooks/useProComparison';

export default function GamePage() {
  const { activeCoach } = useMyCoaches('user_123');
  const [lastHand, setLastHand] = useState(null);
  const [lastAction, setLastAction] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  const handleAction = (action: string, handId: string) => {
    // Jouer l'action
    playAction(action);

    // Déclencher la comparaison avec le pro
    setLastHand(handId);
    setLastAction(action);
    setShowComparison(true);
  };

  return (
    <div>
      {/* Votre interface de jeu */}
      <PokerTable onAction={handleAction} />

      {/* Comparaison avec le pro */}
      {showComparison && activeCoach && (
        <InGameProComparison
          handId={lastHand}
          playerAction={lastAction}
          userId="user_123"
          activeProId={activeCoach.id}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}
```

### 4. Pro Comparison Component

Composant statique : `apps/web/src/components/ProComparison.tsx`

**Utilisation pour afficher une comparaison existante** :

```tsx
import ProComparison from '@/components/ProComparison';

<ProComparison
  handId="hand_123"
  playerAction="call"
  proAction="raise"
  proName="Phil Ivey"
  proNickname="The Tiger Woods of Poker"
  reasoning="Aggression puts pressure on opponents..."
  evDifference={-7.2}
  grade="C"
/>
```

---

## 🪝 Utilisation des Hooks

### Hook: `useProComparison`

Compare automatiquement les actions du joueur avec un pro.

```tsx
import { useProComparison } from '@/hooks/useProComparison';

function GameComponent() {
  const {
    comparison,
    loading,
    shouldShow,
    compareAction,
    hideComparison
  } = useProComparison({
    userId: 'user_123',
    activeProId: 'phil-ivey',
    autoShow: true,
    minEvDifference: 2.0 // Ne montrer que si diff > 2 BB
  });

  const handlePlayerAction = async (action: string, handId: string) => {
    // Jouer l'action
    await playAction(action);

    // Comparer avec le pro
    const result = await compareAction(handId, action);

    if (result) {
      console.log('Grade:', result.grade);
      console.log('EV Diff:', result.evDifference);
    }
  };

  return (
    <div>
      {shouldShow && comparison && (
        <ComparisonPopup
          data={comparison}
          onClose={hideComparison}
        />
      )}
    </div>
  );
}
```

### Hook: `useMyCoaches`

Gère les coaches achetés par le joueur.

```tsx
import { useMyCoaches } from '@/hooks/useProComparison';

function CoachSelector() {
  const {
    coaches,
    activeCoach,
    loading,
    selectCoach,
    hasCoach
  } = useMyCoaches('user_123');

  if (loading) return <Spinner />;

  if (coaches.length === 0) {
    return <NoCoachesMessage />;
  }

  return (
    <div>
      <h2>Your Coaches</h2>
      {coaches.map(coach => (
        <div key={coach.id}>
          <button onClick={() => selectCoach(coach.id)}>
            {coach.name}
            {activeCoach?.id === coach.id && ' ✓'}
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Hook: `usePlayerStats`

Récupère les stats du joueur.

```tsx
import { usePlayerStats } from '@/hooks/useProComparison';

function StatsDisplay() {
  const { stats, loading, error } = usePlayerStats('user_123');

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;

  return (
    <div>
      <p>VPIP: {stats.vpip}%</p>
      <p>PFR: {stats.pfr}%</p>
      <p>Aggression: {stats.aggressionFactor}x</p>
    </div>
  );
}
```

### Hook: `useStyleMatch`

Trouve les pros similaires au joueur.

```tsx
import { useStyleMatch } from '@/hooks/useProComparison';

function StyleMatchDisplay({ playerStats }) {
  const {
    matches,
    playerStyle,
    recommendedCoach,
    loading
  } = useStyleMatch(playerStats);

  if (loading) return <Spinner />;

  return (
    <div>
      <h2>Your Style: {playerStyle}</h2>

      <h3>Most Similar Pros:</h3>
      {matches.map(match => (
        <div key={match.proId}>
          <p>{match.proName} - {match.similarity}% match</p>
        </div>
      ))}

      <h3>Recommended Coach:</h3>
      <p>{recommendedCoach.proName}</p>
      <p>{recommendedCoach.recommendation}</p>
    </div>
  );
}
```

---

## 🔌 API Endpoints

### GET `/api/pro-coach/marketplace`

Liste tous les coaches disponibles.

```typescript
const response = await fetch('/api/pro-coach/marketplace');
const { pros } = await response.json();
```

### POST `/api/pro-coach/purchase`

Acheter un coach (redirige vers Stripe).

```typescript
const response = await fetch('/api/pro-coach/purchase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user_123',
    proId: 'phil-ivey',
    price: 19.99
  })
});

const { url } = await response.json();
window.location.href = url; // Redirection Stripe
```

### POST `/api/pro-coach/analyze-hand`

Analyse une main comme le pro le ferait.

```typescript
const response = await fetch('/api/pro-coach/analyze-hand', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user_123',
    proId: 'phil-ivey',
    handState: {
      position: 'BUTTON',
      holeCards: [{ rank: 'A', suit: 'h' }, { rank: 'K', suit: 'h' }],
      communityCards: [...],
      pot: 50,
      stackSize: 200
    }
  })
});

const { analysis } = await response.json();
// {
//   action: "raise",
//   reasoning: "Aggression puts pressure...",
//   confidence: 0.85
// }
```

### POST `/api/pro-coach/compare`

Compare l'action du joueur vs pro.

```typescript
const response = await fetch('/api/pro-coach/compare', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user_123',
    proId: 'daniel-negreanu',
    handState: {...},
    playerAction: 'call'
  })
});

const { comparison } = await response.json();
// {
//   proAction: "raise",
//   proReasoning: "...",
//   evDifference: -5.4,
//   grade: "D"
// }
```

### GET `/api/pro-coach/learning-path/:userId/:proId`

Génère un learning path personnalisé.

```typescript
const response = await fetch('/api/pro-coach/learning-path/user_123/fedor-holz');
const { learningPath } = await response.json();
// {
//   proName: "Fedor Holz",
//   totalLessons: 5,
//   lessons: [...],
//   estimatedDuration: 40
// }
```

### GET `/api/pro-coach/tips/:proId`

Récupère les tips d'un pro.

```typescript
const response = await fetch('/api/pro-coach/tips/phil-ivey?category=BLUFFING&limit=5');
const { tips } = await response.json();
```

### GET `/api/pro-coach/my-coaches/:userId`

Liste des coaches achetés.

```typescript
const response = await fetch('/api/pro-coach/my-coaches/user_123');
const { coaches } = await response.json();
```

### POST `/api/pro-coach/style-match`

Trouve les pros similaires au joueur.

```typescript
const response = await fetch('/api/pro-coach/style-match', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    stats: {
      vpip: 28,
      pfr: 22,
      aggressionFactor: 2.8,
      threebet: 8.5,
      cbet: 65
    }
  })
});

const { matches, playerStyle, recommendedCoach } = await response.json();
```

---

## 🎮 Exemples d'Intégration

### Exemple 1 : Integration Complète dans le Jeu

```tsx
'use client';

import { useState } from 'react';
import { useProComparison, useMyCoaches } from '@/hooks/useProComparison';
import InGameProComparison from '@/components/InGameProComparison';
import PokerTable from '@/components/PokerTable';

export default function GamePage() {
  const userId = 'user_123'; // TODO: from auth
  const { activeCoach } = useMyCoaches(userId);

  const [currentHand, setCurrentHand] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [lastAction, setLastAction] = useState('');

  const handlePlayerAction = async (action: string, handState: any) => {
    // 1. Envoyer l'action au backend
    const response = await fetch('/api/game/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, handState })
    });

    const { handId, result } = await response.json();

    // 2. Si le joueur a un coach actif, montrer la comparaison
    if (activeCoach && result.completed) {
      setCurrentHand(handId);
      setLastAction(action);
      setShowComparison(true);
    }
  };

  return (
    <div className="min-h-screen bg-poker-green">
      {/* Table de poker */}
      <PokerTable onAction={handlePlayerAction} />

      {/* Coach selector en haut à droite */}
      {activeCoach && (
        <div className="fixed top-4 right-4 bg-white rounded-xl p-4 shadow-xl">
          <p className="text-xs text-gray-500">Active Coach</p>
          <p className="font-bold">{activeCoach.name}</p>
        </div>
      )}

      {/* Comparaison avec le pro */}
      {showComparison && currentHand && (
        <InGameProComparison
          handId={currentHand}
          playerAction={lastAction}
          userId={userId}
          activeProId={activeCoach?.id}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}
```

### Exemple 2 : Navbar avec Lien Pro Stats

```tsx
import Link from 'next/link';
import { useMyCoaches } from '@/hooks/useProComparison';

export default function Navbar() {
  const { coaches } = useMyCoaches('user_123');

  return (
    <nav className="bg-white shadow">
      <div className="flex items-center justify-between p-4">
        <Link href="/">PokerMind</Link>

        <div className="flex space-x-4">
          <Link href="/play">Play</Link>

          <Link href="/pro-marketplace">
            Pro Coaches
            {coaches.length > 0 && (
              <span className="ml-2 bg-poker-gold text-white px-2 py-1 rounded-full text-xs">
                {coaches.length}
              </span>
            )}
          </Link>

          <Link href="/pro-stats">
            My Stats
          </Link>
        </div>
      </div>
    </nav>
  );
}
```

### Exemple 3 : Onboarding avec Recommandation de Coach

```tsx
import { useStyleMatch, usePlayerStats } from '@/hooks/useProComparison';

export default function OnboardingPage() {
  const { stats } = usePlayerStats('user_123');
  const { recommendedCoach, playerStyle } = useStyleMatch(stats);

  if (!stats) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to PokerMind!</h1>

      <div className="bg-white rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Playing Style</h2>
        <p className="text-3xl font-bold text-poker-gold">{playerStyle}</p>
      </div>

      {recommendedCoach && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Recommended Coach</h2>
          <p className="text-2xl font-bold mb-4">{recommendedCoach.proName}</p>
          <p className="mb-4">{recommendedCoach.recommendation}</p>

          <Link
            href={`/pro-marketplace?pro=${recommendedCoach.proId}`}
            className="inline-block bg-white text-purple-600 font-bold py-3 px-6 rounded-xl"
          >
            Unlock This Coach
          </Link>
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 Quick Start Checklist

### Backend Setup

- [ ] Variables d'environnement configurées (`.env`)
- [ ] Database schema pushed (`npm run db:push`)
- [ ] Pros seeded (`npm run seed:pros`)
- [ ] API routes montées dans `apps/api/src/index.ts`
- [ ] Stripe webhooks configurés

### Frontend Setup

- [ ] Package `@pokermind/pro-knowledge` buildé
- [ ] Hooks importés dans les composants
- [ ] Marketplace page accessible (`/pro-marketplace`)
- [ ] Stats page accessible (`/pro-stats`)
- [ ] InGameProComparison intégré dans le jeu

### Test du Flow

- [ ] Acheter un coach via le marketplace
- [ ] Vérifier l'achat dans la database
- [ ] Jouer une main et voir la comparaison
- [ ] Voir ses stats vs le pro dans `/pro-stats`
- [ ] Vérifier le style matching

---

## 📚 Ressources

- [Documentation Pro Knowledge](./PRO_KNOWLEDGE.md)
- [API Reference](./API_REFERENCE.md)
- [Stripe Checkout Guide](https://stripe.com/docs/payments/checkout)
- [OpenAI API](https://platform.openai.com/docs)

---

## 🐛 Troubleshooting

### Erreur: "Pro coach not purchased"

**Cause** : L'utilisateur n'a pas acheté le coach.

**Solution** :
```typescript
const { hasCoach } = useMyCoaches('user_123');

if (!hasCoach('phil-ivey')) {
  // Rediriger vers marketplace
  router.push('/pro-marketplace');
}
```

### Erreur: "OpenAI API key not configured"

**Cause** : Variable d'environnement manquante.

**Solution** : Ajouter `OPENAI_API_KEY` dans `.env`

### Les comparaisons ne s'affichent pas

**Vérifier** :
1. Le joueur a-t-il un coach actif ?
2. La comparaison est-elle bloquée par `minEvDifference` ?
3. L'API retourne-t-elle une erreur ?

```typescript
const { error, comparison } = useProComparison({...});

console.log('Error:', error);
console.log('Comparison:', comparison);
```

---

**Prêt à transformer PokerMind en la plateforme #1 pour apprendre avec les pros ! 🏆🎰**
