/**
 * Validate and transform static data to ensure it matches expected formats
 * Handles both minimal data (just host/guest info) and full data (with metrics)
 */

import type { Host, HostMetrics, Guest, GuestMetrics, GuestEpisodeAppearance, Game } from "@/lib/types/metaspn";

// Local type definitions to avoid circular dependency
export interface HostData {
  host: Host;
  metrics: HostMetrics;
}

export interface GuestData {
  guest: Guest;
  metrics: GuestMetrics;
  appearances: number;
  episodes: GuestEpisodeAppearance[];
}

const GAMES: Game[] = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'];

/**
 * Validate and transform host data
 * If only basic host info is provided, returns null (needs metrics)
 */
export function validateHostData(data: unknown): HostData | null {
  if (!data || typeof data !== 'object') return null;
  
  const obj = data as Record<string, unknown>;
  
  // Check if it's the full format (has host and metrics)
  if ('host' in obj && 'metrics' in obj) {
    const host = obj.host as Host;
    const metrics = obj.metrics as HostMetrics;
    
    // Validate required fields
    if (!host?.id || !host?.name || !metrics) return null;
    
    // Ensure game_distribution has all games
    if (!metrics.game_distribution) {
      metrics.game_distribution = { G1: 0, G2: 0, G3: 0, G4: 0, G5: 0, G6: 0 };
    } else {
      // Ensure all games are present
      GAMES.forEach(game => {
        if (!(game in metrics.game_distribution)) {
          metrics.game_distribution[game] = 0;
        }
      });
    }
    
    return { host, metrics };
  }
  
  // If it's just basic host info, return null (needs metrics to be useful)
  return null;
}

/**
 * Validate and transform guest data
 * If only basic guest info is provided, returns null (needs metrics)
 */
export function validateGuestData(data: unknown): GuestData | null {
  if (!data || typeof data !== 'object') return null;
  
  const obj = data as Record<string, unknown>;
  
  // Check if it's the full format (has guest, metrics, appearances, episodes)
  if ('guest' in obj && 'metrics' in obj && 'appearances' in obj && 'episodes' in obj) {
    const guest = obj.guest as Guest;
    const metrics = obj.metrics as GuestMetrics;
    const appearances = obj.appearances as number;
    const episodes = obj.episodes as GuestEpisodeAppearance[];
    
    // Validate required fields
    if (!guest?.id || !guest?.name || !metrics) return null;
    
    return { guest, metrics, appearances, episodes };
  }
  
  // If it's just basic guest info, return null (needs metrics to be useful)
  return null;
}

/**
 * Transform minimal host data (just Host object) to indicate it needs metrics
 */
export function isMinimalHostData(data: unknown): data is Host {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return 'id' in obj && 'name' in obj && !('metrics' in obj);
}

/**
 * Transform minimal guest data (just Guest object) to indicate it needs metrics
 */
export function isMinimalGuestData(data: unknown): data is Guest {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return 'id' in obj && 'name' in obj && !('metrics' in obj);
}
