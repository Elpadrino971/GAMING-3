# 🚀 Démarrage Rapide PokerMind

## Installation en 5 minutes

### 1. Prérequis
- Node.js 18+ installé
- PostgreSQL installé et démarré
- Clé API OpenAI

### 2. Installation

```bash
# Clone le repo
git clone <your-repo>
cd pokermind

# Installation
npm install
```

### 3. Configuration

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env et ajouter vos clés
nano .env
```

Variables minimales requises:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pokermind"
OPENAI_API_KEY="sk-your-key"
NEXTAUTH_SECRET="generate-a-random-secret"
```

### 4. Base de données

```bash
cd packages/database
npx prisma generate
npx prisma db push
cd ../..
```

### 5. Lancement

```bash
# Terminal 1 - API
cd apps/api
npm run dev

# Terminal 2 - Web
cd apps/web
npm run dev
```

### 6. Accès

- Frontend: http://localhost:3000
- API: http://localhost:8080
- API Health: http://localhost:8080/health

## Premiers Pas

### 1. Créer un compte
- Allez sur http://localhost:3000
- Cliquez sur "Créer un compte gratuit"
- Remplissez le formulaire

### 2. Démarrer une partie
- Choisissez "Commencer à jouer"
- Sélectionnez votre mode de coaching
- Lancez une session

### 3. Essayer les modes

#### Mode Coaching Léger
Parfait pour débuter, conseils simples en temps réel.

#### Mode Analyse Pro
Statistiques avancées, simulation GTO, analyse de range.

#### Mode Mentor Live
Coaching en direct avec overlay, mode vocal.

### 4. Explorer les features

- **Coach Battle**: Affrontez un autre joueur avec vos IA qui débattent
- **Shadow Play**: Jouez les mêmes mains qu'un pro et comparez
- **IDI Ranking**: Consultez le classement basé sur la qualité de décision

## Structure du Projet

```
pokermind/
├── apps/
│   ├── web/          # Frontend Next.js
│   └── api/          # Backend Express
├── packages/
│   ├── database/     # Prisma + PostgreSQL
│   └── ai-engine/    # Moteur IA d'analyse
└── docs/             # Documentation
```

## Commandes Utiles

```bash
# Build tout le projet
npm run build

# Lancer les tests
npm run test

# Linter
npm run lint

# Prisma Studio (GUI database)
npm run db:studio

# Reset database (⚠️ supprime les données)
cd packages/database
npx prisma migrate reset
```

## Fonctionnalités Clés

### 🧠 Analyse IA
- Calcul GTO (Game Theory Optimal)
- Analyse de range
- Détection d'erreurs
- Suggestions personnalisées

### 📊 Statistiques
- VPIP, PFR, Aggression Factor
- C-Bet percentage
- IDI (Indice de Décision Intelligente)
- Progression sur le temps

### 🎮 Modes de Jeu
- Parties normales avec coach
- Coach Battle
- Shadow Play
- Live streaming

### 🎯 Apprentissage
- Plan d'apprentissage personnalisé
- Replay intelligent
- Détection de tilt
- Conseils adaptatifs

## Troubleshooting

### La base de données ne se connecte pas
```bash
# Vérifier que PostgreSQL est démarré
sudo service postgresql status

# Créer la base si nécessaire
createdb pokermind
```

### Les WebSocket ne fonctionnent pas
- Vérifier que l'API est bien lancée sur le port 8080
- Vérifier les CORS dans `apps/api/src/index.ts`

### Erreur OpenAI
- Vérifier que votre clé API est valide
- Vérifier que vous avez des crédits
- Vérifier la variable `OPENAI_API_KEY` dans `.env`

## Support

- 📖 [Documentation complète](./README.md)
- 🏗️ [Architecture](./docs/ARCHITECTURE.md)
- 🚀 [Guide de déploiement](./docs/DEPLOYMENT.md)
- 📡 [API Reference](./docs/API.md)

## Prochaines Étapes

1. Consultez la [documentation complète](./README.md)
2. Explorez le code dans `packages/ai-engine`
3. Essayez d'ajouter une nouvelle feature
4. Contribuez ! Voir [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**PokerMind** - Transformez votre jeu de poker avec l'intelligence artificielle 🎰♠️
