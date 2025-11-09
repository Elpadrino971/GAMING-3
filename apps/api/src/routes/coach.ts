import { Router } from 'express';
import { AICoach } from '@pokermind/ai-engine';
import { prisma } from '@pokermind/database';
import { logger } from '../utils/logger';

const router = Router();

// Initialisation du coach IA
const coach = new AICoach(process.env.OPENAI_API_KEY || '');

/**
 * POST /api/coach/advice/hand
 * Génère un conseil pour une main spécifique
 */
router.post('/advice/hand', async (req, res, next) => {
  try {
    const { handId, userId, mode } = req.body;

    // Récupération de la main et son analyse
    const hand = await prisma.hand.findUnique({
      where: { id: handId },
      include: {
        analysis: true,
        user: {
          include: { profile: true }
        }
      }
    });

    if (!hand || hand.userId !== userId) {
      return res.status(404).json({ error: 'Main non trouvée' });
    }

    if (!hand.analysis) {
      return res.status(400).json({ error: 'Main non encore analysée' });
    }

    // Construction de l'analyse pour le coach
    const analysis = {
      equity: hand.equity || 0,
      potOdds: hand.potOdds || 0,
      impliedOdds: 0, // À calculer
      gtoRecommendation: JSON.parse(hand.analysis.gtoAction),
      playerDecision: JSON.parse(hand.playerDecision),
      isOptimal: hand.isOptimal || false,
      optimality: hand.optimality || 0,
      mistakes: JSON.parse(hand.analysis.mistakes || '[]'),
      suggestions: JSON.parse(hand.analysis.suggestions || '[]'),
      expectedValue: hand.analysis.expectedValue || 0
    };

    const playerLevel = hand.user.profile?.skillLevel || 'BEGINNER';

    // Génération des conseils
    const advice = await coach.generateHandAdvice(
      analysis,
      mode,
      playerLevel
    );

    res.json({
      success: true,
      advice
    });
  } catch (error) {
    logger.error('Erreur génération conseil main:', error);
    next(error);
  }
});

/**
 * POST /api/coach/advice/session
 * Génère des conseils pour une session complète
 */
router.post('/advice/session', async (req, res, next) => {
  try {
    const { sessionId, userId, mode } = req.body;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        hands: {
          include: { analysis: true }
        },
        user: {
          include: { stats: true }
        }
      }
    });

    if (!session || session.userId !== userId) {
      return res.status(404).json({ error: 'Session non trouvée' });
    }

    // Construction de l'analyse de session
    const sessionAnalysis = {
      overallPerformance: calculateOverallPerformance(session.hands),
      idi: session.idi || 0,
      optimalDecisions: session.hands.filter(h => h.isOptimal).length,
      suboptimalDecisions: session.hands.filter(h => !h.isOptimal).length,
      majorMistakes: extractMajorMistakes(session.hands),
      strengths: ['À identifier'],
      weaknesses: ['À identifier'],
      improvementAreas: [],
      emotionalState: session.emotionalState as any,
      tiltDetected: session.tiltDetected
    };

    const playerStats = {
      vpip: session.user.stats?.vpip || 0,
      pfr: session.user.stats?.pfr || 0,
      aggressionFactor: session.user.stats?.aggressionFactor || 0,
      cBetPercentage: session.user.stats?.cBetPercentage || 0,
      foldToCBet: session.user.stats?.foldToCBet || 0,
      threeBetPercentage: session.user.stats?.threeBetPercentage || 0,
      wtsd: 0,
      wsd: 0
    };

    // Génération des conseils
    const advice = await coach.generateSessionAdvice(
      sessionAnalysis,
      playerStats,
      mode
    );

    res.json({
      success: true,
      advice
    });
  } catch (error) {
    logger.error('Erreur génération conseil session:', error);
    next(error);
  }
});

/**
 * POST /api/coach/learning-path
 * Génère un plan d'apprentissage personnalisé
 */
router.post('/learning-path', async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        stats: true,
        sessions: {
          orderBy: { startTime: 'desc' },
          take: 10
        }
      }
    });

    if (!user || !user.stats) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const playerStats = {
      vpip: user.stats.vpip || 0,
      pfr: user.stats.pfr || 0,
      aggressionFactor: user.stats.aggressionFactor || 0,
      cBetPercentage: user.stats.cBetPercentage || 0,
      foldToCBet: user.stats.foldToCBet || 0,
      threeBetPercentage: user.stats.threeBetPercentage || 0,
      wtsd: 0,
      wsd: 0
    };

    const sessionHistory = user.sessions.map(s => ({
      idi: s.idi || 0,
      tiltDetected: s.tiltDetected,
      emotionalState: s.emotionalState
    }));

    // Génération du plan d'apprentissage
    const learningPath = await coach.generateLearningPath(
      playerStats,
      sessionHistory
    );

    // Sauvegarde dans les paramètres de coaching
    await prisma.coachSettings.upsert({
      where: { userId },
      create: {
        userId,
        learningPath: JSON.stringify(learningPath)
      },
      update: {
        learningPath: JSON.stringify(learningPath)
      }
    });

    res.json({
      success: true,
      learningPath
    });
  } catch (error) {
    logger.error('Erreur génération learning path:', error);
    next(error);
  }
});

// Fonctions utilitaires
function calculateOverallPerformance(hands: any[]): number {
  if (hands.length === 0) return 0;

  const avgOptimality = hands.reduce((sum, h) => sum + (h.optimality || 0), 0) / hands.length;
  return avgOptimality * 100;
}

function extractMajorMistakes(hands: any[]): any[] {
  return hands
    .filter(h => h.analysis)
    .flatMap(h => {
      const mistakes = JSON.parse(h.analysis.mistakes || '[]');
      return mistakes.filter((m: any) => m.severity === 'critical' || m.severity === 'major');
    });
}

export default router;
