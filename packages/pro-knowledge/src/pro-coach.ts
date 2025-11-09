/**
 * Pro Coach - Coach IA qui imite le style d'un joueur pro
 * Utilise les conseils et le style de jeu des meilleurs joueurs
 */

import OpenAI from 'openai';
import { PRO_PLAYERS_DATABASE, getProById, getAllTips } from './pro-data';
import { ProPlayer, ProTip } from './types';

export class ProCoach {
  private openai: OpenAI;
  private proPlayer: any;

  constructor(openaiKey: string, proPlayerId: string) {
    this.openai = new OpenAI({ apiKey: openaiKey });
    this.proPlayer = getProById(proPlayerId);

    if (!this.proPlayer) {
      throw new Error(`Pro player ${proPlayerId} not found`);
    }
  }

  /**
   * Génère un conseil dans le style du pro
   */
  async generateAdvice(
    handAnalysis: any,
    situation: string
  ): Promise<string> {
    // Trouver des tips pertinents du pro
    const relevantTips = this.findRelevantTips(situation);

    // Construire le prompt avec le style du pro
    const prompt = this.buildProStylePrompt(handAnalysis, situation, relevantTips);

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt()
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 300
    });

    return completion.choices[0]?.message?.content || '';
  }

  /**
   * Analyse une main comme le ferait le pro
   */
  async analyzeHandAsPro(handState: any): Promise<{
    action: string;
    reasoning: string;
    confidence: number;
  }> {
    const prompt = `
Tu es ${this.proPlayer.name}. Analyse cette situation de poker:

Position: ${handState.position}
Cartes: ${JSON.stringify(handState.holeCards)}
Board: ${JSON.stringify(handState.communityCards)}
Pot: ${handState.pot}
Stack: ${handState.stackSize}
Adversaires: ${handState.numPlayers}

Ton style: ${this.proPlayer.playStyle}
Tes stats typiques: VPIP ${this.proPlayer.vpipAvg}%, PFR ${this.proPlayer.pfrAvg}%

Que fais-tu et pourquoi ? Sois concret et dans ton style personnel.
`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt()
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const response = completion.choices[0]?.message?.content || '';

    // Extraire l'action (simplifié)
    const action = this.extractAction(response);

    return {
      action,
      reasoning: response,
      confidence: 0.8
    };
  }

  /**
   * Compare le jeu du joueur avec ce que le pro aurait fait
   */
  async compareWithPro(
    handState: any,
    playerAction: string
  ): Promise<{
    proAction: string;
    proReasoning: string;
    comparison: string;
    evDifference: number;
    grade: string;
  }> {
    // Ce que le pro aurait fait
    const proDecision = await this.analyzeHandAsPro(handState);

    // Comparer
    const isSameAction = this.normalizeAction(playerAction) === this.normalizeAction(proDecision.action);

    const prompt = `
${this.proPlayer.name}, le joueur a ${playerAction} dans cette situation.
Tu aurais ${proDecision.action}.

Compare ces deux actions. Si c'est la même, félicite. Si c'est différent, explique pourquoi ta ligne est meilleure.

Sois dans ton style: ${this.getPersonalityTraits()}
`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt()
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 250
    });

    const comparison = completion.choices[0]?.message?.content || '';

    // Estimer la différence d'EV (simplifié)
    const evDifference = isSameAction ? 0 : this.estimateEVDifference(playerAction, proDecision.action, handState);

    // Grade
    let grade = 'A';
    if (!isSameAction) {
      if (Math.abs(evDifference) > 10) grade = 'D';
      else if (Math.abs(evDifference) > 5) grade = 'C';
      else grade = 'B';
    }

    return {
      proAction: proDecision.action,
      proReasoning: proDecision.reasoning,
      comparison,
      evDifference,
      grade
    };
  }

  /**
   * Génère un learning path personnalisé basé sur le style du pro
   */
  async generateLearningPath(playerStats: any): Promise<any> {
    const weaknesses = this.identifyWeaknesses(playerStats);

    const prompt = `
Tu es ${this.proPlayer.name}. Un joueur a ces stats:
- VPIP: ${playerStats.vpip}%
- PFR: ${playerStats.pfr}%
- Aggression: ${playerStats.aggressionFactor}

Faiblesses identifiées: ${weaknesses.join(', ')}

Crée un plan d'apprentissage en 5 étapes pour l'aider à jouer plus comme toi.
Chaque étape doit être concrète et actionnable, dans ton style personnel.
`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt()
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const response = completion.choices[0]?.message?.content || '';

    return {
      proId: this.proPlayer.id,
      proName: this.proPlayer.name,
      content: response,
      estimatedDuration: 30, // heures
      difficulty: this.getStyleDifficulty()
    };
  }

  // Helpers privés

  private getSystemPrompt(): string {
    return `Tu es ${this.proPlayer.name}, surnommé "${this.proPlayer.nickname}".

Ton profil:
- Style: ${this.proPlayer.playStyle}
- Spécialités: ${this.proPlayer.specialty.join(', ')}
- Gains totaux: $${this.proPlayer.totalWinnings}M
- Bracelets WSOP: ${this.proPlayer.braceletCount}

Ta bio: ${this.proPlayer.bio}

${this.getPersonalityTraits()}

Réponds toujours dans ton style personnel. Sois authentique, comme si c'était vraiment toi qui parlais.
`;
  }

  private getPersonalityTraits(): string {
    const traits: Record<string, string> = {
      'daniel-negreanu': 'Tu es friendly et pédagogue. Tu parles beaucoup de reads et de position. Tu aimes expliquer ton raisonnement.',
      'phil-ivey': 'Tu es concis et direct. Pas de bavardage. Tu parles d\'aggression et de pressure. Very focused.',
      'fedor-holz': 'Tu es analytique et moderne. Tu parles de GTO, de mindset, et de balance. Professional.',
      'phil-hellmuth': 'Tu es confiant (overconfident même). Tu parles de "white magic" et de reads. Dramatic.',
      'vanessa-selbst': 'Tu es fearless et aggressive. Tu parles de domination et de prendre le contrôle.',
      'tom-dwan': 'Tu es créatif et audacieux. Tu aimes les bluffs et les lignes non-standard. Unpredictable.'
    };

    return traits[this.proPlayer.id] || 'Tu es professionnel et direct.';
  }

  private findRelevantTips(situation: string): any[] {
    const allTips = this.proPlayer.tips || [];

    // Filter par pertinence
    return allTips.filter((tip: any) =>
      tip.situation.toLowerCase().includes(situation.toLowerCase()) ||
      situation.toLowerCase().includes(tip.situation.toLowerCase())
    );
  }

  private buildProStylePrompt(
    handAnalysis: any,
    situation: string,
    relevantTips: any[]
  ): string {
    let prompt = `Situation: ${situation}\n\n`;

    if (handAnalysis.mistakes && handAnalysis.mistakes.length > 0) {
      prompt += `Le joueur a fait une erreur: ${handAnalysis.mistakes[0].description}\n\n`;
    }

    if (relevantTips.length > 0) {
      prompt += `Tes conseils pertinents:\n`;
      relevantTips.slice(0, 2).forEach(tip => {
        prompt += `- ${tip.title}: ${tip.content}\n`;
      });
      prompt += `\n`;
    }

    prompt += `Donne un conseil court (2-3 phrases) dans ton style personnel.`;

    return prompt;
  }

  private extractAction(response: string): string {
    const actions = ['fold', 'check', 'call', 'bet', 'raise', 'all-in'];

    for (const action of actions) {
      if (response.toLowerCase().includes(action)) {
        return action;
      }
    }

    return 'check';
  }

  private normalizeAction(action: string): string {
    return action.toLowerCase().trim();
  }

  private estimateEVDifference(
    playerAction: string,
    proAction: string,
    handState: any
  ): number {
    // Estimation simplifiée
    const actionValues: Record<string, number> = {
      'fold': 0,
      'check': 1,
      'call': 2,
      'bet': 3,
      'raise': 4
    };

    const playerValue = actionValues[this.normalizeAction(playerAction)] || 1;
    const proValue = actionValues[this.normalizeAction(proAction)] || 1;

    const diff = Math.abs(playerValue - proValue);

    // En BB
    return diff * 5;
  }

  private identifyWeaknesses(playerStats: any): string[] {
    const weaknesses: string[] = [];

    // Comparer avec les stats du pro
    if (Math.abs(playerStats.vpip - this.proPlayer.vpipAvg) > 10) {
      weaknesses.push(
        playerStats.vpip > this.proPlayer.vpipAvg ? 'VPIP trop élevé' : 'VPIP trop bas'
      );
    }

    if (Math.abs(playerStats.pfr - this.proPlayer.pfrAvg) > 8) {
      weaknesses.push(
        playerStats.pfr > this.proPlayer.pfrAvg ? 'PFR trop élevé' : 'PFR trop bas'
      );
    }

    if (Math.abs(playerStats.aggressionFactor - this.proPlayer.aggressionAvg) > 1) {
      weaknesses.push(
        playerStats.aggressionFactor > this.proPlayer.aggressionAvg
          ? 'Trop agressif'
          : 'Pas assez agressif'
      );
    }

    return weaknesses;
  }

  private getStyleDifficulty(): string {
    const difficulties: Record<string, string> = {
      'TIGHT_AGGRESSIVE': 'Intermediate',
      'LOOSE_AGGRESSIVE': 'Advanced',
      'BALANCED': 'Advanced',
      'EXPLOITATIVE': 'Intermediate',
      'MANIAC': 'Expert'
    };

    return difficulties[this.proPlayer.playStyle] || 'Intermediate';
  }
}
