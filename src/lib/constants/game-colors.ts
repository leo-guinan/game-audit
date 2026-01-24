/**
 * Centralized game color constants for MetaSPN
 * Used across all components for consistent color coding
 */

import type { Game } from "@/lib/types/metaspn";

export const GAME_COLORS: Record<Game, string> = {
  G1: '#c41e3a', // red
  G2: '#d4af37', // gold
  G3: '#4a90e2', // blue
  G4: '#9d7cd8', // purple
  G5: '#50c878', // green
  G6: '#f4a460', // sandy brown
};

/**
 * Get game color with optional opacity
 */
export function getGameColor(game: Game, opacity: number = 1): string {
  const color = GAME_COLORS[game];
  if (opacity === 1) return color;
  
  // Convert hex to rgba
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
