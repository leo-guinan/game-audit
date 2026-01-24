/**
 * Generate static paths for Next.js static generation
 * Uses static data files to determine which pages to pre-render
 * 
 * SERVER-ONLY: This file uses server-only loader functions
 */

import "server-only";
import { loadHostsData, loadGuestsData } from "./loader";

/**
 * Get all host IDs for static generation
 */
export function getAllHostIds(): string[] {
  const hosts = loadHostsData();
  return hosts.map(h => h.host.id);
}

/**
 * Get all guest IDs for static generation
 */
export function getAllGuestIds(): string[] {
  const guests = loadGuestsData();
  return guests.map(g => g.guest.id);
}

/**
 * Check if static data is available
 */
export function hasStaticData(): boolean {
  try {
    const hosts = loadHostsData();
    const guests = loadGuestsData();
    return hosts.length > 0 || guests.length > 0;
  } catch {
    return false;
  }
}
