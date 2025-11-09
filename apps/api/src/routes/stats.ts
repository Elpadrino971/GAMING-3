import { Router } from 'express';
import { prisma } from '@pokermind/database';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/stats/:userId
 * Récupère les statistiques d'un utilisateur
 */
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const stats = await prisma.userStats.findUnique({
      where: { userId }
    });

    if (!stats) {
      return res.status(404).json({ error: 'Statistiques non trouvées' });
    }

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    logger.error('Erreur récupération stats:', error);
    next(error);
  }
});

/**
 * GET /api/stats/leaderboard/idi
 * Classement IDI global
 */
router.get('/leaderboard/idi', async (req, res, next) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const topPlayers = await prisma.userStats.findMany({
      where: {
        idi: { gt: 0 }
      },
      orderBy: { idi: 'desc' },
      take: Number(limit),
      skip: Number(offset),
      include: {
        user: {
          select: {
            username: true,
            avatar: true
          }
        }
      }
    });

    res.json({
      success: true,
      leaderboard: topPlayers.map((stat, index) => ({
        rank: Number(offset) + index + 1,
        username: stat.user.username,
        avatar: stat.user.avatar,
        idi: stat.idi,
        totalHands: stat.totalHands
      }))
    });
  } catch (error) {
    logger.error('Erreur leaderboard:', error);
    next(error);
  }
});

export default router;
