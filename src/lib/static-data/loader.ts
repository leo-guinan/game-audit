/**
 * Static data loader for MetaSPN
 * Loads JSON data files that can be built as part of static build process
 */

import * as fs from "fs";
import * as path from "path";
import type { Host, HostMetrics, Guest, GuestMetrics, GuestEpisodeAppearance } from "@/lib/types/metaspn";
import { validateHostData, validateGuestData } from "./validate-and-transform";

const STATIC_DATA_DIR = path.join(process.cwd(), "src/lib/static-data");

function readJson<T>(filePath: string): T | null {
  try {
    const fullPath = path.join(STATIC_DATA_DIR, filePath);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const raw = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

// Host data structure
export interface HostData {
  host: Host;
  metrics: HostMetrics;
}

// Guest data structure
export interface GuestData {
  guest: Guest;
  metrics: GuestMetrics;
  appearances: number;
  episodes: GuestEpisodeAppearance[];
}

// Podcast-Host mapping
export interface PodcastHostMapping {
  podcast_id: string;
  host_id: string;
}

// Guest appearance data
export interface GuestAppearanceData {
  episode_id: string;
  podcast_id: string;
  guest_id: string;
  guest_name: string;
  delta_entropy: number;
  delta_drift: number;
  game_shift?: { from: string; to: string };
}

/**
 * Load all hosts data
 * Filters out entries that don't have full metrics (only basic host info)
 */
export function loadHostsData(): HostData[] {
  const data = readJson<unknown[]>("hosts.json");
  if (!data) return [];
  
  return data
    .map(validateHostData)
    .filter((item): item is HostData => item !== null);
}

/**
 * Load a specific host by ID
 */
export function loadHostData(hostId: string): HostData | null {
  const hosts = loadHostsData();
  return hosts.find(h => h.host.id === hostId) ?? null;
}

/**
 * Load all guests data
 * Filters out entries that don't have full metrics (only basic guest info)
 */
export function loadGuestsData(): GuestData[] {
  const data = readJson<unknown[]>("guests.json");
  if (!data) return [];
  
  return data
    .map(validateGuestData)
    .filter((item): item is GuestData => item !== null);
}

/**
 * Load a specific guest by ID
 */
export function loadGuestData(guestId: string): GuestData | null {
  const guests = loadGuestsData();
  return guests.find(g => g.guest.id === guestId) ?? null;
}

/**
 * Load podcast-host mappings
 */
export function loadPodcastHostMappings(): PodcastHostMapping[] {
  const data = readJson<PodcastHostMapping[]>("podcast-hosts.json");
  return data ?? [];
}

/**
 * Get host ID for a podcast
 */
export function getHostIdForPodcast(podcastId: string): string | null {
  const mappings = loadPodcastHostMappings();
  const mapping = mappings.find(m => m.podcast_id === podcastId);
  return mapping?.host_id ?? null;
}

/**
 * Get all podcasts for a host
 */
export function getPodcastsForHost(hostId: string): string[] {
  const mappings = loadPodcastHostMappings();
  return mappings.filter(m => m.host_id === hostId).map(m => m.podcast_id);
}

/**
 * Load guest appearances data
 */
export function loadGuestAppearances(): GuestAppearanceData[] {
  const data = readJson<GuestAppearanceData[]>("guest-appearances.json");
  return data ?? [];
}

/**
 * Get appearances for a specific guest
 */
export function getGuestAppearances(guestId: string): GuestAppearanceData[] {
  const appearances = loadGuestAppearances();
  return appearances.filter(a => a.guest_id === guestId);
}

/**
 * Get appearances for a specific episode
 */
export function getEpisodeAppearances(episodeId: string): GuestAppearanceData[] {
  const appearances = loadGuestAppearances();
  return appearances.filter(a => a.episode_id === episodeId);
}

/**
 * Check if static data files exist
 */
export function hasStaticData(): boolean {
  const files = ["hosts.json", "guests.json", "podcast-hosts.json", "guest-appearances.json"];
  return files.every(file => {
    const fullPath = path.join(STATIC_DATA_DIR, file);
    return fs.existsSync(fullPath);
  });
}
