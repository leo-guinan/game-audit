/**
 * Query podcast_data.db and write test-data JSON for MetaSPN UI.
 * Run: PODCAST_DB_PATH=/path/to/podcast_data.db pnpm tsx scripts/dump-podcast-test-data.ts
 */

import * as fs from "fs";
import * as path from "path";
import {
  openDb,
  closeDb,
  isDbAvailable,
  getAllPodcasts,
  getEpisodesByPodcast,
  getEpisodeById,
  getClassificationsByPodcast,
  getClassificationByEpisode,
  getGeometryByPodcast,
  getGeometryByEpisode,
} from "../src/lib/podcast-db";
import {
  buildPodcastOverview,
  buildEpisodePage,
  buildCompare,
} from "../src/lib/podcast-db/map-to-metaspn";
import type { PodcastOverviewResponse, CompareResponse } from "../src/lib/types/metaspn";

const OUT_DIR = path.join(process.cwd(), "src/lib/test-data");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeJson<T>(file: string, data: T) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
  console.log("Wrote", file);
}

function main() {
  if (!isDbAvailable()) {
    console.error("podcast_data.db not available. Set PODCAST_DB_PATH.");
    process.exit(1);
  }

  try {
    const podcasts = getAllPodcasts();
    console.log("Podcasts:", podcasts.length, podcasts.map((p) => p.podcast_id));

    ensureDir(OUT_DIR);

    const overviews: Record<string, PodcastOverviewResponse> = {};

    for (const p of podcasts) {
      const episodes = getEpisodesByPodcast(p.podcast_id);
      const classifications = getClassificationsByPodcast(p.podcast_id);
      const geometries = getGeometryByPodcast(p.podcast_id);
      const overview = buildPodcastOverview(p, episodes, classifications, geometries);
      overviews[p.podcast_id] = overview;
      writeJson(path.join(OUT_DIR, "podcast", `${p.podcast_id}.json`), overview);
    }

    writeJson(path.join(OUT_DIR, "podcasts-index.json"), Object.values(overviews).map((o) => ({ podcast: o.podcast, metrics: o.metrics })));

    const episodeIndex: Record<string, string> = {};
    for (const p of podcasts) {
      const episodes = getEpisodesByPodcast(p.podcast_id);
      const overview = overviews[p.podcast_id]!;
      for (let i = 0; i < Math.min(5, episodes.length); i++) {
        const episodeId = episodes[i].episode_id;
        const ep = getEpisodeById(episodeId);
        const c = getClassificationByEpisode(episodeId);
        const g = getGeometryByEpisode(episodeId);
        if (!ep) continue;
        const page = buildEpisodePage(ep, c, g, overview.metrics);
        const safe = episodeId.replace(/[/:]/g, "_");
        writeJson(path.join(OUT_DIR, "episode", `${safe}.json`), page);
        episodeIndex[episodeId] = safe;
      }
    }
    writeJson(path.join(OUT_DIR, "episode-index.json"), episodeIndex);

    if (podcasts.length >= 2) {
      const o1 = overviews[podcasts[0].podcast_id]!;
      const o2 = overviews[podcasts[1].podcast_id]!;
      const compare = buildCompare(
        { podcast: o1.podcast, metrics: o1.metrics },
        { podcast: o2.podcast, metrics: o2.metrics }
      );
      writeJson(
        path.join(OUT_DIR, "compare", `${podcasts[0].podcast_id}_vs_${podcasts[1].podcast_id}.json`),
        compare
      );
    }

    writeJson(path.join(OUT_DIR, "meta.json"), {
      source: "podcast_data.db",
      dbPath: process.env.PODCAST_DB_PATH ?? "/Users/leoguinan/founder_scraper/podcast_data.db",
      generatedAt: new Date().toISOString(),
      podcastIds: podcasts.map((p) => p.podcast_id),
      episodeCount: Object.keys(episodeIndex).length,
    });
  } finally {
    closeDb();
  }
}

main();
