/**
 * Map podcast_data.db rows → MetaSPN API shapes.
 * Derives metrics from classification + geometry (DB has no podcast_metrics).
 */

import type { Game } from "@/lib/types/metaspn";
import type {
  Podcast,
  PodcastMetrics,
  Episode,
  EpisodeGeometry,
  EpisodeClassification,
  EpisodeExperience,
  PodcastOverviewResponse,
  EpisodePageResponse,
  CompareResponse,
} from "@/lib/types/metaspn";
import type {
  DbPodcast,
  DbEpisode,
  DbEpisodeClassification,
  DbEpisodeGeometry,
} from "./schema";
import { parseGameProbs, parsePca } from "./index";

const GAMES: Game[] = ["G1", "G2", "G3", "G4", "G5", "G6"];

function ensureGame(s: string | null): Game {
  if (s && GAMES.includes(s as Game)) return s as Game;
  return "G2";
}

// ---------- Podcast ----------

export function mapPodcast(db: DbPodcast): Podcast {
  return {
    id: db.podcast_id,
    title: db.title,
    image_url: db.image_url,
    description: db.description ?? undefined,
    rss_feed_url: db.rss_url ?? undefined,
  };
}

// ---------- Metrics (derived) ----------

export function deriveMetrics(
  podcastId: string,
  classifications: DbEpisodeClassification[],
  geometries: DbEpisodeGeometry[]
): PodcastMetrics {
  const gameCounts: Record<Game, number> = {
    G1: 0,
    G2: 0,
    G3: 0,
    G4: 0,
    G5: 0,
    G6: 0,
  };
  let entropySum = 0;
  let entropyN = 0;
  let marginSum = 0;
  let marginN = 0;
  let boundaryCount = 0;

  for (const c of classifications) {
    const g = ensureGame(c.game_top1);
    gameCounts[g]++;
    if (c.entropy != null) {
      entropySum += c.entropy;
      entropyN++;
    }
  }

  for (const g of geometries) {
    if (g.margin != null) {
      marginSum += g.margin;
      marginN++;
    }
    if (g.boundary_flag === 1) boundaryCount++;
  }

  const total = classifications.length || 1;
  const dominantGame = (GAMES.map((game) => [game, gameCounts[game]] as const) as [Game, number][])
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "G2";
  const dist = gameCounts[dominantGame] ?? 0;
  const dominantFraction = dist / total;

  const entropyMean = entropyN ? entropySum / entropyN : 1.5;
  const marginMean = marginN ? marginSum / marginN : 0.5;
  const boundaryRate = total ? boundaryCount / total : 0;

  const experienceType: "Convergent" | "Boundary" =
    dominantFraction >= 0.6 && boundaryRate < 0.2 ? "Convergent" : "Boundary";
  const experienceScoreRaw = 100 * (1 - Math.min(entropyMean / 2.5, 1)) * (0.5 + 0.5 * dominantFraction);
  const experience_score_final = Math.max(0, Math.min(100, Math.round(experienceScoreRaw)));

  const game_distribution: Record<Game, number> = { G1: 0, G2: 0, G3: 0, G4: 0, G5: 0, G6: 0 };
  GAMES.forEach((game) => {
    game_distribution[game] = total ? (100 * (gameCounts[game] ?? 0)) / total : 0;
  });

  return {
    podcast_id: podcastId,
    dominant_game: dominantGame,
    experience_type: experienceType,
    experience_score_final,
    margin_mean: marginMean,
    entropy_mean: entropyMean,
    phase_count: 1,
    game_distribution,
  };
}

// ---------- Episode ----------

export function mapEpisode(db: DbEpisode): Episode {
  return {
    id: db.episode_id,
    podcast_id: db.podcast_id,
    title: db.title ?? "Untitled",
    episode_number: db.episode_number ?? undefined,
    published_at: db.published_at ?? undefined,
    duration_seconds: db.duration_seconds ?? undefined,
    transcript_url: db.transcript_url ?? undefined,
  };
}

// ---------- Geometry ----------

export function mapGeometry(
  db: DbEpisodeGeometry,
  classification: DbEpisodeClassification | null
): EpisodeGeometry {
  const primary = ensureGame(db.primary_game ?? classification?.game_top1 ?? null);
  const secondary = db.secondary_game ?? classification?.game_top2 ?? undefined;
  const probs = classification ? parseGameProbs(classification.game_probs) : null;
  const distances: Record<Game, number> = { G1: 1, G2: 1, G3: 1, G4: 1, G5: 1, G6: 1 };
  if (probs) {
    GAMES.forEach((g) => {
      const p = probs[g] ?? 0;
      distances[g] = 1 - p;
    });
  }
  const pca = parsePca(db.pca);
  const margin = db.margin ?? 0.5;

  return {
    episode_id: db.episode_id,
    pca: pca ?? { pc1: 0, pc2: 0 },
    primary_game: primary,
    secondary_game: secondary ? ensureGame(secondary) : undefined,
    margin,
    boundary_flag: db.boundary_flag === 1,
    distances_to_manifolds: distances,
  };
}

// ---------- Classification ----------

export function mapClassification(
  db: DbEpisodeClassification
): EpisodeClassification {
  const probs = parseGameProbs(db.game_probs);
  const top1 = ensureGame(db.game_top1);
  const top2 = db.game_top2 ? ensureGame(db.game_top2) : undefined;
  const p1 = probs?.[top1] ?? 0.5;
  const p2 = top2 ? (probs?.[top2] ?? 0.2) : undefined;

  return {
    episode_id: db.episode_id,
    game_top1: top1,
    game_top2: top2,
    confidence_top1: p1,
    confidence_top2: p2,
  };
}


// ---------- Experience (derived; DB has no episode_experience) ----------

export function deriveExperience(
  episodeId: string,
  classification: DbEpisodeClassification | null,
  metrics: PodcastMetrics
): EpisodeExperience {
  const entropy = classification?.entropy ?? 1.5;
  const score = Math.max(0, Math.min(100, 100 * (1 - Math.min(entropy / 2.5, 1))));
  return {
    episode_id: episodeId,
    experience_score: Math.round(score),
    rolling_entropy: entropy,
    rolling_margin_median: metrics.margin_mean,
  };
}

// ---------- Centroids (placeholder; DB has no podcast_manifolds) ----------

export function placeholderCentroids(dominantGame: Game): Record<Game, { centroid: { pc1: number; pc2: number }; radius?: number }> {
  const base: Record<Game, [number, number]> = {
    G1: [-2, -1],
    G2: [0, -2],
    G3: [2, -1],
    G4: [-1, 1],
    G5: [1, 1],
    G6: [0, 2],
  };
  const out: Record<Game, { centroid: { pc1: number; pc2: number }; radius?: number }> = {} as any;
  GAMES.forEach((g) => {
    const [pc1, pc2] = base[g];
    out[g] = { centroid: { pc1, pc2 } };
  });
  return out;
}

// ---------- Overview ----------

export function buildPodcastOverview(
  podcast: DbPodcast,
  episodes: DbEpisode[],
  classifications: DbEpisodeClassification[],
  geometries: DbEpisodeGeometry[]
): PodcastOverviewResponse {
  const metrics = deriveMetrics(podcast.podcast_id, classifications, geometries);
  const byEpisode = (id: string) => ({
    c: classifications.find((x) => x.episode_id === id) ?? null,
    g: geometries.find((x) => x.episode_id === id) ?? null,
  });
  const geoList: EpisodeGeometry[] = [];
  const expList: EpisodeExperience[] = [];
  for (const e of episodes) {
    const { c, g } = byEpisode(e.episode_id);
    const geom = g
      ? mapGeometry(g, c)
      : mapGeometry(
          {
            episode_id: e.episode_id,
            primary_game: c?.game_top1 ?? null,
            secondary_game: c?.game_top2 ?? null,
            margin: null,
            boundary_flag: 0,
            pca: null,
            distance_primary: null,
            distance_secondary: null,
          },
          c
        );
    geoList.push(geom);
    expList.push(deriveExperience(e.episode_id, c, metrics));
  }
  const centroids = placeholderCentroids(metrics.dominant_game);

  return {
    podcast: mapPodcast(podcast),
    metrics,
    episodes_geometry: geoList,
    episodes_experience: expList,
    centroids,
  };
}

// ---------- Episode page ----------

export function buildEpisodePage(
  episode: DbEpisode,
  classification: DbEpisodeClassification | null,
  geometry: DbEpisodeGeometry | null,
  metrics: PodcastMetrics
): EpisodePageResponse {
  const c = classification ?? {
    episode_id: episode.episode_id,
    game_top1: null,
    game_top2: null,
    game_probs: null,
    entropy: null,
    quality_score: null,
  };
  const g = geometry ?? {
    episode_id: episode.episode_id,
    primary_game: null,
    secondary_game: null,
    margin: null,
    boundary_flag: 0,
    pca: null,
    distance_primary: null,
    distance_secondary: null,
  };
  return {
    episode: mapEpisode(episode),
    classification: mapClassification(c),
    geometry: mapGeometry(g, c),
    experience: deriveExperience(episode.episode_id, c, metrics),
    segments: [],
    evidence: [],
  };
}

// ---------- Compare ----------

export function buildCompare(
  o1: { podcast: Podcast; metrics: PodcastMetrics },
  o2: { podcast: Podcast; metrics: PodcastMetrics }
): CompareResponse {
  const G = GAMES;
  const game_overlap = G.reduce(
    (acc, g) => {
      acc[g] = { podcast1: o1.metrics.game_distribution[g], podcast2: o2.metrics.game_distribution[g] };
      return acc;
    },
    {} as Record<Game, { podcast1: number; podcast2: number }>
  );
  return {
    podcast1: { podcast: o1.podcast, metrics: o1.metrics },
    podcast2: { podcast: o2.podcast, metrics: o2.metrics },
    comparison: {
      game_overlap,
      experience_trajectory_diff: Math.abs(o1.metrics.experience_score_final - o2.metrics.experience_score_final),
      margin_distribution_diff: Math.abs(o1.metrics.margin_mean - o2.metrics.margin_mean),
    },
  };
}
