import { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '@pokermind/database';
import { ProCoach } from '@pokermind/pro-knowledge';
import { logger } from '../utils/logger';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia'
});

/**
 * GET /api/pro-coach/marketplace
 * Liste tous les coaches pros disponibles
 */
router.get('/marketplace', async (req, res, next) => {
  try {
    const pros = await prisma.proPlayer.findMany({
      include: {
        _count: {
          select: {
            tips: true,
            strategies: true,
            videos: true
          }
        }
      }
    });

    res.json({
      success: true,
      pros
    });
  } catch (error) {
    logger.error('Erreur marketplace:', error);
    next(error);
  }
});

/**
 * POST /api/pro-coach/purchase
 * Acheter un coach pro
 */
router.post('/purchase', async (req, res, next) => {
  try {
    const { userId, proId, price } = req.body;

    // Vérifier si déjà acheté
    const existing = await prisma.proPurchase.findFirst({
      where: {
        userId,
        proPlayerId: proId,
        type: 'COACH_STYLE'
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Already purchased' });
    }

    // Créer session Stripe
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Pro Coach: ${proId}`,
            description: 'Lifetime access to pro coaching style'
          },
          unit_amount: Math.round(price * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/pro-coach/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pro-marketplace`,
      metadata: {
        userId,
        proId,
        type: 'COACH_STYLE'
      }
    });

    res.json({
      success: true,
      url: session.url
    });
  } catch (error) {
    logger.error('Erreur purchase:', error);
    next(error);
  }
});

/**
 * POST /api/pro-coach/analyze-hand
 * Analyse une main comme le ferait le pro
 */
router.post('/analyze-hand', async (req, res, next) => {
  try {
    const { userId, proId, handState } = req.body;

    // Vérifier l'achat
    const purchase = await prisma.proPurchase.findFirst({
      where: {
        userId,
        proPlayerId: proId,
        type: 'COACH_STYLE'
      }
    });

    if (!purchase) {
      return res.status(403).json({ error: 'Pro coach not purchased' });
    }

    // Analyser avec le pro coach
    const proCoach = new ProCoach(process.env.OPENAI_API_KEY || '', proId);
    const analysis = await proCoach.analyzeHandAsPro(handState);

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    logger.error('Erreur analyze-hand:', error);
    next(error);
  }
});

/**
 * POST /api/pro-coach/compare
 * Compare l'action du joueur avec ce que le pro aurait fait
 */
router.post('/compare', async (req, res, next) => {
  try {
    const { userId, proId, handState, playerAction } = req.body;

    // Vérifier l'achat
    const purchase = await prisma.proPurchase.findFirst({
      where: {
        userId,
        proPlayerId: proId
      }
    });

    if (!purchase) {
      return res.status(403).json({ error: 'Pro coach not purchased' });
    }

    // Comparer
    const proCoach = new ProCoach(process.env.OPENAI_API_KEY || '', proId);
    const comparison = await proCoach.compareWithPro(handState, playerAction);

    res.json({
      success: true,
      comparison
    });
  } catch (error) {
    logger.error('Erreur compare:', error);
    next(error);
  }
});

/**
 * GET /api/pro-coach/learning-path/:userId/:proId
 * Génère un learning path personnalisé
 */
router.get('/learning-path/:userId/:proId', async (req, res, next) => {
  try {
    const { userId, proId } = req.params;

    // Vérifier l'achat
    const purchase = await prisma.proPurchase.findFirst({
      where: {
        userId,
        proPlayerId: proId
      }
    });

    if (!purchase) {
      return res.status(403).json({ error: 'Pro coach not purchased' });
    }

    // Récupérer les stats du joueur
    const stats = await prisma.userStats.findUnique({
      where: { userId }
    });

    if (!stats) {
      return res.status(404).json({ error: 'User stats not found' });
    }

    // Générer le learning path
    const proCoach = new ProCoach(process.env.OPENAI_API_KEY || '', proId);
    const learningPath = await proCoach.generateLearningPath(stats);

    res.json({
      success: true,
      learningPath
    });
  } catch (error) {
    logger.error('Erreur learning-path:', error);
    next(error);
  }
});

/**
 * GET /api/pro-coach/tips/:proId
 * Récupère les tips d'un pro
 */
router.get('/tips/:proId', async (req, res, next) => {
  try {
    const { proId } = req.params;
    const { category, limit = 10 } = req.query;

    const where: any = { proPlayerId: proId };
    if (category) {
      where.category = category;
    }

    const tips = await prisma.proTip.findMany({
      where,
      take: Number(limit),
      orderBy: { popularity: 'desc' },
      include: {
        proPlayer: {
          select: {
            name: true,
            nickname: true
          }
        }
      }
    });

    res.json({
      success: true,
      tips
    });
  } catch (error) {
    logger.error('Erreur tips:', error);
    next(error);
  }
});

/**
 * GET /api/pro-coach/my-coaches/:userId
 * Liste des coaches achetés par l'utilisateur
 */
router.get('/my-coaches/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const purchases = await prisma.proPurchase.findMany({
      where: { userId },
      include: {
        proPlayer: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      coaches: purchases.map(p => p.proPlayer)
    });
  } catch (error) {
    logger.error('Erreur my-coaches:', error);
    next(error);
  }
});

/**
 * POST /api/pro-coach/style-match
 * Trouve les pros qui jouent de façon similaire au joueur
 */
router.post('/style-match', async (req, res, next) => {
  try {
    const { stats } = req.body;

    if (!stats) {
      return res.status(400).json({ error: 'Stats required' });
    }

    // Importer le ProMatcher
    const { ProMatcher } = await import('@pokermind/pro-knowledge');
    const matcher = new ProMatcher();

    // Trouver les pros similaires
    const matches = matcher.findSimilarPros(stats, 5);

    // Déterminer le style du joueur
    const playerStyle = matcher.getPlayerStyle(stats);

    // Recommander un coach pour amélioration
    const recommendedCoach = matcher.recommendCoachForImprovement(stats);

    res.json({
      success: true,
      playerStyle,
      matches,
      recommendedCoach
    });
  } catch (error) {
    logger.error('Erreur style-match:', error);
    next(error);
  }
});

export default router;
