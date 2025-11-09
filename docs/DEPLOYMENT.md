# Guide de Déploiement PokerMind

## Prérequis

- Node.js 18+ et npm 9+
- PostgreSQL 14+
- Redis 7+
- Compte OpenAI avec clé API
- (Optionnel) Compte Agora pour le streaming

## Installation Locale

### 1. Clone et installation des dépendances

```bash
git clone <votre-repo>
cd pokermind
npm install
```

### 2. Configuration de l'environnement

Copiez `.env.example` vers `.env` et configurez les variables:

```bash
cp .env.example .env
```

Éditez `.env` avec vos valeurs:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pokermind?schema=public"

# OpenAI
OPENAI_API_KEY="sk-..."

# Authentication
NEXTAUTH_SECRET="votre-secret-genere"
NEXTAUTH_URL="http://localhost:3000"

# Redis
REDIS_URL="redis://localhost:6379"

# API
PORT=8080
NODE_ENV="development"
```

### 3. Configuration de la base de données

```bash
# Générer le client Prisma
cd packages/database
npx prisma generate

# Créer la base de données
npx prisma db push

# (Optionnel) Seed avec des données de test
npx prisma db seed
```

### 4. Build des packages

```bash
# Retour à la racine
cd ../..

# Build de tous les packages
npm run build
```

### 5. Lancement en développement

```bash
# Terminal 1 - API Backend
cd apps/api
npm run dev

# Terminal 2 - Web Frontend
cd apps/web
npm run dev
```

L'application sera accessible sur:
- Frontend: http://localhost:3000
- API: http://localhost:8080
- WebSocket: ws://localhost:8080

## Déploiement Production

### Option 1: Vercel + Railway (Recommandé)

#### Frontend (Vercel)

1. Push votre code sur GitHub
2. Connectez votre repo à Vercel
3. Configuration:
   - Framework Preset: Next.js
   - Root Directory: apps/web
   - Build Command: `cd ../.. && npm run build --filter=@pokermind/web`
   - Output Directory: .next

4. Variables d'environnement:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.railway.app
   NEXT_PUBLIC_WS_URL=wss://your-api.railway.app
   DATABASE_URL=<votre-db-url>
   NEXTAUTH_SECRET=<secret>
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

#### Backend (Railway)

1. Créez un nouveau projet Railway
2. Ajoutez PostgreSQL et Redis depuis les services
3. Déployez l'API:
   - Root Directory: apps/api
   - Start Command: `npm run start`

4. Variables d'environnement:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   OPENAI_API_KEY=sk-...
   NODE_ENV=production
   PORT=8080
   FRONTEND_URL=https://your-app.vercel.app
   ```

### Option 2: Docker (VPS)

#### 1. Créer le Dockerfile pour l'API

```dockerfile
# apps/api/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN npm install
RUN npm run build --filter=@pokermind/api

EXPOSE 8080

CMD ["npm", "run", "start", "--workspace=@pokermind/api"]
```

#### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: pokermind
      POSTGRES_USER: pokermind
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    environment:
      DATABASE_URL: postgresql://pokermind:${DB_PASSWORD}@postgres:5432/pokermind
      REDIS_URL: redis://redis:6379
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      NODE_ENV: production
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: http://api:8080
      DATABASE_URL: postgresql://pokermind:${DB_PASSWORD}@postgres:5432/pokermind
    ports:
      - "3000:3000"
    depends_on:
      - api

volumes:
  postgres_data:
```

#### 3. Déploiement

```bash
# Build et démarrage
docker-compose up -d

# Migrations de la base
docker-compose exec api npx prisma migrate deploy

# Logs
docker-compose logs -f
```

## Configuration SSL/HTTPS

### Avec Nginx

```nginx
server {
    listen 80;
    server_name pokermind.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pokermind.com;

    ssl_certificate /etc/ssl/certs/pokermind.crt;
    ssl_certificate_key /etc/ssl/private/pokermind.key;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Monitoring et Logs

### Logs

```bash
# API logs
tail -f apps/api/combined.log

# Production logs avec PM2
pm2 logs pokermind-api
```

### Health Checks

```bash
# API health
curl https://your-api.com/health

# Response: {"status":"ok","timestamp":"..."}
```

## Scaling

### Horizontal Scaling (Load Balancer)

Pour scaler horizontalement avec plusieurs instances:

1. Utilisez Redis pour le state partagé
2. Configuration du load balancer (ex: Nginx)
3. Socket.IO avec Redis adapter:

```typescript
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

## Troubleshooting

### Base de données

```bash
# Reset de la base (ATTENTION: Supprime toutes les données)
npx prisma migrate reset

# Vérification de la connexion
npx prisma db pull
```

### WebSocket

Si les WebSocket ne fonctionnent pas:
- Vérifiez les CORS
- Vérifiez que le port WebSocket est ouvert
- Vérifiez les logs du serveur

### Performance

- Activez le cache Redis
- Utilisez un CDN pour les assets statiques
- Optimisez les requêtes Prisma avec `include` et `select`

## Sécurité

- [ ] Variables d'environnement sécurisées
- [ ] HTTPS activé
- [ ] Rate limiting activé
- [ ] JWT avec expiration
- [ ] Hash des mots de passe avec bcrypt
- [ ] Validation des inputs (Zod)
- [ ] Protection CSRF
- [ ] Headers de sécurité (helmet)

## Backup

```bash
# Backup PostgreSQL
pg_dump -U pokermind pokermind > backup_$(date +%Y%m%d).sql

# Restore
psql -U pokermind pokermind < backup_20240101.sql
```
