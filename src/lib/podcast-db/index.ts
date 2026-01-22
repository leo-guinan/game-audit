/**
 * SQLite access for podcast_data.db.
 * Use PODCAST_DB_PATH env (default: founder_scraper co-located path).
 */

import Database from "better-sqlite3";
import type {
  DbPodcast,
  DbEpisode,
  DbEpisodeClassification,
  DbEpisodeGeometry,
  DbEpisodeEmbedding,
  GameProbs,
  PcaPoint,
} from "./schema";

const DEFAULT_DB_PATH = "/Users/leoguinan/founder_scraper/podcast_data.db";

let _db: Database.Database | null = null;

export function openDb(): Database.Database {
  if (_db) return _db;
  const dbPath = process.env.PODCAST_DB_PATH || DEFAULT_DB_PATH;
  _db = new Database(dbPath, { readonly: true });
  return _db;
}

export function closeDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}

export function isDbAvailable(): boolean {
  try {
    openDb();
    return true;
  } catch {
    return false;
  }
}

// ---------- Podcasts ----------

export function getAllPodcasts(): DbPodcast[] {
  const db = openDb();
  const rows = db.prepare("SELECT podcast_id, title, image_url, description, rss_url, episode_count, hosts FROM podcast").all() as DbPodcast[];
  return rows;
}

// ---------- Episodes ----------

export function getEpisodesByPodcast(podcastId: string): DbEpisode[] {
  const db = openDb();
  const rows = db
    .prepare(
      "SELECT episode_id, podcast_id, title, episode_number, published_at, duration_seconds, transcript_url FROM episode WHERE podcast_id = ? ORDER BY COALESCE(episode_number, 999999) ASC, published_at ASC"
    )
    .all(podcastId) as DbEpisode[];
  return rows;
}

export function getEpisodeById(episodeId: string): DbEpisode | null {
  const db = openDb();
  const row = db
    .prepare(
      "SELECT episode_id, podcast_id, title, episode_number, published_at, duration_seconds, transcript_url FROM episode WHERE episode_id = ?"
    )
    .get(episodeId) as DbEpisode | undefined;
  return row ?? null;
}

// ---------- Classification ----------

export function getClassificationsByPodcast(
  podcastId: string
): DbEpisodeClassification[] {
  const db = openDb();
  const rows = db
    .prepare(
      `SELECT ec.episode_id, ec.game_top1, ec.game_top2, ec.game_probs, ec.entropy, ec.quality_score
       FROM episode_classification ec
       JOIN episode e ON e.episode_id = ec.episode_id
       WHERE e.podcast_id = ?
       ORDER BY COALESCE(e.episode_number, 999999) ASC, e.published_at ASC`
    )
    .all(podcastId) as DbEpisodeClassification[];
  return rows;
}

export function getClassificationByEpisode(
  episodeId: string
): DbEpisodeClassification | null {
  const db = openDb();
  const row = db
    .prepare(
      "SELECT episode_id, game_top1, game_top2, game_probs, entropy, quality_score FROM episode_classification WHERE episode_id = ?"
    )
    .get(episodeId) as DbEpisodeClassification | undefined;
  return row ?? null;
}

// ---------- Geometry ----------

export function getGeometryByPodcast(
  podcastId: string
): DbEpisodeGeometry[] {
  const db = openDb();
  const rows = db
    .prepare(
      `SELECT eg.episode_id, eg.primary_game, eg.secondary_game, eg.margin, eg.boundary_flag, eg.pca, eg.distance_primary, eg.distance_secondary
       FROM episode_geometry eg
       JOIN episode e ON e.episode_id = eg.episode_id
       WHERE e.podcast_id = ?
       ORDER BY COALESCE(e.episode_number, 999999) ASC, e.published_at ASC`
    )
    .all(podcastId) as DbEpisodeGeometry[];
  return rows;
}

export function getGeometryByEpisode(
  episodeId: string
): DbEpisodeGeometry | null {
  const db = openDb();
  const row = db
    .prepare(
      "SELECT episode_id, primary_game, secondary_game, margin, boundary_flag, pca, distance_primary, distance_secondary FROM episode_geometry WHERE episode_id = ?"
    )
    .get(episodeId) as DbEpisodeGeometry | undefined;
  return row ?? null;
}

// ---------- Discover: episodes by game / boundary ----------

export function getEpisodesByGame(game: string): Array<{
  episode: DbEpisode;
  classification: DbEpisodeClassification;
  geometry: DbEpisodeGeometry;
  podcast: DbPodcast;
}> {
  const db = openDb();
  const rows = db
    .prepare(
      `SELECT e.episode_id, e.podcast_id, e.title, e.episode_number, e.published_at, e.duration_seconds, e.transcript_url,
              ec.game_top1, ec.game_top2, ec.game_probs, ec.entropy, ec.quality_score,
              eg.primary_game, eg.secondary_game, eg.margin, eg.boundary_flag, eg.pca, eg.distance_primary, eg.distance_secondary,
              p.podcast_id as p_podcast_id, p.title as p_title, p.image_url as p_image_url, p.description as p_description, p.rss_url as p_rss_url, p.episode_count as p_episode_count, p.hosts as p_hosts
       FROM episode e
       JOIN episode_classification ec ON ec.episode_id = e.episode_id
       JOIN episode_geometry eg ON eg.episode_id = e.episode_id
       JOIN podcast p ON p.podcast_id = e.podcast_id
       WHERE ec.game_top1 = ? OR ec.game_top2 = ?
       ORDER BY e.published_at DESC
       LIMIT 200`
    )
    .all(game, game) as Record<string, unknown>[];
  return rows.map((r) => ({
    episode: {
      episode_id: r.episode_id as string,
      podcast_id: r.podcast_id as string,
      title: r.title as string | null,
      episode_number: r.episode_number as number | null,
      published_at: r.published_at as string | null,
      duration_seconds: r.duration_seconds as number | null,
      transcript_url: r.transcript_url as string | null,
    },
    classification: {
      episode_id: r.episode_id as string,
      game_top1: r.game_top1 as string | null,
      game_top2: r.game_top2 as string | null,
      game_probs: r.game_probs as string | null,
      entropy: r.entropy as number | null,
      quality_score: r.quality_score as number | null,
    },
    geometry: {
      episode_id: r.episode_id as string,
      primary_game: r.primary_game as string | null,
      secondary_game: r.secondary_game as string | null,
      margin: r.margin as number | null,
      boundary_flag: r.boundary_flag as number,
      pca: r.pca as string | null,
      distance_primary: r.distance_primary as number | null,
      distance_secondary: r.distance_secondary as number | null,
    },
    podcast: {
      podcast_id: r.p_podcast_id as string,
      title: r.p_title as string,
      image_url: r.p_image_url as string | null,
      description: r.p_description as string | null,
      rss_url: r.p_rss_url as string | null,
      episode_count: r.p_episode_count as number,
      hosts: r.p_hosts as string | null,
    },
  }));
}

export function getBoundaryEpisodes(): Array<{
  episode: DbEpisode;
  classification: DbEpisodeClassification;
  geometry: DbEpisodeGeometry;
  podcast: DbPodcast;
}> {
  const db = openDb();
  const rows = db
    .prepare(
      `SELECT e.episode_id, e.podcast_id, e.title, e.episode_number, e.published_at, e.duration_seconds, e.transcript_url,
              ec.game_top1, ec.game_top2, ec.game_probs, ec.entropy, ec.quality_score,
              eg.primary_game, eg.secondary_game, eg.margin, eg.boundary_flag, eg.pca, eg.distance_primary, eg.distance_secondary,
              p.podcast_id as p_podcast_id, p.title as p_title, p.image_url as p_image_url, p.description as p_description, p.rss_url as p_rss_url, p.episode_count as p_episode_count, p.hosts as p_hosts
       FROM episode e
       JOIN episode_classification ec ON ec.episode_id = e.episode_id
       JOIN episode_geometry eg ON eg.episode_id = e.episode_id
       JOIN podcast p ON p.podcast_id = e.podcast_id
       WHERE eg.boundary_flag = 1
       ORDER BY e.published_at DESC
       LIMIT 200`
    )
    .all() as Record<string, unknown>[];
  return rows.map((r) => ({
    episode: {
      episode_id: r.episode_id as string,
      podcast_id: r.podcast_id as string,
      title: r.title as string | null,
      episode_number: r.episode_number as number | null,
      published_at: r.published_at as string | null,
      duration_seconds: r.duration_seconds as number | null,
      transcript_url: r.transcript_url as string | null,
    },
    classification: {
      episode_id: r.episode_id as string,
      game_top1: r.game_top1 as string | null,
      game_top2: r.game_top2 as string | null,
      game_probs: r.game_probs as string | null,
      entropy: r.entropy as number | null,
      quality_score: r.quality_score as number | null,
    },
    geometry: {
      episode_id: r.episode_id as string,
      primary_game: r.primary_game as string | null,
      secondary_game: r.secondary_game as string | null,
      margin: r.margin as number | null,
      boundary_flag: r.boundary_flag as number,
      pca: r.pca as string | null,
      distance_primary: r.distance_primary as number | null,
      distance_secondary: r.distance_secondary as number | null,
    },
    podcast: {
      podcast_id: r.p_podcast_id as string,
      title: r.p_title as string,
      image_url: r.p_image_url as string | null,
      description: r.p_description as string | null,
      rss_url: r.p_rss_url as string | null,
      episode_count: r.p_episode_count as number,
      hosts: r.p_hosts as string | null,
    },
  }));
}

// ---------- Embeddings (for Chroma lookup) ----------

export function getEmbeddingByEpisode(
  episodeId: string
): DbEpisodeEmbedding | null {
  const db = openDb();
  const row = db
    .prepare(
      "SELECT episode_id, embedding_model, embedding_dim, embedding_id_full, embedding_id_host_only, embedding_id_guest_only FROM episode_embedding WHERE episode_id = ?"
    )
    .get(episodeId) as DbEpisodeEmbedding | undefined;
  return row ?? null;
}

// ---------- Helpers ----------

export function parseGameProbs(json: string | null): GameProbs | null {
  if (!json || !json.trim()) return null;
  try {
    return JSON.parse(json) as GameProbs;
  } catch {
    return null;
  }
}

export function parsePca(json: string | null): PcaPoint | null {
  if (!json || !json.trim()) return null;
  try {
    const o = JSON.parse(json) as { pc1?: number; pc2?: number };
    if (typeof o?.pc1 === "number" && typeof o?.pc2 === "number")
      return { pc1: o.pc1, pc2: o.pc2 };
    return null;
  } catch {
    return null;
  }
}
