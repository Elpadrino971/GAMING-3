import { PRO_PLAYERS_DATABASE } from './pro-data';

/**
 * Stats d'un joueur à matcher
 */
export interface PlayerStats {
  vpip: number;
  pfr: number;
  aggressionFactor: number;
  threebet?: number;
  cbet?: number;
  handsPlayed?: number;
  winRate?: number;
}

/**
 * Résultat du matching
 */
export interface ProMatch {
  proId: string;
  proName: string;
  similarity: number; // 0-100
  matchingTraits: string[];
  differences: string[];
  recommendation: string;
}

/**
 * Classe pour matcher le style d'un joueur avec des pros similaires
 */
export class ProMatcher {
  /**
   * Trouve les pros qui jouent de façon similaire au joueur
   */
  findSimilarPros(playerStats: PlayerStats, topN: number = 3): ProMatch[] {
    const matches: ProMatch[] = [];

    for (const pro of PRO_PLAYERS_DATABASE) {
      const similarity = this.calculateSimilarity(playerStats, pro.stats);
      const analysis = this.analyzeMatch(playerStats, pro.stats);

      matches.push({
        proId: pro.id,
        proName: pro.name,
        similarity,
        matchingTraits: analysis.matching,
        differences: analysis.differences,
        recommendation: this.generateRecommendation(pro, similarity, analysis)
      });
    }

    // Trier par similarité décroissante
    return matches.sort((a, b) => b.similarity - a.similarity).slice(0, topN);
  }

  /**
   * Recommande le meilleur coach pour améliorer le joueur
   */
  recommendCoachForImprovement(playerStats: PlayerStats): ProMatch {
    // Analyser les faiblesses du joueur
    const weaknesses = this.identifyWeaknesses(playerStats);

    // Trouver le pro qui peut le mieux aider avec ces faiblesses
    let bestCoach: ProMatch | null = null;
    let bestScore = 0;

    for (const pro of PRO_PLAYERS_DATABASE) {
      let score = 0;

      // Score basé sur les spécialités du pro vs faiblesses du joueur
      for (const weakness of weaknesses) {
        if (pro.specialty.some(s => this.specialtyMatchesWeakness(s, weakness))) {
          score += 20;
        }
      }

      // Bonus si le pro a un style complémentaire (pas trop similaire)
      const similarity = this.calculateSimilarity(playerStats, pro.stats);
      if (similarity < 70) {
        score += (100 - similarity) / 5; // Bonus pour différence
      }

      if (score > bestScore) {
        bestScore = score;
        const analysis = this.analyzeMatch(playerStats, pro.stats);
        bestCoach = {
          proId: pro.id,
          proName: pro.name,
          similarity,
          matchingTraits: analysis.matching,
          differences: analysis.differences,
          recommendation: this.generateImprovementRecommendation(pro, weaknesses)
        };
      }
    }

    return bestCoach!;
  }

  /**
   * Calcule la similarité entre un joueur et un pro (0-100)
   */
  private calculateSimilarity(playerStats: PlayerStats, proStats: any): number {
    let totalDifference = 0;
    let weights = 0;

    // VPIP (poids: 25%)
    const vpipDiff = Math.abs(playerStats.vpip - proStats.vpipAvg);
    totalDifference += vpipDiff * 0.25;
    weights += 0.25;

    // PFR (poids: 25%)
    const pfrDiff = Math.abs(playerStats.pfr - proStats.pfrAvg);
    totalDifference += pfrDiff * 0.25;
    weights += 0.25;

    // Aggression Factor (poids: 20%)
    const aggDiff = Math.abs(playerStats.aggressionFactor - proStats.aggressionFactor);
    totalDifference += (aggDiff / 4) * 20 * 0.20; // Normaliser sur 0-100
    weights += 0.20;

    // 3-bet (poids: 15%)
    if (playerStats.threebet && proStats.threebet) {
      const threebetDiff = Math.abs(playerStats.threebet - proStats.threebet);
      totalDifference += threebetDiff * 0.15;
      weights += 0.15;
    }

    // C-bet (poids: 15%)
    if (playerStats.cbet && proStats.cbet) {
      const cbetDiff = Math.abs(playerStats.cbet - proStats.cbet);
      totalDifference += cbetDiff * 0.15;
      weights += 0.15;
    }

    // Convertir en score de similarité (0-100)
    const maxPossibleDiff = 100; // Maximum theoretical difference
    const similarity = Math.max(0, 100 - (totalDifference / weights) * (100 / maxPossibleDiff));

    return Math.round(similarity);
  }

  /**
   * Analyse les traits qui matchent et ceux qui diffèrent
   */
  private analyzeMatch(playerStats: PlayerStats, proStats: any): {
    matching: string[];
    differences: string[];
  } {
    const matching: string[] = [];
    const differences: string[] = [];

    // VPIP
    const vpipDiff = Math.abs(playerStats.vpip - proStats.vpipAvg);
    if (vpipDiff < 5) {
      matching.push(`Similar hand selection (VPIP ${playerStats.vpip}% vs ${proStats.vpipAvg}%)`);
    } else {
      const direction = playerStats.vpip > proStats.vpipAvg ? 'looser' : 'tighter';
      differences.push(`You play ${direction} (VPIP ${playerStats.vpip}% vs ${proStats.vpipAvg}%)`);
    }

    // PFR
    const pfrDiff = Math.abs(playerStats.pfr - proStats.pfrAvg);
    if (pfrDiff < 5) {
      matching.push(`Similar aggression pre-flop (PFR ${playerStats.pfr}% vs ${proStats.pfrAvg}%)`);
    } else {
      const direction = playerStats.pfr > proStats.pfrAvg ? 'more aggressive' : 'more passive';
      differences.push(`You're ${direction} pre-flop (PFR ${playerStats.pfr}% vs ${proStats.pfrAvg}%)`);
    }

    // Aggression Factor
    const aggDiff = Math.abs(playerStats.aggressionFactor - proStats.aggressionFactor);
    if (aggDiff < 0.5) {
      matching.push(`Similar post-flop aggression (AF ${playerStats.aggressionFactor.toFixed(1)} vs ${proStats.aggressionFactor.toFixed(1)})`);
    } else {
      const direction = playerStats.aggressionFactor > proStats.aggressionFactor ? 'more aggressive' : 'more passive';
      differences.push(`You're ${direction} post-flop (AF ${playerStats.aggressionFactor.toFixed(1)} vs ${proStats.aggressionFactor.toFixed(1)})`);
    }

    // VPIP/PFR Gap
    const playerGap = playerStats.vpip - playerStats.pfr;
    const proGap = proStats.vpipAvg - proStats.pfrAvg;
    if (Math.abs(playerGap - proGap) < 3) {
      matching.push(`Similar playing style (VPIP-PFR gap: ${playerGap}% vs ${proGap}%)`);
    }

    return { matching, differences };
  }

  /**
   * Identifie les faiblesses d'un joueur
   */
  private identifyWeaknesses(stats: PlayerStats): string[] {
    const weaknesses: string[] = [];

    // Trop loose
    if (stats.vpip > 35) {
      weaknesses.push('too_loose');
    }

    // Trop tight
    if (stats.vpip < 15) {
      weaknesses.push('too_tight');
    }

    // Trop passif (VPIP-PFR gap > 10)
    const gap = stats.vpip - stats.pfr;
    if (gap > 10) {
      weaknesses.push('too_passive_preflop');
    }

    // Pas assez agressif post-flop
    if (stats.aggressionFactor < 2.0) {
      weaknesses.push('not_aggressive_enough');
    }

    // Trop agressif
    if (stats.aggressionFactor > 4.0) {
      weaknesses.push('too_aggressive');
    }

    // 3-bet trop faible
    if (stats.threebet && stats.threebet < 5) {
      weaknesses.push('low_threebet');
    }

    // C-bet trop élevé
    if (stats.cbet && stats.cbet > 80) {
      weaknesses.push('over_cbetting');
    }

    return weaknesses;
  }

  /**
   * Vérifie si une spécialité de pro correspond à une faiblesse
   */
  private specialtyMatchesWeakness(specialty: string, weakness: string): boolean {
    const matchMap: Record<string, string[]> = {
      'Range reading': ['too_loose', 'too_tight'],
      'Position play': ['too_passive_preflop', 'positional_mistakes'],
      'Aggressive play': ['too_passive_preflop', 'not_aggressive_enough'],
      'GTO strategy': ['not_balanced', 'exploitable'],
      'Tournament strategy': ['poor_icm', 'bubble_mistakes'],
      'Cash game mastery': ['bankroll_issues', 'cash_specific'],
      'Mental game': ['tilt_issues', 'emotional_control'],
      'Bluffing': ['not_aggressive_enough', 'predictable'],
      'Value betting': ['missed_value', 'thin_value']
    };

    return matchMap[specialty]?.includes(weakness) || false;
  }

  /**
   * Génère une recommandation personnalisée
   */
  private generateRecommendation(pro: any, similarity: number, analysis: any): string {
    if (similarity >= 80) {
      return `You play very similarly to ${pro.name}! Study their advanced techniques to refine your ${pro.playStyle} style. Focus on: ${pro.specialty.join(', ')}.`;
    } else if (similarity >= 60) {
      return `Your style resembles ${pro.name}'s ${pro.playStyle} approach. Learn from their ${pro.specialty[0]} expertise to improve your game.`;
    } else {
      return `${pro.name}'s ${pro.playStyle} style is different from yours, but their ${pro.specialty[0]} skills could help you develop new dimensions in your game.`;
    }
  }

  /**
   * Génère une recommandation d'amélioration
   */
  private generateImprovementRecommendation(pro: any, weaknesses: string[]): string {
    const weaknessText = weaknesses.join(', ').replace(/_/g, ' ');
    return `${pro.name} is the perfect coach to help you improve. Their expertise in ${pro.specialty.join(' and ')} will directly address your areas of improvement: ${weaknessText}. With their ${pro.playStyle} approach, you'll learn to play more optimally.`;
  }

  /**
   * Détermine le style de jeu du joueur
   */
  getPlayerStyle(stats: PlayerStats): string {
    const vpip = stats.vpip;
    const pfr = stats.pfr;
    const gap = vpip - pfr;

    // TAG (Tight-Aggressive)
    if (vpip <= 25 && pfr >= 18 && gap < 10) {
      return 'Tight-Aggressive (TAG)';
    }

    // LAG (Loose-Aggressive)
    if (vpip >= 28 && pfr >= 22 && gap < 12) {
      return 'Loose-Aggressive (LAG)';
    }

    // Nit (Super Tight)
    if (vpip < 18) {
      return 'Nit (Too Tight)';
    }

    // Calling Station (Passive)
    if (gap > 12) {
      return 'Calling Station (Too Passive)';
    }

    // Maniac
    if (vpip > 35 && stats.aggressionFactor > 3.5) {
      return 'Maniac (Too Loose & Aggressive)';
    }

    // LAP (Loose-Passive)
    if (vpip > 30 && gap > 10) {
      return 'Loose-Passive (LAP)';
    }

    return 'Balanced/Mixed Style';
  }
}
