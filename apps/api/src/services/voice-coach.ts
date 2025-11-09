/**
 * Voice Coach - Coaching vocal en temps réel
 * Utilise TTS pour donner des conseils vocaux
 */

import OpenAI from 'openai';
import { logger } from '../utils/logger';

export type VoicePersonality = 'calm' | 'aggressive' | 'pro' | 'funny';

export interface VoiceCoachConfig {
  personality: VoicePersonality;
  speed: number; // 0.5-2.0
  language: 'fr' | 'en';
}

export class VoiceCoach {
  private openai: OpenAI;
  private elevenLabsKey: string | undefined;

  constructor(openaiKey: string, elevenLabsKey?: string) {
    this.openai = new OpenAI({ apiKey: openaiKey });
    this.elevenLabsKey = elevenLabsKey;
  }

  /**
   * Génère un audio TTS pour un conseil
   */
  async speakAdvice(
    advice: string,
    config: VoiceCoachConfig = {
      personality: 'pro',
      speed: 1.0,
      language: 'fr'
    }
  ): Promise<Buffer> {
    try {
      // Adapter le texte selon la personnalité
      const adaptedText = this.adaptTone(advice, config.personality, config.language);

      // Si ElevenLabs est disponible (meilleure qualité)
      if (this.elevenLabsKey) {
        return await this.speakWithElevenLabs(adaptedText, config);
      }

      // Sinon utiliser OpenAI TTS
      return await this.speakWithOpenAI(adaptedText, config);
    } catch (error) {
      logger.error('Erreur génération voix:', error);
      throw error;
    }
  }

  /**
   * TTS avec OpenAI (qualité correcte, rapide)
   */
  private async speakWithOpenAI(text: string, config: VoiceCoachConfig): Promise<Buffer> {
    const response = await this.openai.audio.speech.create({
      model: 'tts-1-hd', // ou tts-1 pour plus rapide
      voice: this.getOpenAIVoice(config.personality),
      input: text,
      speed: config.speed
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;
  }

  /**
   * TTS avec ElevenLabs (qualité supérieure, plus cher)
   */
  private async speakWithElevenLabs(text: string, config: VoiceCoachConfig): Promise<Buffer> {
    if (!this.elevenLabsKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    const voiceId = this.getElevenLabsVoice(config.personality, config.language);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.elevenLabsKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: config.personality === 'aggressive' ? 0.8 : 0.5,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Adapte le ton du message selon la personnalité
   */
  private adaptTone(text: string, personality: VoicePersonality, language: 'fr' | 'en'): string {
    if (language === 'fr') {
      switch (personality) {
        case 'calm':
          return `D'accord. ${text} Prends ton temps.`;

        case 'aggressive':
          return `Allez ! ${text} Sois plus agressif, faut y aller !`;

        case 'pro':
          return text; // Neutre et professionnel

        case 'funny':
          const funnyIntros = [
            'Hé mon pote,',
            'Écoute bien,',
            'Attention petit scarabée,',
            'Regarde moi ça,'
          ];
          const intro = funnyIntros[Math.floor(Math.random() * funnyIntros.length)];
          return `${intro} ${text.toLowerCase()} 😄`;

        default:
          return text;
      }
    } else {
      // English
      switch (personality) {
        case 'calm':
          return `Alright. ${text} Take your time.`;

        case 'aggressive':
          return `Come on! ${text} Be more aggressive, let's go!`;

        case 'pro':
          return text;

        case 'funny':
          return `Hey buddy, ${text.toLowerCase()} 😄`;

        default:
          return text;
      }
    }
  }

  /**
   * Sélectionne la voix OpenAI selon la personnalité
   */
  private getOpenAIVoice(personality: VoicePersonality): 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' {
    switch (personality) {
      case 'calm':
        return 'nova'; // Voix douce et calme

      case 'aggressive':
        return 'onyx'; // Voix masculine énergique

      case 'pro':
        return 'alloy'; // Voix professionnelle neutre

      case 'funny':
        return 'fable'; // Voix chaleureuse

      default:
        return 'alloy';
    }
  }

  /**
   * Sélectionne la voix ElevenLabs selon la personnalité
   */
  private getElevenLabsVoice(personality: VoicePersonality, language: 'fr' | 'en'): string {
    // IDs de voix ElevenLabs (à remplacer par vos voix custom)
    if (language === 'fr') {
      switch (personality) {
        case 'calm':
          return 'XB0fDUnXU5powFXDhCwa'; // Charlotte - calme
        case 'aggressive':
          return 'pNInz6obpgDQGcFmaJgB'; // Adam - énergique
        case 'pro':
          return '21m00Tcm4TlvDq8ikWAM'; // Rachel - professionnelle
        case 'funny':
          return 'yoZ06aMxZJJ28mfd3POQ'; // Sam - amusante
        default:
          return '21m00Tcm4TlvDq8ikWAM';
      }
    }

    // Anglais par défaut
    return '21m00Tcm4TlvDq8ikWAM';
  }

  /**
   * Génère un conseil vocal contextuel pour une main
   */
  async generateHandAdviceVoice(
    handAnalysis: any,
    config: VoiceCoachConfig
  ): Promise<Buffer> {
    // Extraire le conseil le plus important
    const mainAdvice = handAnalysis.suggestions[0] || 'Bonne décision !';

    // Simplifier pour le vocal (plus court qu'à l'écrit)
    let vocalAdvice: string;

    if (handAnalysis.isOptimal) {
      vocalAdvice = config.language === 'fr'
        ? 'Parfait ! Continue comme ça.'
        : 'Perfect! Keep it up.';
    } else if (handAnalysis.mistakes.length > 0) {
      const mistake = handAnalysis.mistakes[0];

      if (config.language === 'fr') {
        switch (mistake.severity) {
          case 'critical':
            vocalAdvice = `Attention ! ${this.simplifySuggestion(mainAdvice)}`;
            break;
          case 'major':
            vocalAdvice = `Erreur importante. ${this.simplifySuggestion(mainAdvice)}`;
            break;
          default:
            vocalAdvice = this.simplifySuggestion(mainAdvice);
        }
      } else {
        switch (mistake.severity) {
          case 'critical':
            vocalAdvice = `Watch out! ${this.simplifySuggestion(mainAdvice)}`;
            break;
          case 'major':
            vocalAdvice = `Major mistake. ${this.simplifySuggestion(mainAdvice)}`;
            break;
          default:
            vocalAdvice = this.simplifySuggestion(mainAdvice);
        }
      }
    } else {
      vocalAdvice = this.simplifySuggestion(mainAdvice);
    }

    return await this.speakAdvice(vocalAdvice, config);
  }

  /**
   * Simplifie un texte pour le rendre plus adapté au vocal
   */
  private simplifySuggestion(text: string): string {
    // Retirer les stats et chiffres complexes
    let simplified = text
      .replace(/\d+\.\d+%/g, '') // Enlever pourcentages précis
      .replace(/\([^)]*\)/g, '') // Enlever parenthèses
      .trim();

    // Raccourcir si trop long
    if (simplified.length > 100) {
      simplified = simplified.substring(0, 100) + '...';
    }

    return simplified;
  }

  /**
   * Génère un message de début de session
   */
  async speakSessionStart(
    username: string,
    mode: string,
    config: VoiceCoachConfig
  ): Promise<Buffer> {
    const messages = {
      fr: {
        calm: `Salut ${username}. Je suis ton coach en mode ${mode}. Prends ton temps et concentre-toi.`,
        aggressive: `Yo ${username} ! C'est parti en mode ${mode} ! On va tout déchirer !`,
        pro: `Bonjour ${username}. Coach activé en mode ${mode}. Bonne session.`,
        funny: `Hey ${username} ! Prêt à devenir une légende ? Mode ${mode} activé ! Let's go !`
      },
      en: {
        calm: `Hi ${username}. I'm your coach in ${mode} mode. Take your time and focus.`,
        aggressive: `Yo ${username}! Let's go in ${mode} mode! We're gonna crush it!`,
        pro: `Hello ${username}. Coach activated in ${mode} mode. Good session.`,
        funny: `Hey ${username}! Ready to become a legend? ${mode} mode activated! Let's go!`
      }
    };

    const message = messages[config.language][config.personality];
    return await this.speakAdvice(message, config);
  }

  /**
   * Génère une alerte de tilt
   */
  async speakTiltAlert(config: VoiceCoachConfig): Promise<Buffer> {
    const alerts = {
      fr: [
        'Stop ! Je détecte du tilt. Prends une pause de 10 minutes.',
        'Attention, tu es en train de tilter. Respire profondément.',
        'Pause ! Ton niveau de jeu vient de chuter. Recentre-toi.'
      ],
      en: [
        'Stop! I detect tilt. Take a 10-minute break.',
        'Warning, you are tilting. Take a deep breath.',
        'Pause! Your level of play just dropped. Refocus.'
      ]
    };

    const alert = alerts[config.language][Math.floor(Math.random() * alerts[config.language].length)];
    return await this.speakAdvice(alert, config);
  }
}
