import { Server, Socket } from 'socket.io';
import { HandAnalyzer, AICoach } from '@pokermind/ai-engine';
import { logger } from '../utils/logger';

const analyzer = new HandAnalyzer();
const coach = new AICoach(process.env.OPENAI_API_KEY || '');

export function setupCoachSocket(io: Server) {
  const coachNamespace = io.of('/coach');

  coachNamespace.on('connection', (socket: Socket) => {
    logger.info(`Coach client connecté: ${socket.id}`);

    // Activer le mode coaching
    socket.on('coach:activate', async ({ userId, mode }) => {
      logger.info(`Coach activé pour user ${userId} en mode ${mode}`);

      socket.emit('coach:activated', {
        mode,
        message: `Coach ${mode} activé ! Je vais analyser tes décisions en temps réel.`
      });
    });

    // Analyse en temps réel d'une décision
    socket.on('hand:analyze', async ({ handState, playerDecision, mode, playerLevel }) => {
      try {
        // Analyse rapide
        const analysis = await analyzer.analyzeHand(handState, playerDecision);

        // Génération de conseils immédiats
        const advice = await coach.generateHandAdvice(analysis, mode, playerLevel);

        // Envoyer les conseils
        socket.emit('coach:advice', {
          analysis,
          advice,
          priority: analysis.isOptimal ? 'low' : 'high'
        });

        // Si erreur critique, alerte immédiate
        const criticalMistakes = analysis.mistakes.filter(
          m => m.severity === 'critical'
        );

        if (criticalMistakes.length > 0) {
          socket.emit('coach:alert', {
            type: 'critical',
            message: criticalMistakes[0].description,
            suggestion: analysis.suggestions[0]
          });
        }
      } catch (error) {
        logger.error('Erreur analyse temps réel:', error);
        socket.emit('coach:error', {
          message: 'Erreur lors de l\'analyse'
        });
      }
    });

    // Demande de conseil
    socket.on('coach:ask', async ({ question, context, mode }) => {
      try {
        // Utiliser OpenAI pour répondre à la question
        const response = await generateCoachResponse(question, context, mode);

        socket.emit('coach:response', {
          question,
          response
        });
      } catch (error) {
        logger.error('Erreur coach ask:', error);
        socket.emit('coach:error', {
          message: 'Erreur lors de la génération de réponse'
        });
      }
    });

    // Détection de tilt
    socket.on('emotion:update', ({ emotionalState, recentActions }) => {
      const tiltDetected = detectTilt(emotionalState, recentActions);

      if (tiltDetected) {
        socket.emit('coach:alert', {
          type: 'tilt',
          message: '⚠️ Signes de tilt détectés ! Prends une pause de 10 minutes.',
          priority: 'critical'
        });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Coach client déconnecté: ${socket.id}`);
    });
  });
}

async function generateCoachResponse(
  question: string,
  context: any,
  mode: string
): Promise<string> {
  // Simulation - dans la vraie implémentation, utiliser OpenAI
  return `En mode ${mode}, voici ma réponse: [Réponse IA ici]`;
}

function detectTilt(emotionalState: string, recentActions: any[]): boolean {
  if (emotionalState === 'TILTED' || emotionalState === 'FRUSTRATED') {
    return true;
  }

  // Analyser les actions récentes pour détecter des patterns de tilt
  const aggressiveActions = recentActions.filter(
    a => a.type === 'raise' || a.type === 'bet'
  ).length;

  return aggressiveActions > recentActions.length * 0.8;
}
