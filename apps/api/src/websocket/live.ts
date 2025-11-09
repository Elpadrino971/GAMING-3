import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';

interface LiveStream {
  streamId: string;
  hostId: string;
  hostName: string;
  viewers: Set<string>;
  mode: 'coach-battle' | 'shadow-play' | 'live-assisted';
  isActive: boolean;
}

const activeStreams = new Map<string, LiveStream>();

export function setupLiveSocket(io: Server) {
  const liveNamespace = io.of('/live');

  liveNamespace.on('connection', (socket: Socket) => {
    logger.info(`Live client connecté: ${socket.id}`);

    // Créer un stream
    socket.on('stream:create', ({ userId, username, mode }) => {
      const streamId = `stream_${Date.now()}_${userId}`;

      const stream: LiveStream = {
        streamId,
        hostId: userId,
        hostName: username,
        viewers: new Set(),
        mode,
        isActive: true
      };

      activeStreams.set(streamId, stream);
      socket.join(streamId);

      logger.info(`Stream créé: ${streamId} par ${username} en mode ${mode}`);

      socket.emit('stream:created', {
        streamId,
        mode
      });

      // Broadcast la liste des streams actifs
      liveNamespace.emit('streams:updated', {
        streams: Array.from(activeStreams.values()).map(s => ({
          streamId: s.streamId,
          hostName: s.hostName,
          mode: s.mode,
          viewerCount: s.viewers.size
        }))
      });
    });

    // Rejoindre un stream
    socket.on('stream:join', ({ streamId, userId, username }) => {
      const stream = activeStreams.get(streamId);
      if (!stream) {
        socket.emit('stream:error', { message: 'Stream non trouvé' });
        return;
      }

      stream.viewers.add(userId);
      socket.join(streamId);

      logger.info(`${username} a rejoint le stream ${streamId}`);

      // Notifier l'hôte
      liveNamespace.to(streamId).emit('viewer:joined', {
        userId,
        username,
        viewerCount: stream.viewers.size
      });

      socket.emit('stream:joined', {
        streamId,
        hostName: stream.hostName,
        mode: stream.mode,
        viewerCount: stream.viewers.size
      });
    });

    // Quitter un stream
    socket.on('stream:leave', ({ streamId, userId }) => {
      const stream = activeStreams.get(streamId);
      if (stream) {
        stream.viewers.delete(userId);

        liveNamespace.to(streamId).emit('viewer:left', {
          userId,
          viewerCount: stream.viewers.size
        });
      }

      socket.leave(streamId);
    });

    // Coach Battle: IA débat
    socket.on('coach-battle:ai-comment', ({ streamId, aiName, comment, side }) => {
      liveNamespace.to(streamId).emit('coach-battle:comment', {
        aiName,
        comment,
        side,
        timestamp: new Date()
      });
    });

    // Coach Battle: Vote du public
    socket.on('coach-battle:vote', ({ streamId, userId, vote }) => {
      liveNamespace.to(streamId).emit('coach-battle:vote-cast', {
        userId,
        vote
      });
    });

    // Shadow Play: Action du spectateur
    socket.on('shadow-play:action', ({ streamId, userId, action, amount }) => {
      logger.info(`Shadow play action par ${userId}: ${action}`);

      socket.emit('shadow-play:action-recorded', {
        action,
        amount,
        message: 'Action enregistrée ! Tu verras la comparaison à la fin de la main.'
      });
    });

    // Shadow Play: Comparaison
    socket.on('shadow-play:compare', ({ streamId, proAction, viewerActions }) => {
      liveNamespace.to(streamId).emit('shadow-play:results', {
        proAction,
        viewerActions,
        analysis: compareActions(proAction, viewerActions)
      });
    });

    // Live Chat
    socket.on('chat:message', ({ streamId, userId, username, message }) => {
      liveNamespace.to(streamId).emit('chat:message', {
        userId,
        username,
        message,
        timestamp: new Date()
      });
    });

    // Mettre fin au stream
    socket.on('stream:end', ({ streamId }) => {
      const stream = activeStreams.get(streamId);
      if (stream) {
        stream.isActive = false;

        liveNamespace.to(streamId).emit('stream:ended', {
          message: `Le stream de ${stream.hostName} est terminé`
        });

        activeStreams.delete(streamId);

        // Broadcast la liste mise à jour
        liveNamespace.emit('streams:updated', {
          streams: Array.from(activeStreams.values()).map(s => ({
            streamId: s.streamId,
            hostName: s.hostName,
            mode: s.mode,
            viewerCount: s.viewers.size
          }))
        });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Live client déconnecté: ${socket.id}`);

      // Retirer des streams
      activeStreams.forEach((stream, streamId) => {
        if (stream.hostId === socket.id) {
          // L'hôte s'est déconnecté
          stream.isActive = false;
          liveNamespace.to(streamId).emit('stream:ended', {
            message: 'Le stream a été interrompu'
          });
          activeStreams.delete(streamId);
        }
      });
    });
  });
}

function compareActions(proAction: any, viewerActions: any[]): any {
  const correctCount = viewerActions.filter(
    a => a.action === proAction.action
  ).length;

  const accuracy = (correctCount / viewerActions.length) * 100;

  return {
    correctCount,
    totalCount: viewerActions.length,
    accuracy,
    proAction,
    message: accuracy > 70
      ? '🏆 Excellent ! La majorité a fait le bon choix !'
      : accuracy > 40
      ? '✅ Pas mal ! Mais il y a encore de la marge de progression'
      : '📚 C\'était une décision difficile, continuez d\'apprendre !'
  };
}
