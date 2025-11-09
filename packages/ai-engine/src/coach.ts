/**
 * Coach IA - Génère des conseils personnalisés
 * Utilise OpenAI pour des conseils adaptatifs et pédagogiques
 */

import OpenAI from 'openai';
import {
  CoachingAdvice,
  CoachMode,
  HandAnalysis,
  SessionAnalysis,
  PlayerStats,
  Priority,
  AdviceCategory,
  EmotionalState
} from './types';

export class AICoach {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Génère un conseil pour une main spécifique
   */
  async generateHandAdvice(
    analysis: HandAnalysis,
    mode: CoachMode,
    playerLevel: string
  ): Promise<CoachingAdvice[]> {
    const advice: CoachingAdvice[] = [];

    // Conseil immédiat basé sur les erreurs
    if (analysis.mistakes.length > 0) {
      const criticalMistakes = analysis.mistakes.filter(m => m.severity === 'critical' || m.severity === 'major');

      for (const mistake of criticalMistakes) {
        advice.push({
          mode,
          advice: analysis.suggestions[0] || mistake.description,
          priority: mistake.severity === 'critical' ? Priority.Critical : Priority.High,
          category: this.categorizeMistake(mistake.type),
          actionable: true
        });
      }
    }

    // Génération de conseils avancés via OpenAI (mode Pro et Mentor)
    if (mode === CoachMode.Pro || mode === CoachMode.Mentor) {
      const aiAdvice = await this.generateAIAdvice(analysis, playerLevel);
      advice.push(...aiAdvice);
    }

    return advice;
  }

  /**
   * Génère une analyse de session complète
   */
  async generateSessionAdvice(
    sessionAnalysis: SessionAnalysis,
    playerStats: PlayerStats,
    mode: CoachMode
  ): Promise<CoachingAdvice[]> {
    const advice: CoachingAdvice[] = [];

    // Détection de tilt
    if (sessionAnalysis.tiltDetected) {
      advice.push({
        mode,
        advice: '⚠️ Signes de tilt détectés. Prends une pause de 10 minutes pour te recentrer.',
        priority: Priority.Critical,
        category: AdviceCategory.Emotional,
        actionable: true
      });
    }

    // Conseils basés sur l'état émotionnel
    const emotionalAdvice = this.generateEmotionalAdvice(sessionAnalysis.emotionalState);
    if (emotionalAdvice) advice.push(emotionalAdvice);

    // Analyse des tendances statistiques
    const statsAdvice = this.analyzePlayerStats(playerStats);
    advice.push(...statsAdvice);

    // Conseils avancés via OpenAI pour modes Pro/Mentor
    if (mode === CoachMode.Pro || mode === CoachMode.Mentor) {
      const aiSessionAdvice = await this.generateAISessionAdvice(
        sessionAnalysis,
        playerStats,
        mode
      );
      advice.push(...aiSessionAdvice);
    }

    return advice;
  }

  /**
   * Génère des conseils via OpenAI
   */
  private async generateAIAdvice(
    analysis: HandAnalysis,
    playerLevel: string
  ): Promise<CoachingAdvice[]> {
    const prompt = this.buildHandAnalysisPrompt(analysis, playerLevel);

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Tu es un coach de poker expert et pédagogue. Ton rôle est d'aider les joueurs à progresser en leur donnant des conseils clairs, actionnables et adaptés à leur niveau.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content || '';

      return [{
        mode: CoachMode.Pro,
        advice: response,
        priority: Priority.Medium,
        category: AdviceCategory.PostFlop,
        actionable: true
      }];
    } catch (error) {
      console.error('Erreur lors de la génération de conseil IA:', error);
      return [];
    }
  }

  /**
   * Génère une analyse de session via OpenAI
   */
  private async generateAISessionAdvice(
    sessionAnalysis: SessionAnalysis,
    playerStats: PlayerStats,
    mode: CoachMode
  ): Promise<CoachingAdvice[]> {
    const prompt = this.buildSessionAnalysisPrompt(sessionAnalysis, playerStats);

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Tu es un coach de poker professionnel. Analyse cette session et fournis 3-5 conseils concrets pour améliorer le jeu du joueur.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 800
      });

      const response = completion.choices[0]?.message?.content || '';

      // Parser la réponse en plusieurs conseils
      const adviceList = this.parseAIResponse(response);

      return adviceList.map(advice => ({
        mode,
        advice,
        priority: Priority.Medium,
        category: AdviceCategory.PostFlop,
        actionable: true
      }));
    } catch (error) {
      console.error('Erreur lors de la génération de conseil de session:', error);
      return [];
    }
  }

  /**
   * Construit le prompt pour l'analyse d'une main
   */
  private buildHandAnalysisPrompt(analysis: HandAnalysis, playerLevel: string): string {
    return `
Niveau du joueur: ${playerLevel}

Analyse de la main:
- Équité: ${(analysis.equity * 100).toFixed(1)}%
- Pot odds: ${(analysis.potOdds * 100).toFixed(1)}%
- Action recommandée GTO: ${analysis.gtoRecommendation.action}
- Action du joueur: ${analysis.playerDecision.type}
- Optimal: ${analysis.isOptimal ? 'Oui' : 'Non'}
- Score d'optimalité: ${(analysis.optimality * 100).toFixed(1)}%

${analysis.mistakes.length > 0 ? `Erreurs détectées:\n${analysis.mistakes.map(m => `- ${m.description}`).join('\n')}` : ''}

Donne un conseil pédagogique clair et actionnable pour aider le joueur à comprendre la meilleure ligne à suivre dans ce type de situation. Adapte ton langage au niveau du joueur.
`;
  }

  /**
   * Construit le prompt pour l'analyse de session
   */
  private buildSessionAnalysisPrompt(
    sessionAnalysis: SessionAnalysis,
    playerStats: PlayerStats
  ): string {
    return `
Analyse de session:

Performance globale: ${sessionAnalysis.overallPerformance}/100
IDI (Indice de Décision Intelligente): ${sessionAnalysis.idi}/100
Décisions optimales: ${sessionAnalysis.optimalDecisions}
Décisions sous-optimales: ${sessionAnalysis.suboptimalDecisions}

Statistiques du joueur:
- VPIP: ${playerStats.vpip.toFixed(1)}%
- PFR: ${playerStats.pfr.toFixed(1)}%
- Aggression Factor: ${playerStats.aggressionFactor.toFixed(2)}
- C-Bet: ${playerStats.cBetPercentage.toFixed(1)}%
- Fold to C-Bet: ${playerStats.foldToCBet.toFixed(1)}%

Points forts identifiés:
${sessionAnalysis.strengths.map(s => `- ${s}`).join('\n')}

Points faibles identifiés:
${sessionAnalysis.weaknesses.map(w => `- ${w}`).join('\n')}

Domaines d'amélioration prioritaires:
${sessionAnalysis.improvementAreas.map(a => `- ${a}`).join('\n')}

Fournis 3-5 conseils concrets et actionnables pour cette session, en mettant l'accent sur les domaines d'amélioration prioritaires. Sois encourageant mais honnête.
`;
  }

  /**
   * Parse la réponse de l'IA en liste de conseils
   */
  private parseAIResponse(response: string): string[] {
    // Split par ligne ou par numérotation
    const lines = response.split('\n').filter(line => line.trim().length > 0);

    return lines
      .filter(line => /^\d+\.|^-|^•/.test(line.trim()))
      .map(line => line.replace(/^\d+\.|^-|^•/, '').trim())
      .filter(line => line.length > 10);
  }

  /**
   * Catégorise une erreur
   */
  private categorizeMistake(mistakeType: string): AdviceCategory {
    switch (mistakeType) {
      case 'poor_fold':
      case 'poor_call':
      case 'poor_bet':
      case 'poor_raise':
        return AdviceCategory.Betting;

      case 'missed_value':
        return AdviceCategory.ValueBetting;

      case 'over_bluff':
      case 'under_bluff':
        return AdviceCategory.Bluffing;

      case 'sizing_error':
        return AdviceCategory.Betting;

      default:
        return AdviceCategory.PostFlop;
    }
  }

  /**
   * Génère des conseils basés sur l'état émotionnel
   */
  private generateEmotionalAdvice(state: EmotionalState): CoachingAdvice | null {
    switch (state) {
      case EmotionalState.Tilted:
        return {
          mode: CoachMode.Light,
          advice: '🔴 Tilt détecté ! Arrête-toi maintenant et prends une pause. Tu ne joues plus de façon optimale.',
          priority: Priority.Critical,
          category: AdviceCategory.Emotional,
          actionable: true
        };

      case EmotionalState.Frustrated:
        return {
          mode: CoachMode.Light,
          advice: '⚠️ Tu sembles frustré. Respire profondément et concentre-toi sur les bonnes décisions, pas sur les résultats.',
          priority: Priority.High,
          category: AdviceCategory.Emotional,
          actionable: true
        };

      case EmotionalState.Anxious:
        return {
          mode: CoachMode.Light,
          advice: '💙 Détends-toi. Fais confiance à ton analyse et joue un coup à la fois.',
          priority: Priority.Medium,
          category: AdviceCategory.Emotional,
          actionable: true
        };

      case EmotionalState.Excited:
        return {
          mode: CoachMode.Light,
          advice: '⚡ Bien joué ! Garde ton calme et reste concentré sur la stratégie.',
          priority: Priority.Low,
          category: AdviceCategory.Emotional,
          actionable: false
        };

      default:
        return null;
    }
  }

  /**
   * Analyse les statistiques du joueur et génère des conseils
   */
  private analyzePlayerStats(stats: PlayerStats): CoachingAdvice[] {
    const advice: CoachingAdvice[] = [];

    // VPIP trop élevé
    if (stats.vpip > 35) {
      advice.push({
        mode: CoachMode.Pro,
        advice: `Ton VPIP de ${stats.vpip.toFixed(1)}% est trop élevé. Essaye de resserrer ton jeu pre-flop et de ne jouer que des mains solides.`,
        priority: Priority.High,
        category: AdviceCategory.PreFlop,
        actionable: true
      });
    }

    // VPIP trop bas
    if (stats.vpip < 15) {
      advice.push({
        mode: CoachMode.Pro,
        advice: `Ton VPIP de ${stats.vpip.toFixed(1)}% est très tight. Tu peux élargir légèrement ton range, surtout en position.`,
        priority: Priority.Medium,
        category: AdviceCategory.PreFlop,
        actionable: true
      });
    }

    // PFR/VPIP ratio
    const pfrVpipRatio = stats.pfr / stats.vpip;
    if (pfrVpipRatio < 0.5) {
      advice.push({
        mode: CoachMode.Pro,
        advice: `Tu calls trop et raise pas assez pre-flop. Ton ratio PFR/VPIP de ${pfrVpipRatio.toFixed(2)} devrait être autour de 0.7-0.8.`,
        priority: Priority.High,
        category: AdviceCategory.PreFlop,
        actionable: true
      });
    }

    // Aggression Factor
    if (stats.aggressionFactor < 1.5) {
      advice.push({
        mode: CoachMode.Pro,
        advice: `Ton facteur d'aggression de ${stats.aggressionFactor.toFixed(2)} est trop passif. Bet et raise plus souvent pour mettre la pression.`,
        priority: Priority.High,
        category: AdviceCategory.Betting,
        actionable: true
      });
    }

    if (stats.aggressionFactor > 4) {
      advice.push({
        mode: CoachMode.Pro,
        advice: `Ton facteur d'aggression de ${stats.aggressionFactor.toFixed(2)} est très élevé. Attention à ne pas over-bluffer.`,
        priority: Priority.Medium,
        category: AdviceCategory.Bluffing,
        actionable: true
      });
    }

    // C-Bet trop élevé
    if (stats.cBetPercentage > 70) {
      advice.push({
        mode: CoachMode.Pro,
        advice: `Tu c-bet ${stats.cBetPercentage.toFixed(1)}% du temps, c'est trop. Vise plutôt 50-60% selon les situations.`,
        priority: Priority.Medium,
        category: AdviceCategory.PostFlop,
        actionable: true
      });
    }

    return advice;
  }

  /**
   * Génère un plan d'apprentissage personnalisé
   */
  async generateLearningPath(
    playerStats: PlayerStats,
    sessionHistory: SessionAnalysis[]
  ): Promise<string[]> {
    const weaknesses = this.identifyWeaknesses(playerStats, sessionHistory);

    const prompt = `
Statistiques du joueur:
- VPIP: ${playerStats.vpip.toFixed(1)}%
- PFR: ${playerStats.pfr.toFixed(1)}%
- Aggression Factor: ${playerStats.aggressionFactor.toFixed(2)}
- C-Bet: ${playerStats.cBetPercentage.toFixed(1)}%

Faiblesses identifiées:
${weaknesses.join('\n')}

Crée un plan d'apprentissage personnalisé en 5 étapes progressives pour améliorer le jeu de ce joueur.
Chaque étape doit être concrète, actionnable et mesurable.
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Tu es un coach de poker professionnel créant des plans d\'apprentissage personnalisés.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      });

      const response = completion.choices[0]?.message?.content || '';
      return this.parseAIResponse(response);
    } catch (error) {
      console.error('Erreur génération learning path:', error);
      return [];
    }
  }

  /**
   * Identifie les faiblesses du joueur
   */
  private identifyWeaknesses(
    stats: PlayerStats,
    sessionHistory: SessionAnalysis[]
  ): string[] {
    const weaknesses: string[] = [];

    // Analyse des stats
    if (stats.vpip > 35) weaknesses.push('Jeu pre-flop trop loose');
    if (stats.pfr / stats.vpip < 0.5) weaknesses.push('Trop passif pre-flop');
    if (stats.aggressionFactor < 1.5) weaknesses.push('Manque d\'agressivité post-flop');
    if (stats.cBetPercentage > 70) weaknesses.push('C-bet trop fréquent');
    if (stats.foldToCBet > 70) weaknesses.push('Fold trop souvent aux c-bets');

    // Analyse de l'historique
    const avgIDI = sessionHistory.reduce((sum, s) => sum + s.idi, 0) / sessionHistory.length;
    if (avgIDI < 60) weaknesses.push('IDI global faible - décisions sous-optimales fréquentes');

    const tiltFrequency = sessionHistory.filter(s => s.tiltDetected).length / sessionHistory.length;
    if (tiltFrequency > 0.3) weaknesses.push('Gestion émotionnelle à améliorer');

    return weaknesses;
  }
}
