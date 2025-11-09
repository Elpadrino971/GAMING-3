# 🏆 @pokermind/pro-knowledge

Package pour intégrer la connaissance des meilleurs joueurs de poker du monde dans PokerMind.

## Features

- 🎯 **ProMatcher**: Match le style du joueur avec des pros similaires
- 🤖 **ProCoach**: IA qui imite le coaching des pros avec GPT-4
- 📚 **KnowledgeExtractor**: Extrait des conseils depuis diverses sources
- 💾 **Pro Database**: 6 légendes du poker avec stats vérifiées

## Installation

```bash
npm install @pokermind/pro-knowledge
```

## Quick Start

### 1. ProCoach - IA qui imite un pro

```typescript
import { ProCoach } from '@pokermind/pro-knowledge';

const iveyCoach = new ProCoach(process.env.OPENAI_API_KEY, 'phil-ivey');

// Analyser une main comme Phil Ivey
const analysis = await iveyCoach.analyzeHandAsPro({
  position: 'BUTTON',
  holeCards: [{ rank: 'A', suit: 'h' }, { rank: 'K', suit: 'h' }],
  communityCards: [...],
  pot: 50,
  stackSize: 200
});

console.log(analysis);
// {
//   action: "raise",
//   reasoning: "Aggression puts pressure on opponents...",
//   confidence: 0.85
// }

// Comparer avec le joueur
const comparison = await iveyCoach.compareWithPro(handState, 'call');
console.log(comparison);
// {
//   proAction: "raise",
//   evDifference: -7.2,
//   grade: "C"
// }
```

### 2. ProMatcher - Trouver des pros similaires

```typescript
import { ProMatcher } from '@pokermind/pro-knowledge';

const matcher = new ProMatcher();

const playerStats = {
  vpip: 28,
  pfr: 22,
  aggressionFactor: 2.8,
  threebet: 8.5,
  cbet: 65
};

// Trouver les 3 pros les plus similaires
const matches = matcher.findSimilarPros(playerStats, 3);

matches.forEach(match => {
  console.log(`${match.proName}: ${match.similarity}% similar`);
  console.log(`Matching: ${match.matchingTraits.join(', ')}`);
  console.log(`Differences: ${match.differences.join(', ')}`);
});

// Recommander un coach pour amélioration
const recommended = matcher.recommendCoachForImprovement(playerStats);
console.log(recommended.recommendation);

// Déterminer le style du joueur
const style = matcher.getPlayerStyle(playerStats);
console.log(`Your style: ${style}`);
// "Tight-Aggressive (TAG)"
```

### 3. KnowledgeExtractor - Extraire des conseils

```typescript
import { KnowledgeExtractor } from '@pokermind/pro-knowledge';

const extractor = new KnowledgeExtractor(process.env.OPENAI_API_KEY);

// Extraire depuis une vidéo YouTube
const tips = await extractor.extractFromYouTubeTranscript(
  transcript,
  'Daniel Negreanu Masterclass',
  'Daniel Negreanu'
);

// Générer des tips synthétiques dans le style du pro
const syntheticTips = await extractor.generateSyntheticTips(
  'Phil Ivey',
  'Loose-Aggressive',
  ['Cash games', 'Aggression'],
  existingTips,
  5
);

// Filtrer pour ne garder que les meilleurs
const highQuality = extractor.filterHighQualityTips(tips);
```

### 4. Pro Database

```typescript
import { PRO_PLAYERS_DATABASE } from '@pokermind/pro-knowledge';

// Tous les pros
console.log(PRO_PLAYERS_DATABASE);

// Trouver un pro spécifique
const ivey = PRO_PLAYERS_DATABASE.find(p => p.id === 'phil-ivey');

console.log(ivey.name); // "Phil Ivey"
console.log(ivey.stats); // { vpipAvg: 32, pfrAvg: 26, ... }
console.log(ivey.tips); // Array of tips
```

## Available Pros

| Pro | Style | Winnings | Bracelets | Specialty |
|-----|-------|----------|-----------|-----------|
| **Daniel Negreanu** | TAG | $46.1M | 6 | Reading players |
| **Phil Ivey** | LAG | $30.1M | 10 | Cash games |
| **Fedor Holz** | GTO | $36.3M | 1 | Modern theory |
| **Phil Hellmuth** | Exploitative | $28.3M | 16 | Tournaments |
| **Vanessa Selbst** | Ultra-Aggressive | $11.9M | 3 | Fearless play |
| **Tom Dwan** | Maniac | ~$10M+ | 0 | Creative bluffing |

## API Reference

### ProCoach

#### `constructor(apiKey: string, proId: string)`

Créer un coach pour un pro spécifique.

#### `async analyzeHandAsPro(handState: any): Promise<Analysis>`

Analyse une main comme le pro le ferait.

**Returns**:
```typescript
{
  action: string;          // "raise", "call", "fold"
  reasoning: string;       // Explication détaillée
  confidence: number;      // 0-1
}
```

#### `async compareWithPro(handState: any, playerAction: string): Promise<Comparison>`

Compare l'action du joueur avec celle du pro.

**Returns**:
```typescript
{
  proAction: string;       // Action recommandée par le pro
  proReasoning: string;    // Pourquoi le pro ferait ça
  comparison: string;      // Comparaison détaillée
  evDifference: number;    // Différence en Big Blinds
  grade: string;           // A, B, C, D, F
}
```

#### `async generateLearningPath(userStats: any): Promise<LearningPath>`

Génère un plan d'apprentissage personnalisé.

### ProMatcher

#### `findSimilarPros(stats: PlayerStats, topN: number): ProMatch[]`

Trouve les N pros les plus similaires au joueur.

#### `recommendCoachForImprovement(stats: PlayerStats): ProMatch`

Recommande le meilleur coach pour améliorer le joueur.

#### `getPlayerStyle(stats: PlayerStats): string`

Détermine le style de jeu du joueur.

**Possible styles**:
- Tight-Aggressive (TAG)
- Loose-Aggressive (LAG)
- Nit (Too Tight)
- Calling Station (Too Passive)
- Maniac (Too Loose & Aggressive)
- Loose-Passive (LAP)
- Balanced/Mixed Style

### KnowledgeExtractor

#### `async extractTips(source: KnowledgeSource, proName: string): Promise<ExtractedTip[]>`

Extrait des conseils depuis une source.

#### `async generateSyntheticTips(...): Promise<ExtractedTip[]>`

Génère des conseils dans le style du pro.

#### `filterHighQualityTips(tips: ExtractedTip[]): ExtractedTip[]`

Filtre pour ne garder que les meilleurs conseils.

## Types

```typescript
interface PlayerStats {
  vpip: number;
  pfr: number;
  aggressionFactor: number;
  threebet?: number;
  cbet?: number;
  handsPlayed?: number;
  winRate?: number;
}

interface ProMatch {
  proId: string;
  proName: string;
  similarity: number; // 0-100
  matchingTraits: string[];
  differences: string[];
  recommendation: string;
}

interface ExtractedTip {
  title: string;
  content: string;
  category: string;
  situation: string;
  difficulty: number; // 1-5
  source: string;
  confidence: number; // 0-1
}
```

## Environment Variables

```env
OPENAI_API_KEY=sk-...
```

## Examples

### Complete Integration

```typescript
import { ProCoach, ProMatcher } from '@pokermind/pro-knowledge';

// 1. Matcher: Trouver le meilleur coach
const matcher = new ProMatcher();
const recommended = matcher.recommendCoachForImprovement(playerStats);

console.log(`Best coach for you: ${recommended.proName}`);

// 2. Coach: Analyser une main
const coach = new ProCoach(apiKey, recommended.proId);
const analysis = await coach.analyzeHandAsPro(currentHand);

console.log(`${recommended.proName} says: ${analysis.reasoning}`);

// 3. Compare: Voir la différence
const comparison = await coach.compareWithPro(currentHand, 'call');

if (comparison.grade === 'A') {
  console.log('Excellent play! 🏆');
} else {
  console.log(`Could be better. ${comparison.proReasoning}`);
}
```

## License

MIT

## Documentation

- [Complete Guide](../../docs/PRO_KNOWLEDGE.md)
- [Integration Guide](../../docs/PRO_KNOWLEDGE_INTEGRATION.md)
