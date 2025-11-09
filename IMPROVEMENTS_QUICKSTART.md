# 🚀 Guide de Démarrage Rapide - Nouvelles Fonctionnalités

## Nouvelles Features Ajoutées

1. ⚡ **Moteur de Poker Réel** (Monte Carlo)
2. 🔍 **Pattern Detector** (Détection de leaks)
3. 🎤 **Voice Coach** (TTS vocal)
4. 📹 **Video Replay Generator** (Vidéos auto-générées)
5. 🎓 **Onboarding Tutorial** (Guidé interactif)
6. 💳 **Stripe Integration** (Paiements)
7. 🏆 **Gamification** (Achievements)

---

## Installation & Configuration

### 1. Installer les Dépendances

```bash
npm install
```

### 2. Variables d'Environnement

Ajouter dans `.env`:

```env
# Existant
OPENAI_API_KEY="sk-..."
DATABASE_URL="postgresql://..."

# Nouveau - Voice Coach
ELEVENLABS_API_KEY="your-elevenlabs-key" # Optionnel (meilleure qualité)

# Nouveau - Stripe
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_PRO="price_xxx" # ID du prix Pro (9.99€)
STRIPE_PRICE_PREMIUM="price_xxx" # ID du prix Premium (19.99€)

# FFmpeg (pour vidéos)
FFMPEG_PATH="/usr/bin/ffmpeg" # Chemin vers FFmpeg
```

---

## Utilisation des Nouvelles Features

### ⚡ Poker Engine (Monte Carlo)

```typescript
import { EquityCalculator } from '@pokermind/poker-engine';

const calculator = new EquityCalculator();

// Calcul d'équité précis
const result = await calculator.calculateEquity(
  [{ rank: 'A', suit: 'h' }, { rank: 'K', suit: 'h' }], // Vos cartes
  [{ rank: 'Q', suit: 'd' }, { rank: 'J', suit: 'c' }, { rank: 'T', suit: 's' }], // Board
  2, // 2 adversaires
  10000 // 10k simulations
);

console.log(`Équité: ${(result.equity * 100).toFixed(1)}%`);
// Sortie: "Équité: 64.3%" (ultra précis)

// Calcul rapide (1000 itérations) pour temps réel
const quickEquity = calculator.calculateQuickEquity(holeCards, board, 2);

// Calcul pre-flop (instantané)
const preFlopEquity = calculator.calculatePreFlopEquity(holeCards, 2);

// Détection d'outs
const outs = calculator.calculateOuts(holeCards, board);
console.log(`${outs.outs} outs pour améliorer`);
```

---

### 🔍 Pattern Detector

```typescript
import { PatternDetector } from '@pokermind/ai-engine';

const detector = new PatternDetector();

// Analyser l'historique (min 20 mains)
const leaks = detector.detectLeaks(hands);

leaks.forEach(leak => {
  console.log(`
❌ ${leak.type}
Sévérité: ${leak.severity}
Fréquence: ${(leak.frequency * 100).toFixed(1)}%
EV Loss: ${leak.evLoss.toFixed(1)} BB/100
Solution: ${leak.solution}
  `);
});

// Exemple de sortie:
// ❌ OVER_FOLDING_TO_RAISES
// Sévérité: CRITICAL
// Fréquence: 78.5%
// EV Loss: 64.0 BB/100
// Solution: Défends plus avec des mains moyennes en position
```

**Leaks Détectés** : 15+ types (VPIP, PFR, C-Bet, Tilt, Sizing, etc.)

---

### 🎤 Voice Coach

```typescript
import { VoiceCoach } from '../services/voice-coach';

const voiceCoach = new VoiceCoach(
  process.env.OPENAI_API_KEY,
  process.env.ELEVENLABS_API_KEY // Optionnel
);

// Message de bienvenue
const welcomeAudio = await voiceCoach.speakSessionStart(
  'Pierre',
  'Pro',
  { personality: 'aggressive', speed: 1.0, language: 'fr' }
);
// Jouer: "Yo Pierre ! C'est parti en mode Pro ! On va tout déchirer !"

// Conseil de main
const adviceAudio = await voiceCoach.generateHandAdviceVoice(
  handAnalysis,
  { personality: 'pro', speed: 1.0, language: 'fr' }
);

// Alerte de tilt
const tiltAudio = await voiceCoach.speakTiltAlert({
  personality: 'calm',
  speed: 0.9,
  language: 'fr'
});
// Jouer: "Stop ! Je détecte du tilt. Prends une pause de 10 minutes."

// Dans le frontend (React)
const audioContext = new AudioContext();
const audioBuffer = await audioContext.decodeAudioData(audioData.buffer);
const source = audioContext.createBufferSource();
source.buffer = audioBuffer;
source.connect(audioContext.destination);
source.start();
```

**Personnalités** : calm, aggressive, pro, funny
**Langues** : fr, en

---

### 📹 Video Replay Generator

```typescript
import { VideoGenerator } from '@pokermind/replay-engine';

const generator = new VideoGenerator('/tmp/replays');

// Générer une vidéo de session (top 10 mains)
const sessionVideo = await generator.generateSessionReplay(session, {
  resolution: '1080p',
  fps: 30,
  format: 'mp4',
  style: 'pro'
});

// Générer un clip court (30s) pour TikTok
const shortClip = await generator.generateShortClip(hand, analysis, {
  resolution: '1080p',
  fps: 60,
  format: 'mp4',
  style: 'flashy'
});

console.log(`Vidéo générée: ${shortClip}`);
// Upload sur TikTok/Instagram/YouTube

// Nettoyer les fichiers temp
generator.cleanup();
```

**Formats** : 720p, 1080p, 4K
**Styles** : minimal, pro, flashy

---

### 🎓 Onboarding Tutorial

```tsx
// Dans votre page principale
import OnboardingTutorial from '@/components/OnboardingTutorial';

export default function GamePage() {
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem('pokermind_tutorial_completed');
    if (completed) setShowTutorial(false);
  }, []);

  return (
    <div>
      {showTutorial && (
        <OnboardingTutorial onComplete={() => setShowTutorial(false)} />
      )}

      {/* Votre UI normale */}
      <PokerTable />
      <CoachOverlay />
      <StatsPanel />
    </div>
  );
}
```

**Étapes** : 7 steps guidés
**Sauvegarde** : LocalStorage automatique

---

### 💳 Stripe Payments

```typescript
// Créer une session de checkout
const response = await fetch('/api/subscription/create-checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user_123',
    tier: 'PRO' // ou 'PREMIUM'
  })
});

const { url } = await response.json();

// Rediriger vers Stripe Checkout
window.location.href = url;

// Après paiement, l'utilisateur revient sur /success
// Webhook Stripe crée automatiquement l'abonnement dans la DB

// Vérifier le statut
const status = await fetch(`/api/subscription/status/${userId}`);
const { tier, status } = await status.json();

console.log(`Tier: ${tier}, Status: ${status}`);
// Sortie: "Tier: PRO, Status: ACTIVE"
```

**Configuration Stripe**:
1. Créer les produits dans Stripe Dashboard
2. Copier les Price IDs
3. Configurer le webhook endpoint : `/api/subscription/webhook`
4. Copier le webhook secret

---

### 🏆 Gamification (Achievements)

```tsx
import AchievementNotification from '@/components/AchievementNotification';

// Quand un achievement est débloqué
const [achievement, setAchievement] = useState(null);

useEffect(() => {
  // Écouter les achievements du backend
  socket.on('achievement:unlocked', (data) => {
    setAchievement(data);

    // Auto-hide après 5 secondes
    setTimeout(() => setAchievement(null), 5000);
  });
}, []);

return (
  <>
    {achievement && (
      <AchievementNotification
        achievement={achievement}
        onClose={() => setAchievement(null)}
      />
    )}
  </>
);
```

**Backend** (déclencher un achievement):

```typescript
// Après avoir joué 100 mains
if (userStats.totalHands === 100) {
  await prisma.achievement.create({
    data: {
      userId: user.id,
      type: 'HANDS_PLAYED',
      name: 'Century',
      description: '100 mains jouées !',
      icon: '🏅',
      progress: 100,
      target: 100,
      completed: true
    }
  });

  // Envoyer au frontend
  io.to(userId).emit('achievement:unlocked', achievement);
}
```

---

## Tests Rapides

### Tester le Poker Engine

```bash
cd packages/poker-engine
npm run build
node -e "
const { EquityCalculator } = require('./dist');
const calc = new EquityCalculator();
calc.calculateEquity(
  [{rank:'A',suit:'h'},{rank:'K',suit:'h'}],
  [{rank:'Q',suit:'d'},{rank:'J',suit:'c'},{rank:'T',suit:'s'}],
  2,
  1000
).then(r => console.log('Equity:', r.equity));
"
```

### Tester le Voice Coach

```bash
cd apps/api
npm run dev

# Dans un autre terminal
curl -X POST http://localhost:8080/api/coach/speak \
  -H "Content-Type: application/json" \
  -d '{"text":"Test vocal","personality":"pro"}' \
  --output test.mp3

# Écouter le fichier
mpg123 test.mp3
```

---

## Troubleshooting

### Voice Coach ne fonctionne pas

- Vérifier que `OPENAI_API_KEY` est configuré
- Pour ElevenLabs, vérifier `ELEVENLABS_API_KEY`
- Tester avec OpenAI d'abord (plus simple)

### Video Generator erreurs

- Installer FFmpeg: `sudo apt install ffmpeg`
- Vérifier le chemin: `which ffmpeg`
- Configurer `FFMPEG_PATH` dans `.env`

### Stripe webhooks ne marchent pas

- En local, utiliser Stripe CLI:
  ```bash
  stripe listen --forward-to localhost:8080/api/subscription/webhook
  ```
- Copier le webhook secret
- Tester avec `stripe trigger checkout.session.completed`

---

## Performance Tips

### Equity Calculator

- **Temps réel** : 1000 itérations (< 100ms)
- **Analyse post-main** : 10,000 itérations (< 1s)
- **Pre-flop** : Table lookup (< 1ms)

### Voice Coach

- **OpenAI TTS** : ~500ms par message
- **ElevenLabs** : ~1.5s par message (mais meilleure qualité)
- Cache les messages fréquents

### Video Generator

- **Résolution** : 720p pour tests, 1080p pour prod
- **FPS** : 30 pour clips normaux, 60 pour slow-motion
- Process en background (worker threads)

---

## Documentation Complète

- 📖 [README.md](./README.md) - Vue d'ensemble
- 🏗️ [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Architecture détaillée
- 📡 [API.md](./docs/API.md) - API Reference
- 🚀 [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Guide de déploiement
- ✨ [IMPROVEMENTS.md](./docs/IMPROVEMENTS.md) - Détails des améliorations

---

## Support

Des questions ? Consultez la doc ou ouvrez une issue !

**Bon développement !** 🚀🎰
