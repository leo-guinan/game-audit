/**
 * MetaSPN data source: live SQLite or test-data JSON.
 * Try DB first when PODCAST_DB_PATH is set / DB available; else load from test-data.
 */

import * as fs from "fs";
import * as path from "path";
import { isDbAvailable, getAllPodcasts, getEpisodesByPodcast, getEpisodeById, getClassificationsByPodcast, getClassificationByEpisode, getGeometryByPodcast, getGeometryByEpisode, getEpisodesByGame, getBoundaryEpisodes } from "./podcast-db";
import { buildPodcastOverview, buildEpisodePage, buildCompare, mapPodcast, mapEpisode, mapGeometry } from "./podcast-db/map-to-metaspn";
import type { PodcastOverviewResponse, EpisodePageResponse, CompareResponse } from "./types/metaspn";
import type { Episode, EpisodeGeometry, Podcast } from "./types/metaspn";

const TEST_DATA_DIR = path.join(process.cwd(), "src/lib/test-data");

function readJson<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function useLiveDb(): boolean {
  return isDbAvailable();
}

export function getAllPodcastsData(): Array<{ podcast: PodcastOverviewResponse["podcast"]; metrics: PodcastOverviewResponse["metrics"] }> {
  if (useLiveDb()) {
    const podcasts = getAllPodcasts();
    return podcasts.map((p) => {
      const episodes = getEpisodesByPodcast(p.podcast_id);
      const classifications = getClassificationsByPodcast(p.podcast_id);
      const geometries = getGeometryByPodcast(p.podcast_id);
      const overview = buildPodcastOverview(p, episodes, classifications, geometries);
      return { podcast: overview.podcast, metrics: overview.metrics };
    });
  }
  const index = readJson<Array<{ podcast: PodcastOverviewResponse["podcast"]; metrics: PodcastOverviewResponse["metrics"] }>>(
    path.join(TEST_DATA_DIR, "podcasts-index.json")
  );
  return index ?? [];
}

export function getPodcastOverview(id: string): PodcastOverviewResponse | null {
  if (useLiveDb()) {
    const podcasts = getAllPodcasts();
    const p = podcasts.find((x) => x.podcast_id === id);
    if (!p) return null;
    const episodes = getEpisodesByPodcast(id);
    const classifications = getClassificationsByPodcast(id);
    const geometries = getGeometryByPodcast(id);
    return buildPodcastOverview(p, episodes, classifications, geometries);
  }
  return readJson<PodcastOverviewResponse>(path.join(TEST_DATA_DIR, "podcast", `${id}.json`));
}

export function getEpisodeData(episodeId: string): EpisodePageResponse | null {
  if (useLiveDb()) {
    const ep = getEpisodeById(episodeId);
    if (!ep) return null;
    const c = getClassificationByEpisode(episodeId);
    const g = getGeometryByEpisode(episodeId);
    const overview = getPodcastOverview(ep.podcast_id);
    if (!overview) return null;
    return buildEpisodePage(ep, c, g, overview.metrics);
  }
  const index = readJson<Record<string, string>>(path.join(TEST_DATA_DIR, "episode-index.json"));
  const safe = index?.[episodeId];
  if (!safe) return null;
  return readJson<EpisodePageResponse>(path.join(TEST_DATA_DIR, "episode", `${safe}.json`));
}

export function getCompareData(id1: string, id2: string): CompareResponse | null {
  if (useLiveDb()) {
    const o1 = getPodcastOverview(id1);
    const o2 = getPodcastOverview(id2);
    if (!o1 || !o2) return null;
    return buildCompare({ podcast: o1.podcast, metrics: o1.metrics }, { podcast: o2.podcast, metrics: o2.metrics });
  }
  const file = path.join(TEST_DATA_DIR, "compare", `${id1}_vs_${id2}.json`);
  let data = readJson<CompareResponse>(file);
  if (!data) data = readJson<CompareResponse>(path.join(TEST_DATA_DIR, "compare", `${id2}_vs_${id1}.json`));
  return data;
}

export type DiscoverEpisode = { episode: Episode; geometry: EpisodeGeometry; podcast: Podcast };

export function getEpisodesByGameData(game: string): DiscoverEpisode[] {
  if (useLiveDb()) {
    const rows = getEpisodesByGame(game);
    return rows.map(({ episode, classification, geometry, podcast }) => ({
      episode: mapEpisode(episode),
      geometry: mapGeometry(geometry, classification),
      podcast: mapPodcast(podcast),
    }));
  }
  return deriveDiscoverEpisodesFromTestData((g) => g.primary_game === game || g.secondary_game === game);
}

export function getBoundaryEpisodesData(): DiscoverEpisode[] {
  if (useLiveDb()) {
    const rows = getBoundaryEpisodes();
    return rows.map(({ episode, classification, geometry, podcast }) => ({
      episode: mapEpisode(episode),
      geometry: mapGeometry(geometry, classification),
      podcast: mapPodcast(podcast),
    }));
  }
  return deriveDiscoverEpisodesFromTestData((g) => g.boundary_flag);
}

function deriveDiscoverEpisodesFromTestData(
  filter: (g: { primary_game: string; secondary_game?: string; boundary_flag: boolean }) => boolean
): DiscoverEpisode[] {
  const index = readJson<Array<{ podcast: Podcast; metrics: PodcastOverviewResponse["metrics"] }>>(
    path.join(TEST_DATA_DIR, "podcasts-index.json")
  );
  if (!index) return [];
  const out: DiscoverEpisode[] = [];
  for (const { podcast } of index) {
    const overview = readJson<PodcastOverviewResponse>(path.join(TEST_DATA_DIR, "podcast", `${podcast.id}.json`));
    if (!overview) continue;
    for (let i = 0; i < overview.episodes_geometry.length; i++) {
      const geometry = overview.episodes_geometry[i]!;
      if (!filter(geometry)) continue;
      const episode: Episode = {
        id: geometry.episode_id,
        podcast_id: overview.podcast.id,
        title: `Episode ${i + 1}`,
        episode_number: i + 1,
        published_at: undefined,
        duration_seconds: undefined,
        transcript_url: undefined,
      };
      out.push({ episode, geometry, podcast: overview.podcast });
    }
  }
  return out;
}
