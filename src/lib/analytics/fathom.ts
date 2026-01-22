/**
 * Fathom Analytics tracking utilities
 */

declare global {
  interface Window {
    fathom?: {
      trackEvent: (eventId: string, options?: { value?: number }) => void;
    };
  }
}

/**
 * Track a Fathom event. Safe to call on server (no-op).
 */
export function trackFathomEvent(eventId: string, value?: number) {
  if (typeof window === "undefined" || !window.fathom) {
    return;
  }
  try {
    window.fathom.trackEvent(eventId, value !== undefined ? { value } : undefined);
  } catch (error) {
    // Fathom not loaded yet, ignore
  }
}

/**
 * Game-specific event IDs
 */
export const GameEvents = {
  // Navigation
  gameView: (gameNumber: number) => `game_${gameNumber}_view`,
  gameIntro: (gameNumber: number) => `game_${gameNumber}_intro`,
  gameFork: (gameNumber: number) => `game_${gameNumber}_fork`,
  gamePath: (gameNumber: number, pathId: string) => `game_${gameNumber}_path_${pathId}`,
  gameShared: (gameNumber: number, nodeId: string) => `game_${gameNumber}_shared_${nodeId}`,
  gameEnding: (gameNumber: number) => `game_${gameNumber}_ending`,
  
  // Path navigation
  pathClick: (gameNumber: number, from: string, to: string) => 
    `game_${gameNumber}_nav_${from}_to_${to}`,
  
  // Subscription
  subscribeAttempt: (source: string) => `subscribe_attempt_${source}`,
  subscribeSuccess: (source: string) => `subscribe_success_${source}`,
  subscribeError: (source: string) => `subscribe_error_${source}`,
} as const;
