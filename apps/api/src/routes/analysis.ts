import { Router } from 'express';
import { HandAnalyzer } from '@pokermind/ai-engine';
import { prisma } from '@pokermind/database';
import { logger } from '../utils/logger';

const router = Router();
const analyzer = new HandAnalyzer();

/**
 * POST /api/analysis/hand
 * Analyse une main de poker
 */
router.post('/hand', async (req, res, next) => {
  try {
    const { handId, userId } = req.body;

    // Récupération de la main
    const hand = await prisma.hand.findUnique({
      where: { id: handId },
      include: { session: true }
    });

    if (!hand || hand.userId !== userId) {
      return res.status(404).json({ error: 'Main non trouvée' });
    }

    // Conversion des données pour l'analyseur
    const handState = {
      holeCards: JSON.parse(hand.holeCards),
      communityCards: hand.communityCards ? JSON.parse(hand.communityCards) : [],
      position: hand.position,
      pot: hand.finalPot,
      stackSize: hand.stackSize,
      toCall: 0, // À calculer depuis les actions
      numPlayers: hand.numPlayers,
      street: determineStreet(hand.communityCards),
      actions: JSON.parse(hand.actions)
    };

    const playerDecision = JSON.parse(hand.playerDecision);

    // Analyse
    const analysis = await analyzer.analyzeHand(handState, playerDecision);

    // Sauvegarde de l'analyse
    await prisma.handAnalysis.create({
      data: {
        handId: hand.id,
        gtoAction: JSON.stringify(analysis.gtoRecommendation),
        gtoExplanation: analysis.gtoRecommendation.reasoning,
        mistakes: JSON.stringify(analysis.mistakes),
        suggestions: JSON.stringify(analysis.suggestions),
        expectedValue: analysis.expectedValue
      }
    });

    // Mise à jour de la main
    await prisma.hand.update({
      where: { id: handId },
      data: {
        isOptimal: analysis.isOptimal,
        optimality: analysis.optimality,
        aiRecommendation: JSON.stringify(analysis.gtoRecommendation)
      }
    });

    res.json({
      success: true,
      analysis
    });

  } catch (error) {
    logger.error('Erreur analyse main:', error);
    next(error);
  }
});

/**
 * POST /api/analysis/session
 * Analyse une session complète
 */
router.post('/session', async (req, res, next) => {
  try {
    const { sessionId, userId } = req.body;

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

    // Calculs statistiques
    const totalHands = session.hands.length;
    const optimalHands = session.hands.filter(h => h.isOptimal).length;
    const suboptimalHands = totalHands - optimalHands;

    const avgOptimality = session.hands.reduce((sum, h) => sum + (h.optimality || 0), 0) / totalHands;
    const idi = avgOptimality * 100;

    // Identification des forces et faiblesses
    const mistakes = session.hands
      .filter(h => h.analysis)
      .flatMap(h => JSON.parse(h.analysis!.mistakes || '[]'));

    const majorMistakes = mistakes.filter(m => m.severity === 'critical' || m.severity === 'major');

    // Calcul de la performance globale
    const profitability = session.profit || 0;
    const expectedProfit = session.hands.reduce((sum, h) => {
      const analysis = h.analysis;
      if (!analysis) return sum;
      return sum + analysis.expectedValue;
    }, 0);

    const overallPerformance = Math.min(100, Math.max(0,
      (idi * 0.7) + ((profitability / expectedProfit) * 30)
    ));

    // Mise à jour de la session
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        idi,
        emotionalState: detectEmotionalState(session.hands),
        tiltDetected: detectTilt(session.hands)
      }
    });

    const sessionAnalysis = {
      overallPerformance,
      idi,
      optimalDecisions: optimalHands,
      suboptimalDecisions: suboptimalHands,
      majorMistakes,
      strengths: identifyStrengths(session.hands),
      weaknesses: identifyWeaknesses(mistakes),
      improvementAreas: identifyImprovementAreas(mistakes),
      emotionalState: detectEmotionalState(session.hands),
      tiltDetected: detectTilt(session.hands)
    };

    res.json({
      success: true,
      analysis: sessionAnalysis
    });

  } catch (error) {
    logger.error('Erreur analyse session:', error);
    next(error);
  }
});

// Fonctions utilitaires
function determineStreet(communityCards: string | null): string {
  if (!communityCards) return 'preflop';
  const cards = JSON.parse(communityCards);
  if (cards.length === 0) return 'preflop';
  if (cards.length === 3) return 'flop';
  if (cards.length === 4) return 'turn';
  return 'river';
}

function detectEmotionalState(hands: any[]): string {
  // Analyse simplifiée de l'état émotionnel basée sur les patterns de jeu
  const recentHands = hands.slice(-10);
  const aggressionChanges = recentHands.map((h, i) => {
    if (i === 0) return 0;
    const prevActions = JSON.parse(recentHands[i - 1].actions);
    const currActions = JSON.parse(h.actions);
    return currActions.length - prevActions.length;
  });

  const avgChange = aggressionChanges.reduce((a, b) => a + b, 0) / aggressionChanges.length;

  if (avgChange > 2) return 'EXCITED';
  if (avgChange > 1) return 'CONFIDENT';
  if (avgChange < -2) return 'FRUSTRATED';
  if (avgChange < -1) return 'ANXIOUS';
  return 'CALM';
}

function detectTilt(hands: any[]): boolean {
  // Détection de tilt basée sur les erreurs récentes
  const recentHands = hands.slice(-5);
  const criticalMistakes = recentHands.filter(h => {
    if (!h.analysis) return false;
    const mistakes = JSON.parse(h.analysis.mistakes || '[]');
    return mistakes.some((m: any) => m.severity === 'critical');
  });

  return criticalMistakes.length >= 3;
}

function identifyStrengths(hands: any[]): string[] {
  const strengths: string[] = [];

  // Analyse des décisions optimales par catégorie
  const preflopOptimal = hands.filter(h =>
    determineStreet(h.communityCards) === 'preflop' && h.isOptimal
  ).length / hands.filter(h => determineStreet(h.communityCards) === 'preflop').length;

  if (preflopOptimal > 0.8) {
    strengths.push('Excellent jeu pre-flop');
  }

  return strengths;
}

function identifyWeaknesses(mistakes: any[]): string[] {
  const weaknesses: string[] = [];

  const mistakeTypes = mistakes.reduce((acc, m) => {
    acc[m.type] = (acc[m.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(mistakeTypes).forEach(([type, count]) => {
    if (count > 3) {
      weaknesses.push(`Tendance à ${type.replace('_', ' ')}`);
    }
  });

  return weaknesses;
}

function identifyImprovementAreas(mistakes: any[]): string[] {
  const areas: string[] = [];

  const categories = mistakes.reduce((acc, m) => {
    const category = categorizeMistake(m.type);
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .forEach(([category]) => {
      areas.push(category);
    });

  return areas;
}

function categorizeMistake(type: string): string {
  if (type.includes('fold') || type.includes('call') || type.includes('bet') || type.includes('raise')) {
    return 'betting';
  }
  if (type.includes('bluff')) {
    return 'bluffing';
  }
  if (type.includes('value')) {
    return 'value_betting';
  }
  return 'postflop';
}

export default router;
