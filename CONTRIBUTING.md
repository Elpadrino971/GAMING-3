# Guide de Contribution PokerMind

Merci de votre intérêt pour contribuer à PokerMind !

## Code of Conduct

Soyez respectueux, inclusif et professionnel dans toutes vos interactions.

## Comment Contribuer

### 1. Fork et Clone

```bash
# Fork le repo sur GitHub
# Puis clone votre fork
git clone https://github.com/votre-username/pokermind.git
cd pokermind
```

### 2. Installation

```bash
npm install
```

### 3. Créer une Branche

```bash
git checkout -b feature/ma-nouvelle-feature
# ou
git checkout -b fix/mon-bug-fix
```

### 4. Développement

- Suivez les conventions de code TypeScript
- Écrivez des tests pour les nouvelles fonctionnalités
- Documentez votre code
- Commitez régulièrement avec des messages clairs

### 5. Tests

```bash
# Lancer les tests
npm run test

# Linter
npm run lint
```

### 6. Pull Request

1. Push votre branche
2. Créez une Pull Request sur GitHub
3. Décrivez vos changements
4. Attendez la review

## Conventions de Code

### TypeScript

- Utilisez TypeScript strict
- Typage explicite pour les fonctions publiques
- Interfaces pour les objets complexes
- Évitez `any`, préférez `unknown`

### Commits

Format: `<type>(<scope>): <subject>`

Types:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

Exemples:
```
feat(coach): ajouter mode vocal
fix(gto): corriger calcul d'équité
docs(api): documenter endpoint /stats
```

### Code Style

```typescript
// ✅ Bon
export function calculateEquity(state: HandState): number {
  const equity = performCalculation(state);
  return Math.min(Math.max(equity, 0), 1);
}

// ❌ Mauvais
export function calculateEquity(state) {
  var equity = performCalculation(state)
  if (equity > 1) equity = 1
  if (equity < 0) equity = 0
  return equity
}
```

## Domaines de Contribution

### 🎨 Frontend
- Nouveaux composants UI
- Amélioration UX
- Animations
- Responsive design

### ⚙️ Backend
- Nouvelles routes API
- Optimisations performance
- Sécurité
- Tests

### 🤖 IA
- Amélioration algorithmes GTO
- Nouveaux modèles d'analyse
- Optimisation calculs
- Nouveaux modes de coaching

### 📊 Features
- Coach Battle améliorations
- Shadow Play features
- Nouveaux modes de jeu
- Système de replay

### 📝 Documentation
- Guides utilisateurs
- Tutoriels
- API documentation
- Architecture docs

## Questions ?

- Ouvrez une Issue pour discuter
- Contactez l'équipe
- Consultez la documentation

Merci de contribuer à PokerMind ! 🎰♠️
