/**
 * Video Generator - Génère des vidéos de replay automatiques
 * Parfait pour partager sur TikTok, Instagram, YouTube Shorts
 */

import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { VideoClip, VideoConfig, VideoEffect, Frame } from './types';

export class VideoGenerator {
  private tempDir: string;

  constructor(tempDir: string = '/tmp/pokermind-replays') {
    this.tempDir = tempDir;

    // Créer le dossier temp si nécessaire
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  }

  /**
   * Génère une vidéo de replay à partir d'une session
   */
  async generateSessionReplay(
    session: any,
    config: VideoConfig = {
      resolution: '1080p',
      fps: 30,
      format: 'mp4',
      style: 'pro'
    }
  ): Promise<string> {
    const clips: VideoClip[] = [];

    // Sélectionner les mains clés
    const keyHands = this.selectKeyHands(session.hands);

    // Générer un clip pour chaque main clé
    for (const hand of keyHands) {
      const clip = await this.createHandClip(hand, config);
      clips.push(clip);
    }

    // Assembler les clips en une vidéo
    const videoPath = await this.assembleVideo(clips, config);

    return videoPath;
  }

  /**
   * Génère un clip court pour TikTok/Instagram (30-60s)
   */
  async generateShortClip(
    hand: any,
    analysis: any,
    config: VideoConfig = {
      resolution: '1080p',
      fps: 30,
      format: 'mp4',
      style: 'flashy'
    }
  ): Promise<string> {
    const sessionId = `short_${Date.now()}`;
    const outputPath = path.join(this.tempDir, `${sessionId}.${config.format}`);

    // Dimensions basées sur la résolution
    const { width, height } = this.getResolution(config.resolution);

    // Créer le canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Générer les frames
    const frames: Buffer[] = [];
    const duration = 5; // 5 secondes par main
    const totalFrames = duration * config.fps;

    for (let i = 0; i < totalFrames; i++) {
      const frame = this.renderFrame(ctx, hand, analysis, i, totalFrames, config);
      frames.push(frame);
    }

    // Sauvegarder les frames
    const framesDir = path.join(this.tempDir, sessionId);
    fs.mkdirSync(framesDir, { recursive: true });

    frames.forEach((frame, index) => {
      const framePath = path.join(framesDir, `frame_${String(index).padStart(5, '0')}.png`);
      fs.writeFileSync(framePath, frame);
    });

    // Assembler avec FFmpeg
    await this.createVideoFromFrames(framesDir, outputPath, config);

    // Nettoyer
    fs.rmSync(framesDir, { recursive: true });

    return outputPath;
  }

  /**
   * Sélectionne les mains les plus intéressantes
   */
  private selectKeyHands(hands: any[]): any[] {
    const keyHands: any[] = [];

    // Critères de sélection
    hands.forEach(hand => {
      let score = 0;

      // Main avec grosse erreur
      if (hand.analysis && hand.analysis.mistakes) {
        const mistakes = JSON.parse(hand.analysis.mistakes);
        const hasCritical = mistakes.some((m: any) => m.severity === 'critical');
        if (hasCritical) score += 10;
      }

      // Main optimale
      if (hand.isOptimal) score += 5;

      // Gros pot
      if (hand.finalPot > 100) score += 3;

      // Bluff réussi
      if (hand.wonAmount > hand.finalPot * 0.8 && hand.equity < 0.3) {
        score += 8; // Epic bluff
      }

      // Bad beat
      if (hand.equity > 0.8 && !hand.wonAmount) {
        score += 7;
      }

      hand.interestScore = score;
    });

    // Trier et prendre les top 5-10
    return hands
      .sort((a, b) => (b.interestScore || 0) - (a.interestScore || 0))
      .slice(0, 10);
  }

  /**
   * Crée un clip pour une main
   */
  private async createHandClip(hand: any, config: VideoConfig): Promise<VideoClip> {
    const commentary = await this.generateCommentary(hand);

    return {
      handId: hand.id,
      duration: 5,
      frames: [],
      commentary,
      highlight: hand.interestScore > 8
    };
  }

  /**
   * Génère un commentaire pour une main
   */
  private async generateCommentary(hand: any): Promise<string> {
    if (!hand.analysis) return 'Belle main !';

    const analysis = hand.analysis;

    if (hand.isOptimal) {
      return '✅ Décision parfaite ! Pro play.';
    }

    if (analysis.mistakes && JSON.parse(analysis.mistakes).length > 0) {
      const mistake = JSON.parse(analysis.mistakes)[0];

      switch (mistake.severity) {
        case 'critical':
          return `❌ ${mistake.description}`;
        case 'major':
          return `⚠️ ${mistake.description}`;
        default:
          return `💡 ${mistake.description}`;
      }
    }

    return '🎰 Main intéressante !';
  }

  /**
   * Rendu d'une frame
   */
  private renderFrame(
    ctx: CanvasRenderingContext2D,
    hand: any,
    analysis: any,
    frameIndex: number,
    totalFrames: number,
    config: VideoConfig
  ): Buffer {
    const { width, height } = this.getResolution(config.resolution);

    // Background
    ctx.fillStyle = config.style === 'flashy' ? '#000000' : '#0A5F38';
    ctx.fillRect(0, 0, width, height);

    // Progress indicator
    const progress = frameIndex / totalFrames;

    // Render cards (simplifié)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Arial';
    ctx.fillText('♠️ A♥️ K', width / 2 - 100, height / 2);

    // Render commentary
    const commentary = this.generateCommentary(hand);
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(commentary, 50, height - 100);

    // Effect overlay
    if (analysis && !analysis.isOptimal) {
      this.renderEffect(ctx, VideoEffect.MISTAKE, width, height, progress);
    } else if (analysis && analysis.isOptimal) {
      this.renderEffect(ctx, VideoEffect.GOOD_PLAY, width, height, progress);
    }

    // Logo/Watermark
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
    ctx.fillText('PokerMind AI', width - 200, height - 30);

    return canvas.toBuffer('image/png');
  }

  /**
   * Rendu des effets visuels
   */
  private renderEffect(
    ctx: CanvasRenderingContext2D,
    effect: VideoEffect,
    width: number,
    height: number,
    progress: number
  ): void {
    switch (effect) {
      case VideoEffect.GOOD_PLAY:
        // Flash vert
        ctx.fillStyle = `rgba(0, 255, 0, ${0.3 * (1 - progress)})`;
        ctx.fillRect(0, 0, width, height);
        break;

      case VideoEffect.MISTAKE:
        // Flash rouge
        ctx.fillStyle = `rgba(255, 0, 0, ${0.3 * (1 - progress)})`;
        ctx.fillRect(0, 0, width, height);
        break;

      case VideoEffect.CRITICAL_ERROR:
        // Flash rouge intense
        ctx.fillStyle = `rgba(255, 0, 0, ${0.5 * Math.sin(progress * Math.PI * 4)})`;
        ctx.fillRect(0, 0, width, height);
        break;

      default:
        break;
    }
  }

  /**
   * Assemble les clips en vidéo avec FFmpeg
   */
  private async assembleVideo(clips: VideoClip[], config: VideoConfig): Promise<string> {
    const sessionId = `session_${Date.now()}`;
    const outputPath = path.join(this.tempDir, `${sessionId}.${config.format}`);

    // Pour l'instant, retourner un placeholder
    // Dans une vraie implémentation, utiliser FFmpeg pour assembler

    return outputPath;
  }

  /**
   * Crée une vidéo à partir de frames
   */
  private createVideoFromFrames(
    framesDir: string,
    outputPath: string,
    config: VideoConfig
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(path.join(framesDir, 'frame_%05d.png'))
        .inputFPS(config.fps)
        .videoCodec('libx264')
        .outputOptions([
          '-pix_fmt yuv420p',
          '-preset fast',
          '-crf 23'
        ])
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  }

  /**
   * Retourne les dimensions selon la résolution
   */
  private getResolution(resolution: '720p' | '1080p' | '4k'): { width: number; height: number } {
    switch (resolution) {
      case '720p':
        return { width: 1280, height: 720 };
      case '1080p':
        return { width: 1920, height: 1080 };
      case '4k':
        return { width: 3840, height: 2160 };
      default:
        return { width: 1920, height: 1080 };
    }
  }

  /**
   * Nettoie les fichiers temporaires
   */
  cleanup(): void {
    if (fs.existsSync(this.tempDir)) {
      const files = fs.readdirSync(this.tempDir);
      files.forEach(file => {
        const filePath = path.join(this.tempDir, file);
        if (fs.statSync(filePath).isDirectory()) {
          fs.rmSync(filePath, { recursive: true });
        } else {
          fs.unlinkSync(filePath);
        }
      });
    }
  }
}
