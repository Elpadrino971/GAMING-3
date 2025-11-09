# 🏆 Pro Knowledge System - Learn from the Best

## Vue d'Ensemble

Le système **Pro Knowledge** permet aux joueurs d'apprendre directement des **meilleurs joueurs du monde** :
- Daniel Negreanu
- Phil Ivey
- Fedor Holz
- Phil Hellmuth
- Vanessa Selbst
- Tom Dwan

Et bien d'autres...

---

## 🎯 Fonctionnalités Principales

### 1. Pro Coaching Styles

Chaque pro a son **IA coach personnalisée** qui :
- Parle exactement comme le pro
- Conseille dans son style unique
- Adapte les conseils à ton niveau

**Exemple** :

```typescript
// Daniel Negreanu style (Friendly & Pedagogique)
"Ta mise est trop élevée pour ta main de départ. Remember : position is everything.
En late position, tu peux te permettre d'élargir ton range, mais pas ici en UTG."

// Phil Ivey style (Concis & Direct)
"Trop passif. Raise ou fold. Call te met dans une mauvaise position."

// Fedor Holz style (Analytique & GTO)
"D'un point de vue GTO, cette ligne est -EV. Ton ratio bluff/value est déséquilibré.
Travaille ton mindset, la décision technique viendra naturellement."
```

### 2. "Pro vs You" Comparison

Après chaque main, **compare ta décision** avec ce qu'un pro aurait fait.

**Interface** :

```
┌─────────────────────────────────────┐
│ 🏆 Pro Comparison                   │
│ vs Phil Ivey "The Tiger Woods"     │
│                                 A   │
├─────────────────────────────────────┤
│ Your Action         Pro Action      │
│ ┌─────────┐        ┌─────────┐     │
│ │  Call   │        │  Raise  │     │
│ └─────────┘        └─────────┘     │
├─────────────────────────────────────┤
│ 📉 -7.2 BB difference               │
├─────────────────────────────────────┤
│ 💭 Phil's Analysis:                 │
│ "You can't win by checking and      │
│  calling. Aggression puts pressure  │
│  on opponents. I'd rather bet and   │
│  fold than check and call."         │
└─────────────────────────────────────┘
```

### 3. Marketplace de Coaches

Achète l'accès **à vie** à un coach pro pour :
- **12.99€ - 19.99€** selon le pro
- Coaching illimité dans leur style
- Comparaisons de mains
- Learning path personnalisé

**Pros Disponibles** :

| Pro | Style | Price | Specialty |
|-----|-------|-------|-----------|
| **Daniel Negreanu** | TAG | 14.99€ | Reading players |
| **Phil Ivey** ⭐ | LAG | 19.99€ | Cash game legend |
| **Fedor Holz** | GTO | 17.99€ | Modern theory |
| **Phil Hellmuth** | Exploitative | 12.99€ | Tournament master |
| **Vanessa Selbst** | Ultra-Aggressive | 13.99€ | Fearless play |
| **Tom Dwan** | Maniac | 16.99€ | Creative bluffing |

### 4. Learning Paths by Pros

Chaque pro génère un **plan d'apprentissage personnalisé** basé sur :
- Tes stats actuelles
- Ton style de jeu
- Tes faiblesses

**Exemple - Fedor Holz Learning Path** :

```markdown
🎯 Plan pour jouer comme Fedor Holz (30 jours)

## Étape 1 : GTO Foundation (Semaine 1)
- Étudie les ranges pré-calculées
- Apprends les bases de l'équilibre
- Quiz : 10 situations GTO

## Étape 2 : Mental Game (Semaine 2)
- Méditation quotidienne (10 min)
- Tracking émotionnel
- Gestion du tilt

## Étape 3 : ICM Mastery (Semaine 3)
- Comprendre la pression ICM
- Situations de bulle
- Quiz : 15 spots ICM

## Étape 4 : Advanced Play (Semaine 4)
- Multi-street planning
- Exploits basés sur GTO
- Hand reviews quotidiennes

## Étape 5 : Performance (Ongoing)
- Track ton IDI
- Compare avec mes stats
- Ajustements continus
```

### 5. Base de Données de Conseils

**60+ conseils** des meilleurs pros, catégorisés :

**Catégories** :
- Pre-Flop Strategy
- Post-Flop Play
- Bluffing Techniques
- Value Betting
- Position Play
- Range Reading
- Bankroll Management
- Tournament Strategy
- Cash Game Strategy
- Mental Game
- Physical Tells
- ICM

**Exemple de conseils** :

```json
{
  "proName": "Daniel Negreanu",
  "tip": {
    "title": "Position is Everything",
    "content": "Always remember: position gives you more information. In late position, you can see what everyone does before you act. This is HUGE. I play almost 2x more hands on the button than under the gun.",
    "category": "POSITION",
    "situation": "General poker strategy",
    "source": "MasterClass",
    "difficulty": 2
  }
}
```

---

## 📊 Données des Pros

### Daniel Negreanu - "Kid Poker"

**Stats** :
- Winnings: $46.1M
- WSOP Bracelets: 6
- Style: Tight-Aggressive
- VPIP: 28% | PFR: 22% | Aggression: 2.8

**Spécialités** :
- Reading players
- Position play
- Tournament strategy

**Conseils Signature** :
- "Position is everything"
- "Read players, not cards"
- "Small ball poker"

### Phil Ivey - "The Tiger Woods of Poker"

**Stats** :
- Winnings: $30.1M
- WSOP Bracelets: 10 (record actif)
- Style: Loose-Aggressive
- VPIP: 32% | PFR: 26% | Aggression: 3.5

**Spécialités** :
- Cash games
- High stakes
- Fearless aggression

**Conseils Signature** :
- "Aggressive = Winning"
- "Trust your read"
- "Play the player"

### Fedor Holz - "CrownUpGuy"

**Stats** :
- Winnings: $36.3M
- WSOP Bracelets: 1
- Style: GTO Balanced
- VPIP: 26% | PFR: 20% | Aggression: 2.5

**Spécialités** :
- Modern GTO
- Mental game
- High rollers

**Conseils Signature** :
- "GTO foundation"
- "Mental game > Technical"
- "ICM mastery"

*(Et 3 autres pros...)*

---

## 🛠️ Utilisation Technique

### Installer le Package

```bash
cd packages/pro-knowledge
npm install
```

### Utiliser le Pro Coach

```typescript
import { ProCoach } from '@pokermind/pro-knowledge';

// Créer un coach Phil Ivey
const iveyCoach = new ProCoach(
  process.env.OPENAI_API_KEY,
  'phil-ivey'
);

// Analyser une main
const analysis = await iveyCoach.analyzeHandAsPro({
  position: 'BUTTON',
  holeCards: [{ rank: 'A', suit: 'h' }, { rank: 'K', suit: 'h' }],
  communityCards: [{ rank: 'Q', suit: 'd' }, { rank: 'J', suit: 'c' }, { rank: 'T', suit: 's' }],
  pot: 50,
  stackSize: 200,
  numPlayers: 3
});

console.log(analysis);
// {
//   action: "raise",
//   reasoning: "You can't win by checking. Aggression puts pressure...",
//   confidence: 0.8
// }

// Comparer avec le joueur
const comparison = await iveyCoach.compareWithPro(handState, 'call');

console.log(comparison);
// {
//   proAction: "raise",
//   proReasoning: "...",
//   comparison: "...",
//   evDifference: -7.2,
//   grade: "C"
// }
```

### Accéder aux Conseils

```typescript
import { getAllTips, getTipsByCategory } from '@pokermind/pro-knowledge';

// Tous les conseils
const allTips = getAllTips();

// Par catégorie
const bluffingTips = getTipsByCategory('BLUFFING');

// Par situation
const preFlopTips = getTipsBySituation('pre-flop');
```

---

## 🎨 Interface Frontend

### Marketplace Page

```tsx
import ProMarketplacePage from '@/app/pro-marketplace/page';

// Affiche tous les coaches disponibles
// Grid cards avec photo, stats, prix
// Bouton "Unlock" pour acheter
```

### Pro Comparison Component

```tsx
import ProComparison from '@/components/ProComparison';

<ProComparison
  handId="hand_123"
  playerAction="call"
  proAction="raise"
  proName="Phil Ivey"
  proNickname="The Tiger Woods of Poker"
  reasoning="Aggression is key..."
  evDifference={-7.2}
  grade="C"
/>
```

---

## 💰 Monétisation

### Modèle de Prix

**One-time purchase, lifetime access** :
- Beginner-friendly pros : 12.99€
- Intermediate pros : 14.99€
- Advanced/Legend pros : 19.99€

### Bundles (Futur)

- **Tournament Pack** : Negreanu + Hellmuth (24.99€)
- **Cash Game Pack** : Ivey + Dwan (34.99€)
- **All-Stars** : Tous les pros (79.99€)

### Revenue Splits

- PokerMind : 70%
- Pro (si partenariat) : 30%

---

## 📈 Métriques de Succès

### Objectifs

- **Conversion Rate** : 15% des utilisateurs achètent au moins 1 pro
- **Average Revenue per User** : 25€
- **Most Popular** : Phil Ivey (prédit)

### Tracking

```typescript
// Events à tracker
- 'pro_marketplace_visit'
- 'pro_card_click'
- 'pro_purchase_initiated'
- 'pro_purchase_completed'
- 'pro_comparison_viewed'
- 'learning_path_started'
```

---

## 🚀 Évolutions Futures

### Phase 2

1. **Vidéos de Pros** : Clips de hands commentées
2. **Live Q&A** : Sessions en direct avec l'IA du pro
3. **Pro Tournaments** : Tournois avec coaching live
4. **Certifications** : "Certified by Daniel Negreanu"

### Phase 3

1. **Partenariats Réels** : Collaboration avec de vrais pros
2. **Custom Pro Styles** : Créer ton propre style et le vendre
3. **Pro Challenges** : "Beat Phil Ivey on 100 hands"

---

## 🏗️ Architecture Technique

```
packages/pro-knowledge/
├── src/
│   ├── pro-data.ts              # Database des pros
│   ├── pro-coach.ts             # Coach IA par pro
│   ├── pro-matcher.ts           # Matching style de jeu
│   └── knowledge-extractor.ts   # Extraction de conseils
```

**Base de Données** :
- `ProPlayer` : Infos des pros
- `ProTip` : Conseils catégorisés
- `ProStrategy` : Stratégies complètes
- `ProVideo` : Vidéos et transcriptions
- `ProPurchase` : Achats utilisateurs

---

## 🎯 Quick Start

### 1. Seed la Database

```bash
npx prisma db push
npm run seed:pros
```

### 2. Lancer l'API

```bash
cd apps/api
npm run dev
```

### 3. Tester le Marketplace

```bash
cd apps/web
npm run dev
# Visit http://localhost:3000/pro-marketplace
```

### 4. Acheter un Coach

- Cliquer sur "Unlock" pour un pro
- Payer via Stripe (test mode)
- Redirection vers success page
- Coach disponible immédiatement

### 5. Comparer une Main

```bash
curl -X POST http://localhost:8080/api/pro-coach/compare \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "proId": "phil-ivey",
    "handState": {...},
    "playerAction": "call"
  }'
```

---

## ✨ Pourquoi c'est Révolutionnaire

1. **Jamais vu ailleurs** : Aucune app de poker n'a ça
2. **Value proposition claire** : Apprends des meilleurs
3. **Monétisation forte** : 15-20€ par pro
4. **Viral** : "J'apprends avec Phil Ivey"
5. **Scalable** : Ajouter des pros facilement

**PokerMind devient la seule plateforme où tu peux apprendre EXACTEMENT comme un pro jouerait.**

---

Prêt à devenir une légende ? 🏆🎰
