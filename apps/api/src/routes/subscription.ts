import { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '@pokermind/database';
import { logger } from '../utils/logger';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia'
});

/**
 * POST /api/subscription/create-checkout
 * Crée une session de paiement Stripe
 */
router.post('/create-checkout', async (req, res, next) => {
  try {
    const { userId, tier } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Prix selon le tier
    const priceId = tier === 'PRO'
      ? process.env.STRIPE_PRICE_PRO // price_xxx pour 9.99€/mois
      : process.env.STRIPE_PRICE_PREMIUM; // price_xxx pour 19.99€/mois

    // Créer la session Checkout
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        userId: user.id,
        tier
      }
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    logger.error('Erreur création checkout:', error);
    next(error);
  }
});

/**
 * POST /api/subscription/webhook
 * Webhook Stripe pour gérer les événements
 */
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    logger.error('Erreur webhook signature:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer l'événement
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;

    case 'customer.subscription.updated':
      const subscriptionUpdated = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(subscriptionUpdated);
      break;

    case 'customer.subscription.deleted':
      const subscriptionDeleted = event.data.object as Stripe.Subscription;
      await handleSubscriptionCancelled(subscriptionDeleted);
      break;

    default:
      logger.info(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

/**
 * GET /api/subscription/status/:userId
 * Récupère le statut de l'abonnement
 */
router.get('/status/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    });

    if (!subscription) {
      return res.json({
        success: true,
        tier: 'FREE',
        status: 'INACTIVE'
      });
    }

    res.json({
      success: true,
      tier: subscription.tier,
      status: subscription.status,
      endDate: subscription.endDate,
      renewalDate: subscription.renewalDate
    });
  } catch (error) {
    logger.error('Erreur récupération status:', error);
    next(error);
  }
});

/**
 * POST /api/subscription/cancel
 * Annule un abonnement
 */
router.post('/cancel', async (req, res, next) => {
  try {
    const { userId } = req.body;

    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      return res.status(404).json({ error: 'Abonnement non trouvé' });
    }

    // Annuler sur Stripe
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    // Mettre à jour la base
    await prisma.subscription.update({
      where: { userId },
      data: {
        status: 'CANCELLED'
      }
    });

    res.json({
      success: true,
      message: 'Abonnement annulé avec succès'
    });
  } catch (error) {
    logger.error('Erreur annulation abonnement:', error);
    next(error);
  }
});

// Handlers pour les événements Stripe

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const tier = session.metadata?.tier as 'PRO' | 'PREMIUM';

  if (!userId || !tier) return;

  // Créer ou mettre à jour l'abonnement
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      tier,
      status: 'ACTIVE',
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      startDate: new Date(),
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 jours
    },
    update: {
      tier,
      status: 'ACTIVE',
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  logger.info(`Subscription created for user ${userId} - Tier: ${tier}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  await prisma.subscription.update({
    where: { userId },
    data: {
      status: subscription.status === 'active' ? 'ACTIVE' : 'PAUSED',
      renewalDate: new Date(subscription.current_period_end * 1000)
    }
  });
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'EXPIRED',
      endDate: new Date()
    }
  });

  logger.info(`Subscription cancelled for user ${userId}`);
}

export default router;
