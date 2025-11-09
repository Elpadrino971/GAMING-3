import { Router } from 'express';
import { prisma } from '@pokermind/database';
import { logger } from '../utils/logger';

const router = Router();

/**
 * POST /api/game/session/start
 * Démarre une nouvelle session de jeu
 */
router.post('/session/start', async (req, res, next) => {
  try {
    const { userId, sessionType, gameType, totalBuyIn } = req.body;

    const session = await prisma.session.create({
      data: {
        userId,
        sessionType,
        gameType,
        totalBuyIn,
        startTime: new Date()
      }
    });

    logger.info(`Session démarrée: ${session.id} pour user ${userId}`);

    res.json({
      success: true,
      session
    });
  } catch (error) {
    logger.error('Erreur démarrage session:', error);
    next(error);
  }
});

/**
 * POST /api/game/session/:id/end
 * Termine une session de jeu
 */
router.post('/session/:id/end', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { totalCashOut } = req.body;

    const session = await prisma.session.findUnique({
      where: { id }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);
    const profit = totalCashOut - session.totalBuyIn;

    const updatedSession = await prisma.session.update({
      where: { id },
      data: {
        endTime,
        duration,
        totalCashOut,
        profit
      }
    });

    // Mise à jour des stats utilisateur
    await updateUserStats(session.userId, updatedSession);

    res.json({
      success: true,
      session: updatedSession
    });
  } catch (error) {
    logger.error('Erreur fin session:', error);
    next(error);
  }
});

/**
 * POST /api/game/hand
 * Enregistre une main jouée
 */
router.post('/hand', async (req, res, next) => {
  try {
    const {
      userId,
      sessionId,
      handNumber,
      holeCards,
      communityCards,
      position,
      numPlayers,
      actions,
      finalPot,
      wonAmount,
      playerDecision,
      stackSize,
      potOdds,
      equity
    } = req.body;

    const hand = await prisma.hand.create({
      data: {
        userId,
        sessionId,
        handNumber,
        holeCards: JSON.stringify(holeCards),
        communityCards: communityCards ? JSON.stringify(communityCards) : null,
        position,
        numPlayers,
        actions: JSON.stringify(actions),
        finalPot,
        wonAmount,
        playerDecision: JSON.stringify(playerDecision),
        stackSize,
        potOdds,
        equity
      }
    });

    // Mise à jour du compteur de mains de la session
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        handsPlayed: {
          increment: 1
        }
      }
    });

    res.json({
      success: true,
      hand
    });
  } catch (error) {
    logger.error('Erreur enregistrement main:', error);
    next(error);
  }
});

/**
 * GET /api/game/session/:id
 * Récupère les détails d'une session
 */
router.get('/session/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        hands: {
          orderBy: { handNumber: 'asc' },
          include: { analysis: true }
        },
        replay: true
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    logger.error('Erreur récupération session:', error);
    next(error);
  }
});

/**
 * GET /api/game/sessions/:userId
 * Récupère l'historique des sessions d'un utilisateur
 */
router.get('/sessions/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const sessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { startTime: 'desc' },
      take: Number(limit),
      skip: Number(offset),
      include: {
        _count: {
          select: { hands: true }
        }
      }
    });

    const total = await prisma.session.count({
      where: { userId }
    });

    res.json({
      success: true,
      sessions,
      total,
      limit: Number(limit),
      offset: Number(offset)
    });
  } catch (error) {
    logger.error('Erreur récupération sessions:', error);
    next(error);
  }
});

// Fonction utilitaire pour mettre à jour les stats utilisateur
async function updateUserStats(userId: string, session: any) {
  const stats = await prisma.userStats.findUnique({
    where: { userId }
  });

  if (!stats) {
    await prisma.userStats.create({
      data: {
        userId,
        totalHands: session.handsPlayed,
        totalSessions: 1,
        totalWinnings: session.profit || 0
      }
    });
  } else {
    await prisma.userStats.update({
      where: { userId },
      data: {
        totalHands: { increment: session.handsPlayed },
        totalSessions: { increment: 1 },
        totalWinnings: { increment: session.profit || 0 }
      }
    });
  }
}

export default router;
