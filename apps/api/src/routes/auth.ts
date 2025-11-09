import { Router } from 'express';
import { prisma } from '@pokermind/database';
import { logger } from '../utils/logger';

const router = Router();

// Routes d'authentification simplifiées (à compléter avec JWT, etc.)

router.post('/register', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email ou username déjà utilisé' });
    }

    // Créer l'utilisateur (hash du mot de passe à ajouter)
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash: password, // À hasher avec bcrypt
        profile: {
          create: {
            preferredMode: 'LIGHT',
            skillLevel: 'BEGINNER'
          }
        }
      }
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    logger.error('Erreur register:', error);
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        stats: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe (à implémenter avec bcrypt)
    // const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profile: user.profile,
        stats: user.stats
      }
    });
  } catch (error) {
    logger.error('Erreur login:', error);
    next(error);
  }
});

export default router;
