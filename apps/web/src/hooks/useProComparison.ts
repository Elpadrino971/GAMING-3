import { useState, useEffect, useCallback } from 'react';

interface ProComparisonData {
  proAction: string;
  proReasoning: string;
  evDifference: number;
  grade: string;
  proName: string;
  proNickname: string;
  proPhotoUrl?: string;
}

interface UseProComparisonOptions {
  userId: string;
  activeProId?: string;
  autoShow?: boolean; // Afficher automatiquement après chaque action
  minEvDifference?: number; // Ne montrer que si diff EV > seuil
}

/**
 * Hook React pour gérer les comparaisons avec les pros
 */
export function useProComparison(options: UseProComparisonOptions) {
  const { userId, activeProId, autoShow = true, minEvDifference = 0 } = options;

  const [comparison, setComparison] = useState<ProComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldShow, setShouldShow] = useState(false);

  /**
   * Compare une action du joueur avec ce que le pro aurait fait
   */
  const compareAction = useCallback(async (
    handId: string,
    playerAction: string,
    handState?: any
  ) => {
    if (!activeProId) {
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // Si handState n'est pas fourni, le récupérer
      let state = handState;
      if (!state) {
        const handResponse = await fetch(`/api/hands/${handId}`);
        const handData = await handResponse.json();
        state = handData;
      }

      // Comparer avec le pro
      const response = await fetch('/api/pro-coach/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          proId: activeProId,
          handState: state,
          playerAction
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comparison');
      }

      const data = await response.json();

      if (data.success) {
        const comparisonData = data.comparison;
        setComparison(comparisonData);

        // Décider si on doit montrer la comparaison
        const evDiff = Math.abs(comparisonData.evDifference);
        if (autoShow && evDiff >= minEvDifference) {
          setShouldShow(true);
        }

        return comparisonData;
      }

      return null;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('Error comparing action:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, activeProId, autoShow, minEvDifference]);

  /**
   * Ferme la popup de comparaison
   */
  const hideComparison = useCallback(() => {
    setShouldShow(false);
  }, []);

  /**
   * Force l'affichage de la comparaison
   */
  const showComparison = useCallback(() => {
    if (comparison) {
      setShouldShow(true);
    }
  }, [comparison]);

  /**
   * Reset l'état de comparaison
   */
  const reset = useCallback(() => {
    setComparison(null);
    setShouldShow(false);
    setError(null);
  }, []);

  return {
    comparison,
    loading,
    error,
    shouldShow,
    compareAction,
    hideComparison,
    showComparison,
    reset
  };
}

/**
 * Hook pour récupérer les stats du joueur
 */
export function usePlayerStats(userId: string) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/user/stats/${userId}`);
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return { stats, loading, error };
}

/**
 * Hook pour gérer les coaches achetés
 */
export function useMyCoaches(userId: string) {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCoach, setActiveCoach] = useState<any | null>(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/pro-coach/my-coaches/${userId}`);
        const data = await response.json();

        if (data.success) {
          setCoaches(data.coaches);

          // Charger le coach actif depuis localStorage
          const savedCoachId = localStorage.getItem('activeProCoach');
          if (savedCoachId) {
            const coach = data.coaches.find((c: any) => c.id === savedCoachId);
            if (coach) {
              setActiveCoach(coach);
            }
          }

          // Si pas de coach actif mais des coaches disponibles, prendre le premier
          if (!savedCoachId && data.coaches.length > 0) {
            setActiveCoach(data.coaches[0]);
            localStorage.setItem('activeProCoach', data.coaches[0].id);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch coaches');
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, [userId]);

  const selectCoach = useCallback((coachId: string) => {
    const coach = coaches.find(c => c.id === coachId);
    if (coach) {
      setActiveCoach(coach);
      localStorage.setItem('activeProCoach', coachId);
    }
  }, [coaches]);

  const hasCoach = useCallback((coachId: string) => {
    return coaches.some(c => c.id === coachId);
  }, [coaches]);

  return {
    coaches,
    activeCoach,
    loading,
    error,
    selectCoach,
    hasCoach
  };
}

/**
 * Hook pour le style matching
 */
export function useStyleMatch(playerStats: any) {
  const [matches, setMatches] = useState<any[]>([]);
  const [playerStyle, setPlayerStyle] = useState<string>('');
  const [recommendedCoach, setRecommendedCoach] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!playerStats) return;

    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/pro-coach/style-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stats: playerStats })
        });

        const data = await response.json();

        if (data.success) {
          setMatches(data.matches);
          setPlayerStyle(data.playerStyle);
          setRecommendedCoach(data.recommendedCoach);
        }
      } catch (err) {
        console.error('Error fetching style match:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [playerStats]);

  return {
    matches,
    playerStyle,
    recommendedCoach,
    loading
  };
}
