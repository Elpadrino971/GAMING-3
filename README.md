# 🎰 PokerMind - Assistant IA de Poker Révolutionnaire

## 🚀 Vision

PokerMind est un assistant IA de poker intelligent qui combine coaching en temps réel, analyse avancée et parties live interactives pour transformer la façon dont les joueurs apprennent et progressent au poker.

## ✨ Fonctionnalités Principales

### 🎯 Trois Niveaux d'Assistance IA

#### 🥉 Mode Coaching Léger (Débutants)
- Analyse de l'historique de jeu
- Conseils simples et rapides
- Apprentissage progressif adaptatif

#### 🥈 Mode Analyse Pro (Intermédiaires)
- Statistiques avancées (VPIP, PFR, Aggression Factor, C-Bet%)
- Recommandations personnalisées
- Simulation GTO (Game Theory Optimal)

#### 🥇 Mode Mentor Live (Premium)
- Analyse en direct pendant les mains
- IA contextuelle avec overlay discret
- Mode vocal optionnel
- Replay commenté post-session

### 🎮 Modes de Jeu Innovants

#### 🎥 Parties Live Assistées
- Tables de poker live avec IA personnelle
- Conseils privés en temps réel
- Commentaires IA neutres publics

#### 🧠 "Dans la tête d'un pro - Live"
- Streaming de parties de pros
- Commentaires IA en temps réel
- Votes et propositions du public
- Indice de lucidité collective

#### ⚔️ Coach Battle
- Affrontement avec IA coaches visibles
- Débats IA sur les meilleures stratégies
- Notation par les spectateurs

#### 👻 Shadow Play
- Jouer virtuellement les mêmes mains qu'un joueur live
- Comparaison des décisions
- Parfait pour le streaming éducatif

### 📊 Fonctionnalités Game Changer

- **Apprentissage Adaptatif** : L'IA classe et adapte sa pédagogie
- **Analyse Émotionnelle** : Détection du tilt et du stress
- **Simulation de Mains Perdues** : Rejouer avec différentes stratégies
- **Classement IDI** : Indice de Décision Intelligente
- **Replay Intelligent** : Analyse post-session complète

## 🏗️ Architecture Technique

### Stack
- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + WebSocket
- **IA**: OpenAI GPT-4 + Modèle GTO custom
- **Base de données**: PostgreSQL + Prisma ORM
- **Streaming**: WebRTC + Agora
- **Audio/Video**: Whisper (STT) + TTS
- **Cache**: Redis
- **Déploiement**: Vercel + Railway

### Structure du Projet

```
pokermind/
├── apps/
│   ├── web/                 # Application Next.js
│   ├── api/                 # Backend Node.js/Express
│   └── streaming/           # Service de streaming live
├── packages/
│   ├── database/            # Schéma Prisma + migrations
│   ├── ai-engine/           # Moteur d'analyse IA
│   ├── poker-engine/        # Logique de jeu poker
│   ├── ui/                  # Composants UI partagés
│   └── config/              # Configurations partagées
└── docs/                    # Documentation
```

## 🎯 Modèle de Monétisation

| Source | Description | Prix |
|--------|-------------|------|
| **Premium** | Mode Mentor Live + Replay + Analyses | 9.99€/mois |
| **Analyses à la demande** | Débrief complet d'une main/session | 0.99€ |
| **Formation IA-Pro** | Modules interactifs personnalisés | Variable |
| **Coaching Collectif** | IA + Pro en live | 19.99€/session |
| **Tournois Sponsorisés** | Classement IDI | Gratuit |
| **Marketplace Coaches** | Styles d'IA customisés | 4.99€ |

## 🚦 Démarrage Rapide

```bash
# Installation
npm install

# Configuration de la base de données
npm run db:push

# Lancement en développement
npm run dev

# Build production
npm run build

# Lancement production
npm start
```

## 📱 Interfaces

- **Web App**: Application principale (React/Next.js)
- **Mobile App**: Version mobile (React Native - futur)
- **Desktop App**: Overlay pour poker online (Electron - futur)
- **VR Experience**: Expérience immersive (Unity - futur)

## 🎓 Roadmap

### Phase 1 - MVP (3 mois)
- ✅ Mode Coaching Léger
- ✅ Backend de base
- ✅ Intégration IA basique
- ✅ Historique de mains

### Phase 2 - Pro (3 mois)
- Mode Analyse Pro
- Statistiques avancées
- Simulation GTO
- Replay intelligent

### Phase 3 - Live (3 mois)
- Parties Live Assistées
- Streaming intégré
- Coach Battle
- Shadow Play

### Phase 4 - Premium (3 mois)
- Mode Mentor Live
- Analyse émotionnelle
- Mode vocal
- Marketplace

## 🤝 Contributing

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour plus d'informations.

## 📄 Licence

MIT License - voir [LICENSE](LICENSE) pour plus de détails.

## 🌟 Équipe

Créé avec ❤️ par l'équipe PokerMind

---

**PokerMind** - *Transformez votre jeu de poker avec l'intelligence artificielle*
